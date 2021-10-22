require("@wokwi/elements");
var $hTKlw$echarts = require("echarts");
var $hTKlw$avr8js = require("avr8js");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire8e99"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire8e99"] = parcelRequire;
}

parcelRequire.register("bltH3", function(module, exports) {


var $05erC = parcelRequire("05erC");
(/*@__PURE__*/$parcel$interopDefault($05erC))["DUMMY"] = "DUMMY";
function parseAddress(a) {
    return isNaN(a * 1) ? window.AVR8_REGISTER[a] : a * 1;
}
class MemOutElement extends HTMLElement {
    static get observedAttributes() {
        return MemOutElement.observedAttributesArray;
    }
    updateData(data, currentCycle) {
        this.memOutType.updateData(data, currentCycle);
    }
    reset() {
        this.memOutType.reset();
    }
    connectedCallback() {
        this.memOutType.showValue();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "type") switch(newValue){
            case "bin":
            case "hex":
            case "uint":
                this.setMemOutType(new MemOutTypeText(this, newValue));
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
        else {
            this.observedAttributesValues[name] = newValue;
            this.memOutType.attributeChangedCallback(name, oldValue, newValue);
        }
    }
    setMemOutType(m) {
        this.memOutType = m;
        let kys = Object.keys(this.observedAttributesValues);
        for (let k of kys)m.attributeChangedCallback(k, null, this.observedAttributesValues[k]);
    }
    getAddress() {
        return this._address;
    }
    constructor(){
        super();
        this._typeStr = "hex";
        this.memOutType = new MemOutType(this);
        this.observedAttributesValues = {
        };
    //       console.log(this);
    }
}
MemOutElement.observedAttributesArray = [
    "type",
    "address",
    "bytes",
    "endian",
    "width",
    "height",
    "min",
    "max",
    "color",
    "colors",
    "bgcolor",
    "interval",
    "output",
    "outputs",
    "title",
    "labels"
];
class MemOutType {
    showValue() {
        this.elm.innerHTML = "missing memout type :(";
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
    updateData(data) {
    }
    reset() {
    }
    constructor(elm){
        this.elm = elm;
    }
}
// types uint, bin, hex
class MemOutTypeText extends MemOutType {
    showValue() {
        this.elm.innerHTML = "";
        let addrText = this._addressStr;
        if (this._bytes >= 2) addrText += "," + this._bytes + " bytes, " + this._endian + "endian";
        this.elm.appendChild(document.createTextNode(addrText + ": " + this._valueStr));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "address") {
            this._addressStr = newValue;
            this._address = parseAddress(newValue);
        //           console.log(newValue,"->",this._address);
        }
        if (name === "bytes") this._bytes = newValue * 1;
        if (name === "endian") this._endian = newValue;
        this.showValue();
    }
    updateData(data) {
        let le = this._endian === "little";
        let a = this._address;
        switch(this._outputType){
            case "uint":
                let v = 0;
                for(let i = 0; i < this._bytes; i++)if (le) v = v | data[a + i] << i * 8;
                else v = v << 8 | data[a + i];
                this._valueStr = v + "";
                break;
            case "bin":
                this._valueStr = "";
                for(let i1 = 0; i1 < this._bytes; i1++){
                    let x = data[a + i1];
                    let by = BIN[x >> 7 & 1] + BIN[x >> 6 & 1] + BIN[x >> 5 & 1] + BIN[x >> 4 & 1] + BIN[x >> 3 & 1] + BIN[x >> 2 & 1] + BIN[x >> 1 & 1] + BIN[x & 1];
                    if (le) this._valueStr = by + this._valueStr;
                    else this._valueStr = this._valueStr + by;
                }
                break;
            case "hex":
            default:
                this._valueStr = "";
                for(let i2 = 0; i2 < this._bytes; i2++){
                    let by = HEX[data[a + i2] >> 4 & 15] + HEX[data[a + i2] & 15];
                    if (le) this._valueStr = by + this._valueStr;
                    else this._valueStr = this._valueStr + by;
                }
                break;
        }
        this.showValue();
    }
    reset() {
        this._valueStr = "unknown";
        this.showValue();
    }
    constructor(elm, outputType){
        super(elm);
        this._addressStr = "no address";
        this._address = -1;
        this._bytes = 1;
        this._endian = "little";
        this._valueStr = "unknown";
        this._outputType = outputType;
    }
}
class MemOutTypeTextCustom extends MemOutType {
    showValue() {
        this.elm.innerHTML = "";
        this.elm.appendChild(document.createTextNode(this._valueStr));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "output") this._outputFunction = function(data, currentCycle) {
            return eval(newValue);
        };
        this.showValue();
    }
    updateData(data, currentCycle) {
        this._valueStr = this._outputFunction(data, currentCycle);
        this.showValue();
    }
    reset() {
        this._valueStr = "";
        this.showValue();
    }
    constructor(elm){
        super(elm);
        this._valueStr = "";
        this._outputFunction = function(data, currentCycle) {
            return "";
        };
    }
}
class MemOutTypeDiagram extends MemOutType {
    showValue() {
        if (this._eChart === undefined) this._eChartsInit();
        this._eChart.setOption({
            xAxis: {
                type: 'value',
                min: this._data.length === 0 ? 0 : this._data[0][0],
                max: this._data.length === 0 ? this._interval : this._data[0][0] + this._interval,
                animation: false,
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    name: 'value',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: this._data
                }
            ]
        });
    }
    _eChartsInit() {
        let addrText = this._addressStr;
        if (this._bytes >= 2) addrText += "," + this._bytes + " bytes, " + this._endian + "endian";
        this._eChart = $hTKlw$echarts.init(this._eChartsDiv);
        var option = {
            color: this._color,
            title: {
                text: addrText
            },
            tooltip: {
            },
            xAxis: {
            },
            yAxis: {
                type: 'value',
                animation: false,
                min: this._min,
                max: this._max === "auto" ? Math.pow(2, this._bytes * 8) : this._max,
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
        if (name === "bytes") this._bytes = newValue * 1;
        if (name === "interval") this._interval = newValue * 1;
        if (name === "endian") this._endian = newValue;
        if (name === "width") {
            this._width = newValue * 1;
            this._eChartsDiv.style.width = newValue + "px";
        }
        if (name === "height") {
            this._height = newValue * 1;
            this._eChartsDiv.style.height = newValue + "px";
        }
        if (name === "min") this._min = newValue * 1;
        if (name === "max") {
            if (newValue === "auto") this._max = "auto";
            else this._max = newValue * 1;
        }
        if (name === "color") this._color = newValue;
        //        if (name === "bgcolor") this._bgcolor = newValue;
        $hTKlw$echarts.dispose(this._eChartsDiv);
        this._eChart = undefined; // forces eChartsInit()
        this.showValue();
    }
    updateData(data, currentCycle) {
        let le = this._endian === "little";
        let a = this._address;
        let v = 0;
        for(let i = 0; i < this._bytes; i++)if (le) v = v | data[a + i] << i * 8;
        else v = v << 8 | data[a + i];
        while(true){
            if (this._data.length === 0) break;
            if (this._data[0][0] + this._interval >= currentCycle) break;
            this._data.splice(0, 1);
        }
        let max = this._max;
        if (max === "auto") max = Math.pow(2, this._bytes * 8);
        let min = this._min;
        this._data.push([
            currentCycle,
            v
        ]);
        this.showValue();
    }
    reset() {
        this._data = [];
        this.showValue();
    }
    constructor(elm){
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
}
class MemOutTypeDiagram2 extends MemOutType {
    showValue() {
        if (this._eChart === undefined) this._eChartsInit();
        let oldestXValue = 0;
        if (this._datas.length != 0) {
            if (this._datas[0].length != 0) oldestXValue = this._datas[0][0][0];
        }
        let seriesArray = [];
        for(let i = 0; i < this._datas.length; i++){
            let d = this._datas[i];
            var _i;
            seriesArray.push({
                name: (_i = this._labels[i]) !== null && _i !== void 0 ? _i : "value",
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: d,
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    color: this._colors[i % this._colors.length]
                },
                itemStyle: {
                    color: this._colors[i % this._colors.length]
                }
            });
        }
        this._eChart.setOption({
            xAxis: {
                type: 'value',
                min: oldestXValue,
                max: oldestXValue + this._interval,
                animation: false,
                splitLine: {
                    show: false
                }
            },
            series: seriesArray
        });
    }
    _eChartsInit() {
        this._eChart = $hTKlw$echarts.init(this._eChartsDiv);
        var option = {
            title: {
                text: this._title
            },
            tooltip: {
                order: 'valueDesc',
                trigger: 'axis'
            },
            xAxis: {
            },
            yAxis: {
                type: 'value',
                min: this._min === "auto" ? undefined : this._min,
                max: this._max === "auto" ? undefined : this._max,
                animation: false,
                splitLine: {
                    show: false
                }
            }
        };
        this._eChart.setOption(option);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        $hTKlw$echarts.dispose(this._eChartsDiv);
        this._eChart = undefined; // forces eChartsInit()
        if (name === "interval") this._interval = newValue * 1;
        if (name === "width") {
            this._width = newValue * 1;
            this._eChartsDiv.style.width = newValue + "px";
        }
        if (name === "height") {
            this._height = newValue * 1;
            this._eChartsDiv.style.height = newValue + "px";
        }
        if (name === "min") {
            if (newValue === "auto") this._min = "auto";
            else this._min = newValue * 1;
        }
        if (name === "max") {
            if (newValue === "auto") this._max = "auto";
            else this._max = newValue * 1;
        }
        if (name === "title") this._title = newValue;
        if (name === "colors") try {
            this._colors = JSON.parse(newValue);
            if (!(this._colors instanceof Array)) this._colors = [
                this._colors
            ];
            else if (this._colors.length == 0) this._colors = [
                "blue"
            ];
        } catch (e) {
            this._colors = [
                newValue
            ];
        }
        if (name === "labels") try {
            this._labels = JSON.parse(newValue);
            if (!(this._labels instanceof Array)) this._labels = [
                this._labels
            ];
            else if (this._labels.length == 0) this._labels = [
                "blue"
            ];
        } catch (e1) {
            this._labels = [
                newValue
            ];
        }
        if (name === "outputs") this._outputsFunction = function(data, currentCycle) {
            return eval(newValue);
        };
        this.showValue();
    }
    updateData(data, currentCycle) {
        for (let d of this._datas)while(true){
            if (d.length === 0) break;
            if (d[0][0] + this._interval >= currentCycle) break;
            d.splice(0, 1);
        }
        let max = this._max;
        if (max === "auto") max = Math.pow(2, this._bytes * 8);
        let min = this._min;
        let outpts = this._outputsFunction(data, currentCycle);
        if (!(outpts instanceof Array)) outpts = [
            outpts
        ];
        for(let i = 0; i < outpts.length; i++){
            if (this._datas[i] === undefined) this._datas[i] = [];
            this._datas[i].push([
                currentCycle,
                outpts[i]
            ]);
        }
        this.showValue();
    }
    reset() {
        this._datas = [];
        this.showValue();
    }
    constructor(elm){
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
        this._colors = [
            "blue"
        ];
        this._labels = [];
        this._outputsFunction = function() {
            return [];
        };
        this._eChart = undefined;
        this._interval = 50000000;
        this._title = "";
    }
}
customElements.define('memout-element', MemOutElement);
const HEX = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f"
];
const BIN = [
    "0",
    "1"
];

});
parcelRequire.register("05erC", function(module, exports) {
window.AVR8_REGISTER = {
    //	"":0xFF,
    //	"":0xFE,
    //	"":0xFD,
    //	"":0xFC,
    //	"":0xFB,
    //	"":0xFA,
    //	"":0xF9,
    //	"":0xF8,
    //	"":0xF7,
    //	"":0xF6,
    //	"":0xF5,
    //	"":0xF4,
    //	"":0xF3,
    //	"":0xF2,
    //	"":0xF1,
    //	"":0xF0,
    //	"":0xEF,
    //	"":0xEE,
    //	"":0xED,
    //	"":0xEC,
    //	"":0xEB,
    //	"":0xEA,
    //	"":0xE9,
    //	"":0xE8,
    //	"":0xE7,
    //	"":0xE6,
    //	"":0xE5,
    //	"":0xE4,
    //	"":0xE3,
    //	"":0xE2,
    //	"":0xE1,
    //	"":0xE0,
    //	"":0xDF,
    //	"":0xDE,
    //	"":0xDD,
    //	"":0xDC,
    //	"":0xDB,
    //	"":0xDA,
    //	"":0xD9,
    //	"":0xD8,
    //	"":0xD7,
    //	"":0xD6,
    //	"":0xD5,
    //	"":0xD4,
    //	"":0xD3,
    //	"":0xD2,
    //	"":0xD1,
    //	"":0xD0,
    //	"":0xCF,
    //	"":0xCE,
    //	"":0xCD,
    //	"":0xCC,
    //	"":0xCB,
    //	"":0xCA,
    //	"":0xC9,
    //	"":0xC8,
    //	"":0xC7,
    "UDR0": 198,
    "UBRR0H": 197,
    "UBRR0L": 196,
    //	"":0xC3,
    "UCSR0C": 194,
    "UCSR0B": 193,
    "UCSR0A": 192,
    //	"":0xBF,
    //	"":0xBE,
    "TWAMR": 189,
    "TWCR": 188,
    "TWDR": 187,
    "TWAR": 186,
    "TWSR": 185,
    "TWBR": 184,
    //	"":0xB7,
    "ASSR": 182,
    //	"":0xB5,
    "OCR2B": 180,
    "OCR2A": 179,
    "TCNT2": 178,
    "TCCR2B": 177,
    "TCCR2A": 176,
    //	"":0xAF,
    //	"":0xAE,
    //	"":0xAD,
    //	"":0xAC,
    //	"":0xAB,
    //	"":0xAA,
    //	"":0xA9,
    //	"":0xA8,
    //	"":0xA7,
    //	"":0xA6,
    //	"":0xA5,
    //	"":0xA4,
    //	"":0xA3,
    //	"":0xA2,
    //	"":0xA1,
    //	"":0xA0,	
    //	"":0x9F,
    //	"":0x9E,
    //	"":0x9D,
    //	"":0x9C,
    //	"":0x9B,
    //	"":0x9A,
    //	"":0x99,
    //	"":0x98,
    //	"":0x97,
    //	"":0x96,
    //	"":0x95,
    //	"":0x94,
    //	"":0x93,
    //	"":0x92,
    //	"":0x91,
    //	"":0x90,
    //	"":0x8F,
    //	"":0x8E,
    //	"":0x8D,
    //	"":0x8C,
    "OCR1BH": 139,
    "OCR1BL": 138,
    "OCR1AH": 137,
    "OCR1AL": 136,
    "ICR1H": 135,
    "ICR1L": 134,
    "TCNT1H": 133,
    "TCNT1L": 132,
    //	"":0x83,
    "TCCR1C": 130,
    "TCCR1B": 129,
    "TCCR1A": 128,
    "DIDR1": 127,
    "DIDR0": 126,
    //	"":0x7D,
    "ADMUX": 124,
    "ADCSRB": 123,
    "ADCSRA": 122,
    "ADCH": 121,
    "ADCL": 120,
    //	"":0x77,
    //	"":0x76,
    //	"":0x75,
    //	"":0x74,
    //	"":0x73,
    //	"":0x72,
    //	"":0x71,
    "TIMSK2": 112,
    "TIMSK1": 111,
    "TIMSK0": 110,
    "PCMSK2": 109,
    "PCMSK1": 108,
    "PCMSK0": 107,
    //	"":0x6A,
    "EICRA": 105,
    "PCICR": 104,
    //	"":0x67,
    "OSCCAL": 102,
    //	"":0x65,
    "PRR": 100,
    //	"":0x63,
    //	"":0x62,
    "CLKPR": 97,
    "WDTCSR": 96,
    "SREG": 95,
    "SPH": 94,
    "SPL": 93,
    //	"":0x5C,
    //	"":0x5B,
    //	"":0x5A,
    //	"":0x59,
    //	"":0x58,
    "SPMCSR": 87,
    //	"":0x56,
    "MCUCR": 85,
    "MCUSR": 84,
    "SMCR": 83,
    //	"":0x52,
    //	"":0x51,
    "ACSR": 80,
    //	"":0x4F,
    "SPDR": 78,
    "SPSR": 77,
    "SPCR": 76,
    "GPIOR2": 75,
    "GPIOR1": 74,
    //	"":0x49,
    "OCR0B": 72,
    "OCR0A": 71,
    "TCNT0": 70,
    "TCCR0B": 69,
    "TCCR0A": 68,
    "GTCCR": 67,
    "EEARH": 66,
    "EEARL": 65,
    "EEDR": 64,
    "EECR": 63,
    "GPIOR0": 62,
    "EIMSK": 61,
    "EIFR": 60,
    "PCIFR": 59,
    //	"":0x3A,
    //	"":0x39,
    //	"":0x38,
    "TIFR2": 55,
    "TIFR1": 54,
    "TIFR0": 53,
    //	"":0x34,
    //	"":0x33,
    //	"":0x32,
    //	"":0x31,
    //	"":0x30,
    //	"":0x2F,
    //	"":0x2E,
    //	"":0x2D,
    //	"":0x2C,
    "PORTD": 43,
    "DDRD": 42,
    "PIND": 41,
    "PORTC": 40,
    "DDRC": 39,
    "PINC": 38,
    "PORTB": 37,
    "DDRB": 36,
    "PINB": 35,
    //	"":0x22,
    //	"":0x21,
    //	"":0x20,
    "R31": 31,
    "ZH": 31,
    "R30": 30,
    "ZL": 30,
    "R29": 29,
    "YH": 29,
    "R28": 28,
    "YL": 28,
    "R27": 27,
    "XH": 27,
    "R26": 26,
    "XL": 26,
    "R25": 25,
    "R24": 24,
    "R23": 23,
    "R22": 22,
    "R21": 21,
    "R20": 20,
    "R19": 19,
    "R18": 18,
    "R17": 17,
    "R16": 16,
    "R15": 15,
    "R14": 14,
    "R13": 13,
    "R12": 12,
    "R11": 11,
    "R10": 10,
    "R9": 9,
    "R8": 8,
    "R7": 7,
    "R6": 6,
    "R5": 5,
    "R4": 4,
    "R3": 3,
    "R2": 2,
    "R1": 1,
    "R0": 0,
    // 2 Byte Registers
    "OCR1B": 138,
    "OCR1A": 136,
    "OCR1B": 138,
    "OCR1A": 136,
    "ICR1": 134,
    "TCNT1": 132,
    "ADC": 120,
    "SP": 93,
    "EEAR": 65,
    "Z": 30,
    "Y": 28,
    "X": 26
};

});


