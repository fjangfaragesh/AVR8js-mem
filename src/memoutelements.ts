import {MemOut} from "./memout.ts";



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
    updateData(data: Uint8Array) : void {
        this.memOutType.updateData(data);
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
MemOutElement.observedAttributesArray = ["type","address","bytes","endian","width","height","min","max","color","bgcolor"];


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
            this._address = newValue*1;
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
            this._address = newValue*1;
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


customElements.define('memout-element', MemOutElement);

const HEX = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
const BIN = ["0","1"];
