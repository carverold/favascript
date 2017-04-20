module.exports.getJSCode = function() {
    return `class Test {
        constructor(param1 = 1, param = "2", param3 = false, param4 = 0) {
            this.param1 = param1,
            this.param2 = param2,
            this.param3 = param3,
            this.param4 = param4,
        }
    }`;
};
