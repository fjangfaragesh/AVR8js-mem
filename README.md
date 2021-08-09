# AVR8js-mem

AVR8js-mem ermöglicht es code auf einem simmulierten avr aus zu führen, die Reaktion von an diesen angeschlossenen Komponenten (zum Beispiel LEDs) zu visualisieren und den Inhalt von Registern bzw vom Speicher aus zu lesen und dar zu stellen.

## Nutzung
[Beispiel HTML Datei](extern_template.html)

Es wird `/dist/index.js` und [`/compileandrun.js`](compileandrun.js) benötigt.  
Sinnvoll für Diagramme: [`customfunctions.js`](customfunctions.js) einbinden.

`<span id="simmulation-time"></span>` ist zwingend notwendig. In dieses wird die aktuelle Simmulationszeit geschrieben.  

### Wokwi Web komponenten
Alle Komponenten müssen sich zusammen in einem div mit befinden.

### Memout-Element Web Komponenten

Eine Memout-Element Web Komponente kann definiert werden mit `<memout-element type='...'></memout-element>`. (wobei ... durch den Typ ersetzt werden muss)

Memout-Element Typen:
#### bin
Stellt den Speicher an der stelle `address` als Binärzahl dar.  
Attribute:  
`address`: Speicher Adresse  
`bytes`: Größe der Zahl in Bytes. 1: byte, 2:short, 4:32BitInteger  
`èndian`: falls `bytes` > 1: Wie die Bytes interpretiert werden sollen `"little"` für little endian, `"big"` für big endian


#### hex
Stellt den Speicher an der stelle `address` als Hexadezimalzahl dar.  
Attribute analog zu `type="bin"`

#### uint
Stellt den Speicher an der stelle `address` vorzeichenlose ganze Dezimalzahl dar.  
Attribute analog zu `type="bin"`

#### diagram
TODO

#### diagram2
TODO

#### custom
Hiermit ist es möglich selbst fest zu legen, wie der Speicherinhalt dargestellt wird. Hierbei wird JavaScript Code übergeben, der einen String oder eine Zahl zürück gibt, die dann dort angezeigt wird.
Attribute:  
`output`:javascript code. Es stehen diese Variablen zur Verfügung: `data`: Byte Array des Speichers, `currentCycle`: nummer des aktuellen CPU Zykluses  
Beispiel: `output="data[0x85] + data[0x25]"` (addiert den Speicher an der Stelle 0x85 und 0x25 und zeigt das Ergebnis an)

### Simmulation starten
Mit dem ausführen von `compileAndRun(codeString,divId, cyclesPerFrame,frameDelayMilliseconds)` wird die Simmulation gestartet.  
- `codeString`: der auszuführende Code  
- `divId`: id des div elements, in dem sich die wokwi web komponenten befinden  
- `cyclesPerFrame`: Anzahl der CPU Zyklen, die in einem animations Frame ausgeführt werden. Nach diesen werden die Webkomponenten aktuallisiert und der nächste Frame beginnt (empfohlen: 100000)  
- `frameDelayMilliseconds`: Zeit in Millisekunden zwischen zwei Frames. Zum Verlangsamen der Simmulation diese erhöhen. Sonst 0 lassen.  