parcelRequire("bltH3");

function $e592140bf0f8758f$export$6907aa30e09916b(source, target) {
    for (const line of source.split('\n'))if (line[0] === ':' && line.substr(7, 2) === '00') {
        const bytes = parseInt(line.substr(1, 2), 16);
        const addr = parseInt(line.substr(3, 4), 16);
        for(let i = 0; i < bytes; i++)target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
    }
}


// ATmega328p params
const $fe31fe8bfeff6fa9$var$FLASH = 32768;
class $fe31fe8bfeff6fa9$export$31e2b2d64952a5f1 {
    async execute(callback, cyclesPerFrame, frameDelayMilliseconds, maxNumberOfCycles, onStopCallback) {
        this.stopped = false;
        while(true){
            for(let i = 0; i < cyclesPerFrame; i++){
                $hTKlw$avr8js.avrInstruction(this.cpu);
                //this.timer0.count();
                //this.timer1.count();
                //this.timer2.count();
                //this.usart.tick();
                //this.cpu.tick(); //???????
                const ucsra = this.cpu.data[$hTKlw$avr8js.usart0Config.UCSRA];
                if (this.cpu.interruptsEnabled && ucsra & 32 && this.serialBuffer.length > 0) $hTKlw$avr8js.avrInterrupt(this.cpu, $hTKlw$avr8js.usart0Config.rxCompleteInterrupt);
                if (this.cpu.cycles >= maxNumberOfCycles) {
                    this.stop();
                    break;
                }
            }
            //aktuallisieren des Speichers für memout-elements:
            for(let i1 = 0; i1 < this.cpu.readHooks.length; i1++)if (this.cpu.readHooks[i1] !== undefined) this.cpu.data[i1] = this.cpu.readHooks[i1](i1); //darf man das?  könnte zum Beispeil beim Analog-Digitalwandler ein Problem sein, da das auslesen eines Registers das Schreiben in das andere pausiert oder wieder freigibt
            callback(this.cpu);
            await new Promise((resolve)=>setTimeout(resolve, frameDelayMilliseconds)
            );
            if (this.stopped) {
                if (onStopCallback) onStopCallback(this.cpu);
                break;
            }
        }
    }
    serial(input) {
        for(var i = 0; i < input.length; i++)this.serialBuffer.push(input.charCodeAt(i));
    }
    stop() {
        this.stopped = true;
    }
    constructor(hex){
        this.program = new Uint16Array($fe31fe8bfeff6fa9$var$FLASH);
        this.port = new Map();
        this.MHZ = 16000000;
        this.stopped = false;
        $e592140bf0f8758f$export$6907aa30e09916b(hex, new Uint8Array(this.program.buffer));
        this.cpu = new $hTKlw$avr8js.CPU(this.program);
        this.timer0 = new $hTKlw$avr8js.AVRTimer(this.cpu, $hTKlw$avr8js.timer0Config);
        this.timer1 = new $hTKlw$avr8js.AVRTimer(this.cpu, $hTKlw$avr8js.timer1Config);
        this.timer2 = new $hTKlw$avr8js.AVRTimer(this.cpu, $hTKlw$avr8js.timer2Config);
        //this.port.set('A', new AVRIOPort(this.cpu, portAConfig));
        this.port.set('B', new $hTKlw$avr8js.AVRIOPort(this.cpu, $hTKlw$avr8js.portBConfig));
        this.port.set('C', new $hTKlw$avr8js.AVRIOPort(this.cpu, $hTKlw$avr8js.portCConfig));
        this.port.set('D', new $hTKlw$avr8js.AVRIOPort(this.cpu, $hTKlw$avr8js.portDConfig));
        //this.port.set('E', new AVRIOPort(this.cpu, portEConfig));
        //this.port.set('F', new AVRIOPort(this.cpu, portFConfig));
        //this.port.set('G', new AVRIOPort(this.cpu, portGConfig));
        //this.port.set('H', new AVRIOPort(this.cpu, portHConfig));
        //this.port.set('J', new AVRIOPort(this.cpu, portJConfig));
        //this.port.set('K', new AVRIOPort(this.cpu, portKConfig));
        //this.port.set('L', new AVRIOPort(this.cpu, portLConfig));
        // create an ArrayBuffer with a size in bytes
        this.serialBuffer = [];
        this.usart = new $hTKlw$avr8js.AVRUSART(this.cpu, $hTKlw$avr8js.usart0Config, this.MHZ);
        this.cpu.readHooks[$hTKlw$avr8js.usart0Config.UDR] = ()=>this.serialBuffer.shift() || 0
        ;
    }
}


