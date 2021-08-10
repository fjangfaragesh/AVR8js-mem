async function compileAndRun(codeString,divId, cyclesPerFrame,frameDelayMilliseconds, maxNumberOfCycles) {
    let e = await AVR8js.build(codeString , []);
    console.log(e);
    if (e.stderr) {
        let msgs = []

        for(let i = 0; i<name.length; i++) {
            msgs.push([])
        }

        let iter = e.stderr.matchAll(/(\w+\.\w+):(\d+):(\d+): ([^:]+):(.+)/g)

        /*for(let err=iter.next(); !err.done; err=iter.next()) {
            msgs[name.findIndex((e) => e==err.value[1])].push({
            row :    parseInt(err.value[2]) - 1,
            column : parseInt(err.value[3]),
            text :   err.value[5],
            type :   err.value[4]
            })
        }*/
        throw new Error(e.stderr + " " + msgs);
    } else {
        console.debug(e.stdout);
        if (e.hex) {
            let runner = AVR8js.execute(e.hex, console.log, divId, undefined, cyclesPerFrame*1, frameDelayMilliseconds*1, maxNumberOfCycles ?? Infinity);
        } else {
            throw new Error("no hex!");
        }
    }
}