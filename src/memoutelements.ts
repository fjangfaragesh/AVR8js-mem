import {MemOut} from "./memout.ts";



class MemOutElement extends HTMLElement implements MemOut {
    _addressStr: string;
    _address: number;
    _typeStr: string;
    _typeStr: string;
    
    
    
    static get observedAttributes() {
        return ['address', 'type','value'];
    }
    
    constructor() {
        super();
        this._addressStr = "missing address";
        this._address = -1;
        this._valueStr = "unknwon";
        this._typeStr = "hex";
        this._outputTypeFunction = OUTPUT_TYPE_FUNCTIONS.default;
        console.log(this);
    }
    updateData(data: Uint8Array) : void {
        this.setValue(data[this._address]);
    }
    
    
    connectedCallback() {
        this.showValue();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "address") {
            this._addressStr = newValue;
            this._address = newValue*1;
        } else if (name === "type") {
            this._typeStr = newValue;
            this._outputTypeFunction = OUTPUT_TYPE_FUNCTIONS[newValue] || OUTPUT_TYPE_FUNCTIONS.default;
        } else if (name === "value") {
            this._valueStr = newValue;
        }
        this.showValue();
 //        console.log('attributeChangedCallback:' + name + "," + oldValue + "," + newValue);
    }
    
    
    getAddress() {
        return this._address;
    }
    setValue(v) {
        this.setAttribute("value",v);
    }
    showValue() {
        this.innerHTML = "";
        this.appendChild(document.createTextNode(this._addressStr + ": " + this._outputTypeFunction(this._valueStr)));   
    }
}
customElements.define('memout-element', MemOutElement);

const OUTPUT_TYPE_FUNCTIONS = {};
OUTPUT_TYPE_FUNCTIONS.uint = function(v) {
    return v+"";
}
OUTPUT_TYPE_FUNCTIONS.hex = function(v) {
    return HEX[(v >> 4) & 0xf] + HEX[v & 0xf];
}
OUTPUT_TYPE_FUNCTIONS.bin = function(v) {
    return BIN[(v >> 7) & 1] + BIN[(v >> 6) & 1] + BIN[(v >> 5) & 1] + BIN[(v >> 4) & 1] + BIN[(v >> 3) & 1] + BIN[(v >> 2) & 1] + BIN[(v >> 1) & 1] + BIN[v & 1];
}
OUTPUT_TYPE_FUNCTIONS.default = OUTPUT_TYPE_FUNCTIONS.hex;
const HEX = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
const BIN = ["0","1"];
