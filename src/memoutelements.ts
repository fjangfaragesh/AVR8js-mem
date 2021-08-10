import {MemOut} from "./memout.ts";
import * as echarts from 'echarts';
import AVR8_REGISTER from "./avr8register.js";

AVR8_REGISTER["DUMMY"] = "DUMMY";

function parseAddress(a) {
    return isNaN(a*1) ? window.AVR8_REGISTER[a] : a*1;
}

class MemOutElement extends HTMLElement implements MemOut {
    static get observedAttributes() {
        return MemOutElement.observedAttributesArray;
    }
    
    constructor() {
        super();
        this._typeStr = "hex";
        this.memOutType = new MemOutType(this);
        this.observedAttributesValues = {};
        console.log(this);
    }
    updateData(data: Uint8Array, currentCycle: Number) : void {
        this.memOutType.updateData(data,currentCycle);
    }
    
    
    connectedCallback() {
        this.memOutType.showValue();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "type") {
            switch (newValue) {
                case "bin":
                case "hex":
                case "uint":
                    this.setMemOutType(new MemOutTypeText(this,newValue));
                    break;
                case "diagram":
                    this.setMemOutType(new MemOutTypeDiagram(this));
                    break;
                case "diagram2":
                    this.setMemOutType(new MemOutTypeDiagram2(this));
                    break;
                case "custom":
                    this.setMemOutType(new MemOutTypeTextCustom(this));
                    break;
                default:
                    this.setMemOutType(new MemOutType(this));
            }
        } else {
            this.observedAttributesValues[name] = newValue;
            this.memOutType.attributeChangedCallback(name, oldValue, newValue);
        }
    }
    setMemOutType(m) {
        this.memOutType = m;
        let kys = Object.keys(this.observedAttributesValues);
        for (let k of kys) m.attributeChangedCallback(k,null,this.observedAttributesValues[k]);
    }
    
    getAddress() {
        return this._address;
    }
}
MemOutElement.observedAttributesArray = ["type","address","bytes","endian","width","height","min","max","color","colors","bgcolor","interval","output","outputs","title","labels"];


class MemOutType {
    constructor(elm) {
        this.elm = elm;
    }
    showValue() {
        this.elm.innerHTML = "missing memout type :(";
    }
    attributeChangedCallback(name, oldValue, newValue) {

    }
    updateData(data: Uint8Array) : void {

    }
}


class MemOutTypeText extends MemOutType {
    constructor(elm, outputType) {
        super(elm);
        this._addressStr = "no address";
        this._address = -1;
        this._bytes = 1;
        this._endian = "little";
        this._valueStr = "unknown";
        this._outputType = outputType;
    }
    showValue() {
        this.elm.innerHTML = "";
        let addrText = this._addressStr;
        if (this._bytes >= 2) {
            addrText += "," + this._bytes + " bytes, " + this._endian + "endian";
        }
        this.elm.appendChild(document.createTextNode(addrText + ": " + this._valueStr));   
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "address") {
            this._addressStr = newValue;
            this._address = parseAddress(newValue);
            console.log(newValue,"->",this._address);
        }
        if (name === "bytes") this._bytes = newValue*1;
        if (name === "endian") this._endian = newValue;
        this.showValue();
    }
    updateData(data: Uint8Array) : void {
        let le = this._endian === "little";
        let a = this._address;
        switch (this._outputType) {
            case "uint":
                let v = 0;
                for (let i = 0; i < this._bytes; i++) {
                    if (le) {
                        v = v | (data[a+i] << (i*8));
                    } else {
                        v = (v << 8) | data[a+i];
                    }
                }
                this._valueStr = v+"";
                break;
           case "bin":
                this._valueStr = "";
                for (let i = 0; i < this._bytes; i++) {
                    let x = data[a+i];
                    let by = BIN[(x >> 7) & 1] + BIN[(x >> 6) & 1] + BIN[(x >> 5) & 1] + BIN[(x >> 4) & 1] + BIN[(x >> 3) & 1] + BIN[(x >> 2) & 1] + BIN[(x >> 1) & 1] + BIN[x & 1];
                    if (le) {
                        this._valueStr = by + this._valueStr;
                    } else {
                        this._valueStr = this._valueStr + by;
                    }
                }
                break;
           case "hex":
           default:
                this._valueStr = "";
                for (let i = 0; i < this._bytes; i++) {
                    let by = HEX[(data[a+i] >> 4) & 0xf] + HEX[data[a+i] & 0xf];
                    if (le) {
                        this._valueStr = by + this._valueStr;
                    } else {
                        this._valueStr = this._valueStr + by;
                    }
                }
                break;
        }
        this.showValue();
    }
}

