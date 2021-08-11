<!--
author:   Fabian Bär

email:    Fabian.Baer@student.tu-freiberg.de

version:  0.0.3

comment:  Kein Kommentar!

import: https://fjangfaragesh.github.io/AVR8js-mem/INCLUDE.md

-->

# Lia Include Example

## Beispiel 1
<lia-keep>
<div id="example_div_id">
    <wokwi-led color="red"   pin="13" label="13"></wokwi-led>
    <wokwi-led color="green" pin="12" label="12"></wokwi-led>
    <wokwi-led color="blue"  pin="11" label="11"></wokwi-led>
    <wokwi-led color="yellow"  pin="10" label="10"></wokwi-led>
    <span id="simulation-time"></span><br>
    <b>PORTB: </b><memout-element type="bin" address="PORTB"></memout-element> <b>DDRB: </b><memout-element type="bin" address="DDRB"></memout-element><br>
    <b>PORTC: </b><memout-element type="bin" address="PORTC"></memout-element> <b>DDRC: </b><memout-element type="bin" address="DDRC"></memout-element><br>
    <b>PORTD: </b><memout-element type="bin" address="PORTD"></memout-element> <b>DDRD: </b><memout-element type="bin" address="DDRD"></memout-element><br>     
    <b>led 13: </b><memout-element type="custom" output="extractBit(data[AVR8_REGISTER.PORTB],5)"></memout-element><br>

<memout-element
        type="diagram2"
        outputs="[ extractBit(data[AVR8_REGISTER.PORTB],5), extractBit(data[AVR8_REGISTER.PORTB],4)+1.5, extractBit(data[AVR8_REGISTER.PORTB],3)+3, extractBit(data[0x25],2)+4.5 ]"
        colors='["red","green","blue","yellow"]'
        labels='["red LED","green LED","blue LED","yellow LED"]'
        interval="20000000"
        title="Hallo liebe Welt, ich bin ein Diagram!"
        width="1000"
        height="500"
    ></memout-element>
</div>
</lia-keep>

``` cpp
byte leds[] = {13, 12, 11, 10};
void setup() {
  Serial.begin(115200);
  for (byte i = 0; i < sizeof(leds); i++) {
    pinMode(leds[i], OUTPUT);
  }
}

int i = 0;
void loop() {
  Serial.print("LED: ");
  Serial.println(i);
  digitalWrite(leds[i], HIGH);
  delay(250);
  digitalWrite(leds[i], LOW);
  i = (i + 1) % sizeof(leds);
}
```
@AVR8jsMem.sketch(example_div_id,100000,1,64000000)















## Beispiel 2

<lia-keep>
<div id="example2_div_id">
    <span id="simulation-time"></span><br>
            <wokwi-led color="green" pin="9" port="B" label="B1"></wokwi-led><br>
            <!-- memout web komponenten -->
            <!-- Textausgaben -->
            <b>PORTB: </b> <memout-element type="bin" address="0x25"></memout-element>
            <b>DDRB: </b> <memout-element type="bin" address="0x24"></memout-element>
            <b>PINB: </b> <memout-element type="bin" address="0x23"></memout-element><br>
            <b>TCCR1: </b> <memout-element type="bin" address="0x80" bytes="2" endian="little"></memout-element><br>
            <b>TCNT1: </b> <memout-element type="bin" address="0x84" bytes="2" endian="little"></memout-element><br>
            <b>OCR1A: </b> <memout-element type="bin" address="0x88" bytes="2" endian="little"></memout-element><br>
            <!-- Diagramm -->
            <memout-element
                type="diagram2"
                outputs="[bytesToInt(data[0x84],data[0x85]), bytesToInt(data[0x88],data[0x89]), bytesToInt(data[0x84],data[0x85]) < bytesToInt(data[0x88],data[0x89]) ? 300 : 260]"
                color="blue"
                min="0"
                max="300"
                width="800"
                height="600"
                interval="2000000"
                title="TCNT1 und OCR1A"
                colors='["red","blue","green"]'
                labels='["TCNT1","OCR1A","LED"]'
            ></memout-element><br>
        </div>
</lia-keep>
``` cpp
#ifndef F_CPU
#define F_CPU 16000000UL // 16 MHz clock speed
#endif

int main(void){
  DDRB |=  (1 << PORTB1); //Define OCR1A as Output
  TCCR1A |= (1 << COM1A1) | (1 << WGM10);  //Set Timer Register
  TCCR1B |= (1 << CS12) | (1 << CS10);
  OCR1A = 0;
  int timer = 0;
  int dummy = 0;
  while(1) {
   while(timer < 255){ //Fade from low to high
    timer++;
    OCR1A = timer;
    for (int i = 0; i < 10000; i++) if (TCNT1) dummy++;// nur für den Simmulator, damit er TCNT1 aktuallisiert

  }
   while(timer > 0){ //Fade from high to low
    timer--;
    OCR1A = timer;
    for (int i = 0; i < 10000; i++) if (TCNT1) dummy++;// nur für den Simmulator, damit er TCNT1 aktuallisiert
    }
   }
}
```
@AVR8jsMem.sketch(example2_div_id,10000,1)
