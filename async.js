function asyncf(generatorFn) {
    var defer = f => window.setTimeout(f, 0);
    var seq = generatorFn();
    
    return new Promise((resolve, reject) => {
        (function next(stepper) {
            try {
                var suspension = stepper(seq);
                if (suspension.done) {
                    resolve(suspension.value);
                }
                else {
                    var intermediary = suspension.value;
                    if (intermediary != null && typeof intermediary == "object" && intermediary instanceof Promise) {
                        defer(() => {
                            intermediary.then(
                                result => {
                                    next(seq => seq.next(result));
                                },
                                error => {
                                    next(seq => seq.throw(error));
                                });
                        });
                    }
                    else {
                        reject(new Error("Expecting a promise"));
                    }
                }
            }
            catch (error) {
                reject(error);
                return null;
            }
        })(seq => seq.next());
    });
}