class MemOutTypeTextCustom extends MemOutType {
    constructor(elm) {
        super(elm);
        this._valueStr = "";
        this._outputFunction = function(data,currentCycle) {return ""};
    }
    showValue() {
        this.elm.innerHTML = "";
        this.elm.appendChild(document.createTextNode(this._valueStr));   
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "output") {
            this._outputFunction = function(data,currentCycle) {return eval(newValue)};
        }
        this.showValue();
    }
    updateData(data: Uint8Array, currentCycle: Number) : void {
        this._valueStr = this._outputFunction(data,currentCycle);
        this.showValue();
    }
}

/*

class MemOutTypeDiagram extends MemOutType {
    constructor(elm) {
        super(elm);
        this._addressStr = "no address";
        this._address = -1;
        this._bytes = 1;
        this._endian = "little";
        this.elm.innerHTML = "";
        this._addresDiv = document.createElement("div");
        this.elm.appendChild(this._addresDiv);
        this._canvas = document.createElement("canvas");
        this.elm.appendChild(this._canvas);
        this._ctx = this._canvas.getContext("2d");
        this._width = 300;
        this._height = 100;
        this._canvas.width = this._width;
        this._canvas.height = this._width;
        this._yValues = [];//between 0 and 1
        this._min = 0;
        this._max = "auto";
        this._bgcolor = "#ffffff";
        this._color = "#000000";
    }
    showValue() {
        this._addresDiv.innerHTML = "";
        let addrText = this._addressStr;
        if (this._bytes >= 2) {
            addrText += "," + this._bytes + " bytes, " + this._endian + "endian";
        }
        this._addresDiv.appendChild(document.createTextNode(addrText + ":"));
        this._ctx.fillStyle = this._bgcolor;
        this._ctx.fillRect(0,0,this._width,this._height);
        this._ctx.fillStyle = this._color;
        for (let i = 0; i < this._yValues.length; i++) {
            this._ctx.fillRect(i,(1-this._yValues[i])*this._height,1,this._yValues[i]*this._height);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "address") {
            this._addressStr = newValue;
            this._address = parseAddress(newValue);
        }
        if (name === "bytes") this._bytes = newValue*1;
        if (name === "endian") this._endian = newValue;
        if (name === "width") {
            this._width = newValue*1;
            this._canvas.width = newValue*1;
        }
        if (name === "height") {
            this._height = newValue*1;
            this._canvas.height = newValue*1;
        }
        if (name === "min") this._min = newValue*1;
        if (name === "max") {
            if (newValue === "auto") {
                this._max = "auto";
            } else {
                this._max = newValue*1;
            }
        }
        if (name === "color") this._color = newValue;
        if (name === "bgcolor") this._bgcolor = newValue;

        this.showValue();
    }
    updateData(data: Uint8Array) : void {
        let le = this._endian === "little";
        let a = this._address;
        let v = 0;
        for (let i = 0; i < this._bytes; i++) {
            if (le) {
                v = v | (data[a+i] << (i*8));
            } else {
                v = (v << 8) | data[a+i];
            }
        }
        if (this._yValues.length >= this._width) this._yValues.splice(0,this._yValues.length - this._width + 1);
        let max = this._max;
        if (max === "auto") max = Math.pow(2,this._bytes*8);
        let min = this._min;
        this._yValues.push((v-min)/(max-min));
        this.showValue();
    }
}
*/

