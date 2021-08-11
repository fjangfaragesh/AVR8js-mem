<!--
author:   Fabian Bär

email:    Fabian.Baer@student.tu-freiberg.de

version:  0.0.3

comment:  Kein Kommentar!

script: https://fjangfaragesh.github.io/AVR8js-mem/dist/index.js
script: https://fjangfaragesh.github.io/AVR8js-mem/customfunctions.js
script: https://fjangfaragesh.github.io/AVR8js-mem/compileandrun.js

@AVR8jsMem.sketch
<script>
	async function sketch() {
        console.log("RUN");
		let code = `@input`;
		let stopFunctionCallback = function(f) {
            send.handle("stop",f);
		}
	    try {
            send.lia("LIA: terminal");
	    	await compileAndRun(code,`@0`, isNaN(`@1`) ? 1000000 : `@1`*1, isNaN(`@2`) ? 0 : `@2`*1, isNaN(`@3`) ? Infinity : `@3`*1, stopFunctionCallback);
			send.lia("LIA: stop");
	    } catch (e) {
			console.error(e);
			send.lia("LIA: stop");
	    }
	}
	setTimeout(sketch, 100)
	"LIA: wait";
</script>
@end

-->

# AVR8js-mem makro file
