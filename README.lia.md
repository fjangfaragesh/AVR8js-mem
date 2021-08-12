<!--
author:   Fabian Bär

email:    Fabian.Baer@student.tu-freiberg.de

version:  0.0.3

comment:  Kein Kommentar!

import: https://fjangfaragesh.github.io/AVR8js-mem/INCLUDE.md

-->

# Lia Include Example

[auf Github](https://github.com/fjangfaragesh/AVR8js-mem/blob/main/README.lia.md)  
[mit LiaScript ausprobieren](https://liascript.github.io/course/?https://fjangfaragesh.github.io/AVR8js-mem/README.lia.md)


## Beispiel 1

<lia-keep>
    <div id="example_div_id">
        <span id="simulation-time"></span><br>
        <wokwi-led color="red" pin="13" label="13"></wokwi-led><br>
        <b>PORTB: </b><memout-element type="bin" address="PORTB"></memout-element> <b>DDRB: </b><memout-element type="bin" address="DDRB"></memout-element><br>
    </div>
</lia-keep>

``` cpp
// preprocessor definition
#define F_CPU 16000000UL

#include <avr/io.h>
#include <util/delay.h>

int main (void) {
   DDRB |= (1 << PB5);
   while(1) {
       // PINB = (1 << PB5);   // Dieses Feature ist im Simulator
       PORTB ^= ( 1 << PB5 );
       _delay_ms(1000);
   }
   return 0;
}
```
@AVR8jsMem.sketch(example_div_id,100000,1)








## Beispiel 2
<lia-keep>
<div id="example2_div_id">
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
@AVR8jsMem.sketch(example2_div_id,100000,1,64000000)















## Beispiel 3 (phase correct PWM)

<lia-keep>
<div id="example3_div_id">
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
    _delay_ms(4);

  }
   while(timer > 0){ //Fade from high to low
    timer--;
    OCR1A = timer;
    _delay_ms(4);
    }
   }
}
```
@AVR8jsMem.sketch(example3_div_id,10000,1)

## Beispiel 4 (fast PWM)

<lia-keep>
<div id="example4_div_id">
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
        interval="1000000"
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
  TCCR1B |= (1 << CS12) | (1 << CS10) | (1 << WGM12);
  OCR1A = 0;
  int timer = 0;
  int dummy = 0;
  while(1) {
   while(timer < 255){ //Fade from low to high
    timer++;
    OCR1A = timer;
    _delay_ms(4);

  }
   while(timer > 0){ //Fade from high to low
    timer--;
    OCR1A = timer;
    _delay_ms(4);
    }
   }
}
```
@AVR8jsMem.sketch(example4_div_id,3000,1)

## Beispiel 5 (Musik macher)

<lia-keep>
<div id="example5_div_id">
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
        outputs="[bytesToInt(data[0x84],data[0x85]), bytesToInt(data[0x88],data[0x89])]"
        color="blue"
        min="0"
        max="3000"
        width="800"
        height="600"
        interval="1000000"
        title="TCNT1 und OCR1A"
        colors='["red","blue"]'
        labels='["TCNT1","OCR1A"]'
    ></memout-element><br>
</div>
</lia-keep>

``` cpp
#ifndef F_CPU
#define F_CPU 16000000UL // 16 MHz clock speed
#endif

int calcOcrFq(int prescaler,float freq) {
  return F_CPU/(prescaler*freq);
}
//toneId: ... ,A (440Hz) :0,  A# : 1, ... , C : 3, A (880Hz) : 12, ...
int calcOcrToneId(int prescaler, float toneId) {
  return calcOcrFq(prescaler,pow(2.0,toneId/12.0)*440.0);
}

int main(void){
  DDRB |=  (1 << PORTB1); //Define OCR1A as Output
  TCCR1A |= (1 << COM1A0);  //Set Timer Register
  TCCR1B |= (1 << CS10) | (1 << CS11) | (1 << WGM12);
  OCR1A = 0;
  Serial.begin(115200);
  while(1) {
    OCR1A = ((int)( calcOcrToneId(64, -14.0)+0.5 ))&0xffff;// G = -14.0
    _delay_ms(100);
    OCR1A = ((int)( calcOcrToneId(64, -9.0)+0.5 ))&0xffff;// C = -9.0
    _delay_ms(100);
    OCR1A = ((int)( calcOcrToneId(64, -5.0)+0.5 ))&0xffff;// E = -5.0
    _delay_ms(100);
    OCR1A = ((int)( calcOcrToneId(64, -2.0)+0.5 ))&0xffff;// G = -2.0
    _delay_ms(100);
  }
}

```
@AVR8jsMem.sketch(example5_div_id,3000,0)





## Beispiel 6 Button

<lia-keep>
    <div id="example_div6_id">
        <span id="simulation-time"></span><br>
        <wokwi-led color="yellow" pin="13" label="13"></wokwi-led><br>
        <wokwi-pushbutton color="red" pin="12" label="Drück mich!"></wokwi-pushbutton><br>
        <memout-element type="bin" address="PORTB"></memout-element> <memout-element type="bin" address="DDRB"></memout-element> <memout-element type="bin" address="PINB"></memout-element><br>
    </div>
</lia-keep>

``` cpp
// preprocessor definition
#define F_CPU 16000000UL

#include <avr/io.h>
#include <util/delay.h>

int main (void) {
   DDRB |= (1 << PB5);
   int state = 0;
   // aktives überwachen des Pins
   while(1) {
   	   if (state ^ ((PINB >> PB4) & 1)) {
      		state ^= 1;
      		if (state) {
      			PORTB ^= ( 1 << PB5 );
      		}
   	   }
       _delay_ms(1);
   }
   return 0;
}
```
@AVR8jsMem.sketch(example_div6_id,100000,1)