class MemOutTypeDiagram extends MemOutType {
    constructor(elm) {
        super(elm);
        this._addressStr = "no address";
        this._address = -1;
        this._bytes = 1;
        this._endian = "little";
        this.elm.innerHTML = "";
//        this._addresDiv = document.createElement("div");
//        this.elm.appendChild(this._addresDiv);
        this._eChartsDiv = document.createElement("div");
        this._eChartsDiv.style.width = "750px";
        this._eChartsDiv.style.height = "500px";
        this.elm.appendChild(this._eChartsDiv);
        this._width = 750;
        this._height = 500;
        this._data = [];
        this._min = 0;
        this._max = "auto";
 //       this._bgcolor = "#ffffff";
        this._color = "#000000";
        this._eChart = undefined;
        this._interval = 50000000;
    }
    showValue() {
        if (this._eChart === undefined) this._eChartsInit();
        this._eChart.setOption({
            xAxis: {
                    type: 'value',
                    min: this._data.length === 0 ? 0 : this._data[0][0],
                    max: this._data.length === 0 ? this._interval : this._data[0][0] + this._interval,
                    animation : false,
                    splitLine: {
                        show: false
                    }
            },
            series: [{
                    name: 'value',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: this._data
            }];
        });
    }
    
    _eChartsInit() {
        let addrText = this._addressStr;
        if (this._bytes >= 2) {
            addrText += "," + this._bytes + " bytes, " + this._endian + "endian";
        }
        this._eChart = echarts.init(this._eChartsDiv);
        var option = {
            color:this._color,
            title: {
                text: addrText
            },
            tooltip: {},
            xAxis: {},
            yAxis: {
                type: 'value',
                animation : false,
                min: this._min,
                max: this._max === "auto" ? Math.pow(2,this._bytes*8) : this._max,
                splitLine: {
                    show: false
                }
            }
        };
        this._eChart.setOption(option);
        
    }
    
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "address") {
            this._addressStr = newValue;
            this._address = parseAddress(newValue);
        }
        if (name === "bytes") this._bytes = newValue*1;
        if (name === "interval") this._interval = newValue*1;
        if (name === "endian") this._endian = newValue;
        if (name === "width") {
            this._width = newValue*1;
            this._eChartsDiv.style.width = newValue + "px";
        }
        if (name === "height") {
            this._height = newValue*1;
            this._eChartsDiv.style.height = newValue + "px";
        }
        if (name === "min") {
            this._min = newValue*1;
        }
        if (name === "max") {
            if (newValue === "auto") {
                this._max = "auto";
            } else {
                this._max = newValue*1;
            }
        }
        if (name === "color") this._color = newValue;
//        if (name === "bgcolor") this._bgcolor = newValue;
        echarts.dispose(this._eChartsDiv);
        this._eChart = undefined; // forces eChartsInit()
        this.showValue();
    }
    updateData(data: Uint8Array, currentCycle: Number) : void {
        let le = this._endian === "little";
        let a = this._address;
        let v = 0;
        for (let i = 0; i < this._bytes; i++) {
            if (le) {
                v = v | (data[a+i] << (i*8));
            } else {
                v = (v << 8) | data[a+i];
            }
        }
        while (true) {
            if (this._data.length === 0) break;
            if (this._data[0][0] + this._interval >= currentCycle) break;
            this._data.splice(0,1);
        }
        let max = this._max;
        if (max === "auto") max = Math.pow(2,this._bytes*8);
        let min = this._min;
        this._data.push([currentCycle,v]);
        this.showValue();
    }
}

