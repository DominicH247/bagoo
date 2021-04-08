const { add, get, list, remove, copy, baseDefault, configure } = require("./commandHandlers");

// add additional commands here

exports.cmdMapping = {
    add,
    get,
    list,
    remove,
    copy,
    configure,
    baseDefault
};
