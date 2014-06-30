function spyOnAllFunctions(obj, callThru) {
    for (var name in obj) {
        if (obj.hasOwnProperty(name) && typeof obj[name] === 'function') {
            if (callThru) {
                spyOn(obj, name).and.callThrough();
            } else {
                spyOn(obj, name);
            }
        }
    }
};