function $0910cead2f6e309d$var$zeroPad(value, length) {
    let sval = value.toString();
    while(sval.length < length)sval = '0' + sval;
    return sval;
}
function $0910cead2f6e309d$export$3203edd9e5edd663(seconds) {
    const ms = Math.floor(seconds * 1000) % 1000;
    const secs = Math.floor(seconds % 60);
    const mins = Math.floor(seconds / 60);
    return `${$0910cead2f6e309d$var$zeroPad(mins, 2)}:${$0910cead2f6e309d$var$zeroPad(secs, 2)}.${$0910cead2f6e309d$var$zeroPad(ms, 3)}`;
}


// https://images.prismic.io/circuito/8e3a980f0f964cc539b4cbbba2654bb660db6f52_arduino-uno-pinout-diagram.png?auto=compress,format
const $3c2006cdc61a9d01$var$PIN_PORT = {
    "0": [
        0,
        'D'
    ],
    "1": [
        1,
        'D'
    ],
    "2": [
        2,
        'D'
    ],
    "3": [
        3,
        'D'
    ],
    "4": [
        4,
        'D'
    ],
    "5": [
        5,
        'D'
    ],
    "6": [
        6,
        'D'
    ],
    "7": [
        7,
        'D'
    ],
    "8": [
        0,
        'B'
    ],
    "9": [
        1,
        'B'
    ],
    "10": [
        2,
        'B'
    ],
    "11": [
        3,
        'B'
    ],
    "12": [
        4,
        'B'
    ],
    "13": [
        5,
        'B'
    ],
    "14": [
        0,
        'C'
    ],
    "A0": [
        0,
        'C'
    ],
    "15": [
        1,
        'C'
    ],
    "A1": [
        1,
        'C'
    ],
    "16": [
        2,
        'C'
    ],
    "A2": [
        2,
        'C'
    ],
    "17": [
        3,
        'C'
    ],
    "A3": [
        3,
        'C'
    ],
    "18": [
        4,
        'C'
    ],
    "A4": [
        4,
        'C'
    ],
    "19": [
        5,
        'C'
    ],
    "A5": [
        5,
        'C'
    ],
    "RESET": [
        6,
        'C'
    ]
};
function $3c2006cdc61a9d01$var$pinPort(e) {
    /*let port: PORT | null;
  let pin = e.getAttribute("pin")
  pin = pin ? parseInt(pin, 10)  : null;

  if (pin == null) {
    port = null;
  } else if (pin < 8) {
    port = 'D';
  } else if (pin < 14) {
    port = 'B';
  } else if (pin < 20) {
    port = 'C';
  } else {
    port = null;
  }

  return [pin , port]*/ if ($3c2006cdc61a9d01$var$PIN_PORT[e.getAttribute("pin")]) return $3c2006cdc61a9d01$var$PIN_PORT[e.getAttribute("pin")];
    return [
        null,
        null
    ];
}
window.AVR8js = {
    build: async function(sketch, files = []) {
        if (!window.__AVR8jsCache) window.__AVR8jsCache = {
        };
        let body = JSON.stringify({
            sketch: sketch,
            files: files
        });
        if (window.__AVR8jsCache[body]) return window.__AVR8jsCache[body];
        else {
            const resp = await fetch('https://hexi.wokwi.com/build', {
                method: 'POST',
                mode: 'cors',
                cache: 'force-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
            const rslt = await resp.json();
            window.__AVR8jsCache[body] = rslt;
            return rslt;
        }
    },
    buildASM: async function asmToHex(source) {
        const resp = await fetch('https://hexi.wokwi.com/asm', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source: source
            })
        });
        return await resp.json();
    },
    execute: function(hex, log, id, MHZ, cyclesPerFrame, frameDelayMilliseconds, maxNumberOfCycles, onStopCallback) {
        const PORTS = [
            "B",
            "C",
            "D"
        ];
        const container = document.getElementById(id) || document;
        const connectableComponents = [];
        const LEDs = container.querySelectorAll("wokwi-led");
        const SEG7 = container.querySelectorAll("wokwi-7segment");
        const BUZZER = container.querySelectorAll("wokwi-buzzer");
        const PushButton = container.querySelectorAll("wokwi-pushbutton");
        for (let led of LEDs)connectableComponents.push(new $3c2006cdc61a9d01$var$ConnectableLED(led));
        for (let s7 of SEG7)connectableComponents.push(new $3c2006cdc61a9d01$var$ConnectableSevenSegmentElement(s7));
        for (let buzzer of BUZZER)connectableComponents.push(new $3c2006cdc61a9d01$var$ConnectableBuzzer(buzzer));
        for (let buttons of PushButton)connectableComponents.push(new $3c2006cdc61a9d01$var$ConnectablePushButton(buttons));
        const MemOuts = container.querySelectorAll("memout-element");
        for (let m of MemOuts)m.reset();
        const runner = new $fe31fe8bfeff6fa9$export$31e2b2d64952a5f1(hex);
        MHZ = MHZ || 16000000;
        cyclesPerFrame = cyclesPerFrame || 500000;
        frameDelayMilliseconds = frameDelayMilliseconds || 0;
        for (const cc of connectableComponents)cc.connect(runner.port);
        /*    for(const PORT of PORTS) {
      // Hook to PORTB register
      const port = runner.port.get(PORT)

      if(port) {
        PushButton.forEach (button => {
          let [pin, p] = pinPort(button)

          if (pin && p === PORT) {
            port.setPin(pin % 8, false);

            button.addEventListener("button-press", () => {
              if (runner) {
                port.setPin(pin % 8, true);
              }
            });

            button.addEventListener("button-release", () => {
              if (runner) {
                port.setPin(pin % 8, false);
              }
            });
          }
        })

        port.addListener(value => {
          LEDs.forEach(e => {
            let [pin, p] = pinPort(e)

            if (pin && p === PORT) {
              e.value = value & (1 << (pin - 8)) ? true : false;
            }
          })

          BUZZER.forEach(e => {
            let [pin, p] = pinPort(e)

            if (pin && p === PORT) {
              e.hasSignal = value & (1 << (pin - 8)) ? true : false;
            }
          })

          SEG7.forEach(e => {
            let [pin, p] = pinPort(e)

            if (pin && p === PORT) {
              e.values = [
                value & 1,
                value & 2,
                value & 4,
                value & 16,
                value & 32,
                value & 64,
                value & 128,
                value & 256
              ]
            }
          })
        });
      }
    }*/ // Serial port output support
        runner.usart.onLineTransmit = (value)=>{
            log(value);
        };
        const timeSpan = container.querySelector("#simulation-time");
        runner.execute((cpu)=>{
            for (let m of MemOuts)m.updateData(cpu.data, cpu.cycles);
            const time = $0910cead2f6e309d$export$3203edd9e5edd663(cpu.cycles / MHZ);
            if (timeSpan) timeSpan.textContent = "Simulation time: " + time;
        }, cyclesPerFrame, frameDelayMilliseconds, maxNumberOfCycles, onStopCallback);
        return runner;
    }
};
class $3c2006cdc61a9d01$var$ConnectableLED {
    connect(ports) {
        let [pin, prt] = $3c2006cdc61a9d01$var$pinPort(this.element); // get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        // wenn sich im Port was ändert:
        port.addListener((value)=>{
            this.element.value = value & 1 << pin ? true : false;
        });
    }
    constructor(ledElement){
        this.element = ledElement;
    }
}
class $3c2006cdc61a9d01$var$ConnectableSevenSegmentElement {
    connect(ports) {
        let [pin, prt] = $3c2006cdc61a9d01$var$pinPort(this.element); // get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        port.addListener((value)=>{
            this.element.values = [
                value & 1,
                value & 2,
                value & 4,
                value & 16,
                value & 32,
                value & 64,
                value & 128,
                value & 256
            ];
        });
    }
    constructor(sevenSegmentElement){
        this.element = sevenSegmentElement;
    }
}
class $3c2006cdc61a9d01$var$ConnectableBuzzer {
    connect(ports) {
        let [pin, prt] = $3c2006cdc61a9d01$var$pinPort(this.element); // get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        // wenn sich im Port was ändert:
        port.addListener((value)=>{
            this.element.hasSignal = value & 1 << pin ? true : false;
        });
    }
    constructor(buzzerElement){
        this.element = buzzerElement;
    }
}
class $3c2006cdc61a9d01$var$ConnectablePushButton {
    connect(ports) {
        let [pin, prt] = $3c2006cdc61a9d01$var$pinPort(this.element); // get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        this.element.addEventListener("button-press", ()=>{
            //         if (runner) {   // da muss ich mir noch was überlegen `hust hust`
            port.setPin(pin, true);
            console.log("knopp runter gedrückt, der pin " + pin + " is jetzt gesetzt!");
        //          }
        });
        this.element.addEventListener("button-release", ()=>{
            //           if (runner) {
            port.setPin(pin, false);
            console.log("knopp los gelassen, der pin " + pin + " is jetzt ni mehr gesetzt!");
        //            }
        });
        port.setPin(pin, false);
    }
    constructor(pushButtonElement){
        this.element = pushButtonElement;
    }
}


//# sourceMappingURL=index.js.map
