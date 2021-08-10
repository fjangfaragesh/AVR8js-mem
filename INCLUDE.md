<!--
author:   Fabian Bär

email:    Fabian.Baer@student.tu-freiberg.de

version:  0.0.1

comment:  Kein Kommentar!

script: https://fjangfaragesh.github.io/AVR8js-mem/dist/index.js
script: https://fjangfaragesh.github.io/AVR8js-mem/customfunctions.js
script: https://fjangfaragesh.github.io/AVR8js-mem/compileandrun.js

@AVR8jsMem.sketch

<script type="text/javascript">
    alert("dad makro geht hoffentlich");
    console.log(`@input`,`@0`, isNaN(`@1`) ? 1000000 : `@1`*1, isNaN(`@3`) ? 1000000 : `@2`*1);
    compileAndRun(`@input`,`@0`, isNaN(`@1`) ? 1000000 : `@1`*1, isNaN(`@3`) ? 1000000 : `@2`*1);
</script>

@end

-->

# AVR8js-mem makro file
