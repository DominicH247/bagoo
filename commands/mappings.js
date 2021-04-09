const { add, get, list, remove, copy, baseDefault, config } = require("./commandHandlers");

// add additional commands here

exports.cmdMapping = {
    add,
    get,
    list,
    remove,
    copy,
    config,
    baseDefault
};
