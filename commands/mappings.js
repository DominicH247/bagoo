const { add, get, list, remove, copy, baseDefault } = require("./commandHandlers");

// add additional commands here

exports.cmdMapping = {
    add,
    get,
    list,
    remove,
    copy,
    baseDefault
};
