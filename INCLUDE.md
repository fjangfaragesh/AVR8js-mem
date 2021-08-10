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
	async function sketch() {
		let code = `@input`;
		console.log("compiling...")
	    try {
	    	await compileAndRun(code,`@0`, isNaN(`@1`) ? 1000000 : `@1`*1, isNaN(`@2`) ? 0 : `@2`*1);
	    	console.log("running...");
	    } catch (e) {
			console.error(e);
			send.stop();
	    }
	 	
	}
	sketch();
	"LIA: wait";
</script>
@end

-->

# AVR8js-mem makro file
