import "@wokwi/elements";
import "./memoutelements";
import "./webelements";
import { AVRRunner, PORT } from "./execute";
import { formatTime } from "./format-time";
//import { WS2812Controller } from "./ws2812";

import {MemOut} from "./memout";

import {
  BuzzerElement,
  LEDElement,
  PushbuttonElement,
  SevenSegmentElement,
  AnalogJoystickElement
} from "@wokwi/elements";

declare const window: any;

// https://images.prismic.io/circuito/8e3a980f0f964cc539b4cbbba2654bb660db6f52_arduino-uno-pinout-diagram.png?auto=compress,format
const PIN_PORT = {
    "0":[0,'D'],
    "1":[1,'D'],
    "2":[2,'D'],
    "3":[3,'D'],
    "4":[4,'D'],
    "5":[5,'D'],
    "6":[6,'D'],
    "7":[7,'D'],
    "8":[0,'B'],
    "9":[1,'B'],
    "10":[2,'B'],
    "11":[3,'B'],
    "12":[4,'B'],
    "13":[5,'B'],
    "14":[0,'C'], "A0":[0,'C'],
    "15":[1,'C'], "A1":[1,'C'],
    "16":[2,'C'], "A2":[2,'C'],
    "17":[3,'C'], "A3":[3,'C'],
    "18":[4,'C'], "A4":[4,'C'],
    "19":[5,'C'], "A5":[5,'C'],
    "RESET":[6,'C']
}


function pinPort(e:any) : [number | null, string | null]{
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

  return [pin , port]*/
  if (PIN_PORT[e.getAttribute("pin")]) return PIN_PORT[e.getAttribute("pin")];
  return [null, null];
}







window.AVR8js = {
  build: async function (sketch:string, files = []) {
    if (!window.__AVR8jsCache) {
      window.__AVR8jsCache = {}
    }

    let body = JSON.stringify({ sketch: sketch, files })

    if (window.__AVR8jsCache[body]) {
      return window.__AVR8jsCache[body]
    } else {
      const resp = await fetch('https://hexi.wokwi.com/build', {
        method: 'POST',
        mode: 'cors',
        cache: 'force-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      });
      const rslt = await resp.json()

      window.__AVR8jsCache[body] = rslt

      return rslt;
    }
  },

  buildASM: async function asmToHex(source: string) {
    const resp = await fetch('https://hexi.wokwi.com/asm', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ source })
    });
    return (await resp.json());
  },

  execute: function (hex:string, log:any, id:string, MHZ: any, cyclesPerFrame: any, frameDelayMilliseconds: any, maxNumberOfCycles: any, onStopCallback: any) {
    const PORTS:Array<PORT> = ["B", "C", "D"]

    const container = document.getElementById(id) || document

    const connectableComponents : Array<ConnectableComponent> = [];
    
    const LEDs: NodeListOf<LEDElement & HTMLElement> = container.querySelectorAll("wokwi-led");
    const SEG7 = container.querySelectorAll<SevenSegmentElement & HTMLElement>("wokwi-7segment");
    const BUZZER = container.querySelectorAll<BuzzerElement & HTMLElement>("wokwi-buzzer");
    const PushButton = container.querySelectorAll<PushbuttonElement & HTMLElement>("wokwi-pushbutton");
    const analogJoysticks = container.querySelectorAll<AnalogJoystickElement & HTMLElement>("wokwi-analog-joystick");
    const voltageSliders = container.querySelectorAll<VoltageSliderElement & HTMLElement>("voltage-slider-element");
    
    for (let led of LEDs) connectableComponents.push(new ConnectableLED(led));
    for (let s7 of SEG7) connectableComponents.push(new ConnectableSevenSegmentElement(s7));
    for (let buzzer of BUZZER) connectableComponents.push(new ConnectableBuzzer(buzzer));
    for (let buttons of PushButton) connectableComponents.push(new ConnectablePushButton(buttons));
    for (let analogJoystick of analogJoysticks) connectableComponents.push(new ConnectableJoyStick(analogJoystick));
    for (let voltageSlider of voltageSliders) connectableComponents.push(new ConnectableVoltageSlider(voltageSlider));
    
    const MemOuts = container.querySelectorAll<MemOutElement & HTMLElement>("memout-element");
    for (let m of MemOuts) m.reset();

    
    const runner = new AVRRunner(hex);

    MHZ = MHZ || 16000000
    cyclesPerFrame = cyclesPerFrame || 500000;
    frameDelayMilliseconds = frameDelayMilliseconds || 0;
        
    for (const cc of connectableComponents) cc.connect(runner.port, runner.adc);
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
    }*/

    // Serial port output support
    runner.usart.onLineTransmit = (value) => {
      log(value);
    };
    const timeSpan = container.querySelector("#simulation-time")
    runner.execute(cpu => {
    for (let m of MemOuts) m.updateData(cpu.data, cpu.cycles);
      const time = formatTime(cpu.cycles / MHZ);
      if(timeSpan)
        timeSpan.textContent = "Simulation time: " + time;
    },cyclesPerFrame,frameDelayMilliseconds,maxNumberOfCycles,onStopCallback);

    return runner;
  }
}


