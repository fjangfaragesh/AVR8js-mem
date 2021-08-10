<!--
author:   Fabian Bär

email:    Fabian.Baer@student.tu-freiberg.de

version:  0.0.2

comment:  Kein Kommentar!

import: https://fjangfaragesh.github.io/AVR8js-mem/INCLUDE.md

-->

# Lia Include Example
<lia-keep>
<div id="example_div_id">
    <wokwi-led color="red"   pin="13" label="13"></wokwi-led>
    <wokwi-led color="green" pin="12" label="12"></wokwi-led>
    <wokwi-led color="blue"  pin="11" label="11"></wokwi-led>
    <wokwi-led color="blue"  pin="10" label="10"></wokwi-led>
    <span id="simulation-time"></span>
    <b>PORTB: </b><memout-element type="bin" address="0x25"></memout-element> <b>DDRB: </b><memout-element type="bin" address="0x24"></memout-element><br>
    <b>PORTC: </b><memout-element type="bin" address="0x28"></memout-element> <b>DDRC: </b><memout-element type="bin" address="0x27"></memout-element><br>
    <b>PORTD: </b><memout-element type="bin" address="0x2B"></memout-element> <b>DDRD: </b><memout-element type="bin" address="0x2A"></memout-element><br>     
    <b>led 13: </b><memout-element type="custom" output="extractBit(data[0x25],5)"></memout-element><br>

<memout-element
        type="diagram2"
        outputs="[ extractBit(data[0x25],5), extractBit(data[0x25],4)+1.5, extractBit(data[0x25],3)+3, extractBit(data[0x25],2)+4.5 ]"
        color="red"
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
@AVR8jsMem.sketch(example_div_id, 123456, 0)
