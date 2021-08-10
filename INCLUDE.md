<!--
author:   Fabian Bär

email:    Fabian.Baer@student.tu-freiberg.de

version:  0.0.2

comment:  Kein Kommentar!

script: https://fjangfaragesh.github.io/AVR8js-mem/dist/index.js
script: https://fjangfaragesh.github.io/AVR8js-mem/customfunctions.js
script: https://fjangfaragesh.github.io/AVR8js-mem/compileandrun.js

@AVR8jsMem.sketch: @AVR8jsMem.sketchMultiline(@input,@0,@1,@2)

@AVR8jsMem.sketchMultiline
<script>
    alert("dad makro geht hoffentlich");
    console.log(`@0`,`@1`, isNaN(`@2`) ? 1000000 : `@2`*1, isNaN(`@3`) ? 0 : `@3`*1);
    compileAndRun(`@0`,`@1`, isNaN(`@2`) ? 1000000 : `@2`*1, isNaN(`@3`) ? 0 : `@3`*1);
	"LIA: wait"
</script>
@end

-->

# AVR8js-mem makro file