class MemOutTypeDiagram2 extends MemOutType {
    constructor(elm) {
        super(elm);
        this.elm.innerHTML = "";
        this._eChartsDiv = document.createElement("div");
        this._eChartsDiv.style.width = "750px";
        this._eChartsDiv.style.height = "500px";
        this.elm.appendChild(this._eChartsDiv);
        this._width = 750;
        this._height = 500;
        this._datas = [];
        this._min = 0;
        this._max = "auto";
        this._color = "#000000";
        this._colors = ["blue"];
        this._labels = [];
        this._outputsFunction = function() {return []};
        this._eChart = undefined;
        this._interval = 50000000;
        this._title = "";
    }
    showValue() {
        if (this._eChart === undefined) this._eChartsInit();
        let oldestXValue = 0;
        if (this._datas.length != 0) if (this._datas[0].length != 0) oldestXValue = this._datas[0][0][0];
        let seriesArray = [];
        for (let i = 0; i < this._datas.length;i++) {
            let d = this._datas[i];
            seriesArray.push({
                    name: this._labels[i] ?? "value",
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: d,
                    emphasis: {
                        focus: 'series'
                    },
                    lineStyle: {
                        color:this._colors[i%this._colors.length]
                    },
                    itemStyle: {
                        color:this._colors[i%this._colors.length]
                    }
            });
        }
        this._eChart.setOption({
            xAxis: {
                    type: 'value',
                    min: oldestXValue,
                    max: oldestXValue + this._interval,
                    animation : false,
                    splitLine: {
                        show: false
                    }
            },
            series: seriesArray;
        });
    }
    
    _eChartsInit() {
        this._eChart = echarts.init(this._eChartsDiv);
        var option = {
            title: {
                text: this._title
            },
            tooltip: {
                order: 'valueDesc',
                trigger: 'axis'
            },            xAxis: {},
            yAxis: {
                type: 'value',
                min: this._min === "auto" ? undefined : this._min,
                max: this._max === "auto" ? undefined : this._max,
                animation : false,
                splitLine: {
                    show: false
                },
            }
        };
        this._eChart.setOption(option);
        
    }
    
    
    attributeChangedCallback(name, oldValue, newValue) {
        echarts.dispose(this._eChartsDiv);
        this._eChart = undefined; // forces eChartsInit()
        if (name === "interval") this._interval = newValue*1;
        if (name === "width") {
            this._width = newValue*1;
            this._eChartsDiv.style.width = newValue + "px";
        }
        if (name === "height") {
            this._height = newValue*1;
            this._eChartsDiv.style.height = newValue + "px";
        }
        if (name === "min") {
            if (newValue === "auto") {
                this._min = "auto";
            } else {
                this._min = newValue*1;
            }        }
        if (name === "max") {
            if (newValue === "auto") {
                this._max = "auto";
            } else {
                this._max = newValue*1;
            }
        }
        if (name === "title") this._title = newValue;
        if (name === "colors") {
            try {
                this._colors = JSON.parse(newValue);
                if (!(this._colors instanceof Array)) {
                    this._colors = [this._colors];
                } else if (this._colors.length == 0) {
                    this._colors = ["blue"];
                }
            } catch (e) {
                this._colors = [newValue];
            }
        }
        if (name === "labels") {
            try {
                this._labels = JSON.parse(newValue);
                if (!(this._labels instanceof Array)) {
                    this._labels = [this._labels];
                } else if (this._labels.length == 0) {
                    this._labels = ["blue"];
                }
            } catch (e) {
                this._labels = [newValue];
            }
        }
        if (name === "outputs") this._outputsFunction = function(data,currentCycle) {return eval(newValue)};
        this.showValue();
    }
    updateData(data: Uint8Array, currentCycle: Number) : void {
        for (let d of this._datas) while (true) {
            if (d.length === 0) break;
            if (d[0][0] + this._interval >= currentCycle) break;
            d.splice(0,1);
        }
        let max = this._max;
        if (max === "auto") max = Math.pow(2,this._bytes*8);
        let min = this._min;
        let outpts = this._outputsFunction(data,currentCycle);
        if (!(outpts instanceof Array)) outpts = [outpts];
        for (let i = 0; i < outpts.length; i++) {
            if (this._datas[i] === undefined) this._datas[i] = [];
            this._datas[i].push([currentCycle,outpts[i]])
        }
       );
        this.showValue();
    }
}


customElements.define('memout-element', MemOutElement);

const HEX = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
const BIN = ["0","1"];
