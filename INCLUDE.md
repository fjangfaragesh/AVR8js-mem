<!--
author:   Fabian Bär

email:    Fabian.Baer@student.tu-freiberg.de

version:  0.0.2

comment:  Kein Kommentar!

script: https://fjangfaragesh.github.io/AVR8js-mem/dist/index.js
script: https://fjangfaragesh.github.io/AVR8js-mem/customfunctions.js
script: https://fjangfaragesh.github.io/AVR8js-mem/compileandrun.js

@AVR8jsMem.sketch
<script>
	let code = `@0`;
	console.log(code,`@1`, isNaN(`@2`) ? 1000000 : `@2`*1, isNaN(`@3`) ? 0 : `@3`*1);
    compileAndRun(code,`@1`, isNaN(`@2`) ? 1000000 : `@2`*1, isNaN(`@3`) ? 0 : `@3`*1);
	"LALALALALA???";
</script>
@end

-->

# AVR8js-mem makro file