interface ConnectableComponent {
    connect(ports:Map<PORT, AVRIOPort>, adc: AVRADC);
}




class ConnectableLED implements ConnectableComponent {
    constructor(ledElement: LEDElement) {
        this.element = ledElement;
    }
    connect(ports:Map<PORT, AVRIOPort>, adc: AVRADC) {
        let [pin, prt] = pinPort(this.element);// get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        
        
        // wenn sich im Port was ändert:
        port.addListener((value)=>{
            this.element.value = value & (1 << pin) ? true : false;
        });
    }
}




class ConnectableSevenSegmentElement implements ConnectableComponent {
    constructor(sevenSegmentElement: SevenSegmentElement) {
        this.element = sevenSegmentElement;
    }
    connect(ports:Map<PORT, AVRIOPort>, adc: AVRADC) {
        let [pin, prt] = pinPort(this.element);// get pin number and port name
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
        }
    }
}




class ConnectableBuzzer implements ConnectableComponent {
    constructor(buzzerElement: BuzzerElement) {
        this.element = buzzerElement;
    }
    connect(ports:Map<PORT, AVRIOPort>, adc: AVRADC) {
        let [pin, prt] = pinPort(this.element);// get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        
        
        // wenn sich im Port was ändert:
        port.addListener((value)=>{
            this.element.hasSignal = value & (1 << pin) ? true : false;
        });
    }
}




class ConnectablePushButton implements ConnectableComponent {
    constructor(pushButtonElement: PushbuttonElement) {
        this.element = pushButtonElement;
    }
    connect(ports:Map<PORT, AVRIOPort>, adc: AVRADC) {
        let [pin, prt] = pinPort(this.element);// get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        
        
        this.element.addEventListener("button-press", () => {
 //         if (runner) {   // da muss ich mir noch was überlegen `hust hust`
                port.setPin(pin, true);
//          }
        });
        this.element.addEventListener("button-release", () => {
 //           if (runner) {
                port.setPin(pin, false);
//            }
        });
        
        port.setPin(pin, false);
    }
}


class ConnectableJoyStick implements ConnectableComponent {
    constructor(analogJoystickElement: AnalogJoystickElement) {
        this.element = analogJoystickElement;
    }
    connect(ports:Map<PORT, AVRIOPort>, adc: AVRADC) {
        let current = this;
        
        let analogPinNumberX = Math.round(this.element.getAttribute("xAnalogPinNumber") ?? undefined);
        if (isNaN(analogPinNumberX)) analogPinNumberX = undefined;
        let analogPinNumberY = Math.round(this.element.getAttribute("yAnalogPinNumber") ?? undefined);
        if (isNaN(analogPinNumberY)) analogPinNumberY = undefined;
        
        let uNegative = (this.element.getAttribute("uNegative") ?? undefined)*1.0;
        if (isNaN(uNegative)) uNegative = 0.0;
        let uPositive = (this.element.getAttribute("uPositive") ?? undefined)*1.0;
        if (isNaN(uPositive)) uPositive = 5.0;
    
                         
        //button
        let [pin, prt] = pinPort(this.element);
        const port = (prt === null || prt === undefined) ? undefined : ports.get(prt);

        
        
                         
                         
        
        this.element.addEventListener("button-press", () => {
            if (port !== undefined) port.setPin(pin, true);
        });
        this.element.addEventListener("button-release", () => {
            if (port !== undefined) port.setPin(pin, false);

        });
        this.element.addEventListener("input", () => {
                if (analogPinNumberX !== undefined) adc.channelValues[analogPinNumberX] = ((current.element.xValue+1)/2)*(uPositive-uNegative) + uNegative;
                if (analogPinNumberY !== undefined) adc.channelValues[analogPinNumberY] = ((current.element.yValue+1)/2)*(uPositive-uNegative) + uNegative;
        });
        
        if (analogPinNumberX !== undefined) adc.channelValues[analogPinNumberX] = (uPositive-uNegative)/2.0;
        if (analogPinNumberY !== undefined) adc.channelValues[analogPinNumberY] = (uPositive-uNegative)/2.0;
        if (port !== undefined) port.setPin(pin, false);
    }
}

class ConnectableVoltageSlider implements ConnectableComponent {
    constructor(voltageSliderElement: VoltageSliderElement) {
        this.element = voltageSliderElement;
    }
    connect(ports:Map<PORT, AVRIOPort>, adc: AVRADC) {
        let current = this;
        
        let analogPinNumber = Math.round(this.element.getAttribute("analogPinNumber") ?? undefined);
        if (isNaN(analogPinNumber)) analogPinNumber = undefined;

    
        
                         
                         
    
        this.element.addEventListener("input", () => {
                if (analogPinNumber !== undefined) adc.channelValues[analogPinNumber] = ((current.element.value+1)/2);
        });
        
        adc.channelValues[analogPinNumber] = ((current.element.value+1)/2);
    }
}


