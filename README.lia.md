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
    <wokwi-led color="green" pin="9" label="B1"></wokwi-led><br>
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
  int timerCompareValue = 0;
  while(1) {
   while(timerCompareValue < 255){ //Fade from low to high
    timerCompareValue++;
    OCR1A = timerCompareValue;
    _delay_ms(4);

  }
   while(timerCompareValue > 0){ //Fade from high to low
    timerCompareValue--;
    OCR1A = timerCompareValue;
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
    <wokwi-led color="green" pin="9" label="B1"></wokwi-led><br>
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
  int timerCompareValue = 0;
  while(1) {
   while(timerCompareValue < 255){ //Fade from low to high
    timerCompareValue++;
    OCR1A = timerCompareValue;
    _delay_ms(4);

  }
   while(timerCompareValue > 0){ //Fade from high to low
    timerCompareValue--;
    OCR1A = timerCompareValue;
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
    <wokwi-led color="green" pin="10" label="B2"></wokwi-led><br>

            <!-- memout web komponenten -->
            <!-- Textausgaben -->
    <b>PORTB: </b> <memout-element type="bin" address="0x25"></memout-element>
    <b>DDRB: </b> <memout-element type="bin" address="0x24"></memout-element>
    <b>PINB: </b> <memout-element type="bin" address="0x23"></memout-element><br>
    <b>TCCR1: </b> <memout-element type="bin" address="0x80" bytes="2" endian="little"></memout-element><br>
    <b>TCNT1: </b> <memout-element type="bin" address="0x84" bytes="2" endian="little"></memout-element><br>
    <b>OCR1A: </b> <memout-element type="bin" address="0x88" bytes="2" endian="little"></memout-element><br>
    <b>OCR1B: </b> <memout-element type="bin" address="0x88" bytes="2" endian="little"></memout-element><br>
            <!-- Diagramm -->
    <memout-element
        type="diagram2"
        outputs="[bytesToInt(data[0x84],data[0x85]), bytesToInt(data[0x88],data[0x89]), bytesToInt(data[AVR8_REGISTER.OCR1BL],data[AVR8_REGISTER.OCR1BH]),(bytesToInt(data[0x84],data[0x85]) < bytesToInt(data[AVR8_REGISTER.OCR1BL],data[AVR8_REGISTER.OCR1BH]))*450 + 2500]"
        color="blue"
        min="0"
        max="3000"
        width="800"
        height="600"
        interval="1000000"
        title="TCNT1 und OCR1A"
        colors='["red","blue","yellow","green"]'
        labels='["TCNT1","OCR1A","OCR1B","PB2 (Audio)"]'
    ></memout-element><br>
</div>
</lia-keep>

``` cpp
#ifndef F_CPU
#define F_CPU 16000000UL // 16 MHz clock speed
#endif
#ifndef F_CPU
#define F_CPU 16000000UL // 16 MHz clock speed
#endif
const int NOTE_TICK_DURATION_MILLISECONDS = 10;//schneller für Simulation
//const int NOTE_TICK_DURATION_MILLISECONDS = 40;//Mit echten Arduino bitte dies verwenden!

const float BASE_FREQ = 440.0;
const float FRQ_MULT[] = {1.0,2.3,0.6,4.1};


typedef struct {
  float tone;
  float pulseWidth;
  int duration; // duration in note-ticks
} Note;

Note notes[] = {
 {.tone=3,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=2,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=-2,.pulseWidth=0.25,.duration=4},{.tone=3,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=8,.pulseWidth=0.5,.duration=4},{.tone=-2,.pulseWidth=0.25,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=3,.pulseWidth=0.5,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=8,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=8,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=12,.pulseWidth=0.5,.duration=4},{.tone=-2,.pulseWidth=0.25,.duration=4},{.tone=12,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=10,.pulseWidth=0.5,.duration=4},{.tone=8,.pulseWidth=0.5,.duration=4},{.tone=10,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=3,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=0,.pulseWidth=1,.duration=4},{.tone=-2,.pulseWidth=0.25,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=12,.pulseWidth=0.5,.duration=4},{.tone=-16,.pulseWidth=0.25,.duration=4},{.tone=10,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=8,.pulseWidth=0.5,.duration=4},{.tone=-16,.pulseWidth=0.25,.duration=4},{.tone=7,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=-2,.pulseWidth=0.25,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=5,.pulseWidth=0.5,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=-2,.pulseWidth=0.25,.duration=4},{.tone=-14,.pulseWidth=0.25,.duration=4},{.tone=3,.pulseWidth=0.5,.duration=4},{.tone=-21,.pulseWidth=0.25,.duration=4},{.tone=-9,.pulseWidth=0.25,.duration=4},{.tone=-21,.pulseWidth=0.125,.duration=4},{.tone=-9,.pulseWidth=0.125,.duration=4},{.tone=-21,.pulseWidth=0.08333333333333333,.duration=4},{.tone=-9,.pulseWidth=0.08333333333333333,.duration=4},{.tone=-21,.pulseWidth=0.0625,.duration=4},{.tone=-9,.pulseWidth=0.0625,.duration=4},{.tone=-21,.pulseWidth=0.05,.duration=4},{.tone=-9,.pulseWidth=0.041666666666666664,.duration=4},{.tone=-21,.pulseWidth=0.03571428571428571,.duration=4},{.tone=-9,.pulseWidth=0.03125,.duration=4},{.tone=-21,.pulseWidth=0.027777777777777776,.duration=4},{.tone=-9,.pulseWidth=0.025,.duration=4},{.tone=-21,.pulseWidth=0.020833333333333332,.duration=4},{.tone=0,.pulseWidth=1,.duration=16},
 };
 int notesLength = sizeof(notes)/sizeof(Note);

int calcOcrFq(int prescaler,float freq) {
  return (int)(F_CPU/(prescaler*freq) + 0.5) & 0xffff;
}
//toneId: ... ,A (440Hz) :0,  A# : 1, ... , C : 3, A (880Hz) : 12, ...
int calcFreq(float toneId) {
  return pow(2.0,toneId/12.0)*BASE_FREQ;
}
// pulseWidth between 0.0 and 1.0
void playFq(int prescaler,float fq, float pulseWidth) {
  int timerTop = calcOcrFq(prescaler,fq);
  int timerCompare = timerTop*pulseWidth + 0.5;
  OCR1A = timerTop;
  OCR1B = timerCompare;
  TCNT1 = 0;
}

int main(void){
  DDRB |=  (1 << PORTB2); //Define OCR1B as Output (Pin Name auf arduino: 9)
  TCCR1A |= (1 << COM1A0) | (1 << COM1B1) | (1 << WGM10);  //Set Timer Register
  TCCR1B |= (1 << CS10) | (1 << CS11) | (1 << WGM13);
  OCR1A = 0;
  OCR1B = 500;
  int n = 0;
  while(1) {
    for (int i = 0; i < notesLength; i++) {
      playFq(64, calcFreq(notes[i].tone)*FRQ_MULT[n%4], notes[i].pulseWidth);
      for (int t = 0; t < notes[i].duration; t++) _delay_ms(NOTE_TICK_DURATION_MILLISECONDS);
    }
    n++;
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
