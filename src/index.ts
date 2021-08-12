import "@wokwi/elements";
import "./memoutelements";
import { AVRRunner, PORT } from "./execute";
import { formatTime } from "./format-time";
//import { WS2812Controller } from "./ws2812";

import {MemOut} from "./memout";

import {
  BuzzerElement,
  LEDElement,
  PushbuttonElement,
  SevenSegmentElement
} from "@wokwi/elements";

declare const window: any;

function pinPort(e:any) : [number | null, string | null]{
  let port: PORT | null;
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

  return [pin , port]
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
    
    for (let led of LEDs) connectableComponents.push(new ConnectableLED(led));
    for (let s7 of SEG7) connectableComponents.push(new ConnectableSevenSegmentElement(s7));
    for (let buzzer of BUZZER) connectableComponents.push(new ConnectableBuzzer(buzzer));
    for (let buttons of PushButton) connectableComponents.push(new ConnectablePushButton(buttons));

    
    const MemOuts = container.querySelectorAll<MemOutElement & HTMLElement>("memout-element");
    for (let m of MemOuts) m.reset();

    
    const runner = new AVRRunner(hex);

    MHZ = MHZ || 16000000
    cyclesPerFrame = cyclesPerFrame || 500000;
    frameDelayMilliseconds = frameDelayMilliseconds || 0;
        
    for (const cc of connectableComponents) cc.connect(runner.port);
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
    connect(ports:Map<PORT, AVRIOPort>);
}




class ConnectableLED implements ConnectableComponent {
    constructor(ledElement: LEDElement) {
        this.element = ledElement;
    }
    connect(ports:Map<PORT, AVRIOPort>) {
        let [pin, prt] = pinPort(this.element);// get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        
        
        // wenn sich im Port was ändert:
        port.addListener((value)=>{
            this.element.value = value & (1 << (pin % 8)) ? true : false;
        });
    }
}




class ConnectableSevenSegmentElement implements ConnectableComponent {
    constructor(sevenSegmentElement: SevenSegmentElement) {
        this.element = sevenSegmentElement;
    }
    connect(ports:Map<PORT, AVRIOPort>) {
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
    connect(ports:Map<PORT, AVRIOPort>) {
        let [pin, prt] = pinPort(this.element);// get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        
        
        // wenn sich im Port was ändert:
        port.addListener((value)=>{
            this.element.hasSignal = value & (1 << (pin % 8)) ? true : false;
        });
    }
}




class ConnectablePushButton implements ConnectableComponent {
    constructor(pushButtonElement: PushbuttonElement) {
        this.element = pushButtonElement;
    }
    connect(ports:Map<PORT, AVRIOPort>) {
        let [pin, prt] = pinPort(this.element);// get pin number and port name
        if (prt === null || prt === undefined) return;
        const port = ports.get(prt);
        if (!port) return;
        
        
        this.element.addEventListener("button-press", () => {
 //         if (runner) {   // da muss ich mir noch was überlegen `hust hust`
                port.setPin(pin % 8, true);
//          }
        });
    }
}
