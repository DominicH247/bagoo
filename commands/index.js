const fs = require("fs").promises;
const prompt = require("prompt")
const shelljs = require("shelljs");

let bagoo = "./bagoo.json";

if(process.env.NODE_ENV === "test"){
    bagoo = "./tests/test.json"
}

/**
 * Retrieves a single item from the bagoo json store
 * @param {String} itemName 
 * @param {string} flag 
 * @returns {Promise}
 */
exports.getItem = (itemName, flag) => {
    return fs.readFile(bagoo)
        .then(body => JSON.parse(body))
        .then(content => {
            if(!content?.[itemName] || !itemName) {
                return "Item not found"
            };

            if(!content?.[itemName]?.[flag] && flag){
                return "Invalid flag"
            };

            if(flag){
                return content?.[itemName]?.[flag]
            }

            return content?.[itemName]
        });
};

/**
 * Adds an item to the bagoo json store
 * @param {String} itemName 
 * @param {Object} itemDto 
 * @returns {Promise}
 */
exports.addItem = (itemName, itemDto = {}) => {
    return fs.readFile(bagoo)
        .then(body => JSON.parse(body))
        .then(content => {
            const dtoCopy = {...itemDto}

            // Check if add new item or updating an existing one
            isExistingItem = content?.[itemName] ? true : false;

            if(!isExistingItem){
                // Check if new item contains a value
                isContainingValue = Object.keys(dtoCopy).includes("value");
                if(!isContainingValue){
                    console.log("<<")
                    return Promise.reject("Please enter a value for your new item");
                }
            }

            // collect the invalid keys
            const invalidFlags = Object.keys(itemDto).filter(key => {
                if(key !== "description" && key !== "value" && key !== "catagory"){
                    return key
                }
            });
            // remove invalid keys 
            invalidFlags.forEach(flag => delete dtoCopy[flag])

            const newItemObj = {
                catagory: dtoCopy?.catagory || "other",
                description: dtoCopy?.description || "",
                value: dtoCopy?.value || "",
            }

            transferObj = isExistingItem? dtoCopy : newItemObj;

            content[itemName] = {
                ...content[itemName],
                ...transferObj
            }

            return fs.writeFile(bagoo, JSON.stringify(content, null, 2))
        })
};

/**
 * Lists the available catagories within the bagoo json store, or if passed an existing catagory will list all items held within that catagory 
 * @param {String} catagory 
 * @returns {Array}
 */
exports.listItems = (catagory = null) => {
    return fs.readFile(bagoo)
        .then(body => JSON.parse(body))
        .then(content => {
            if(catagory !== null){
                const catagories = Object.keys(content)
                    .filter(itemName => {
                        if(content[itemName].catagory === catagory){
                            return itemName;
                        };
                    })
                    .map(itemName => ({ [itemName]: content[itemName]?.description || "No description" }))

                return catagories.length ? catagories : Promise.reject("Catagory does not exist");
            } 

            return [...new Set(Object.keys(content).map(itemName => content[itemName].catagory))];
        })
};

/**
 * Removes an item when passed in the name identifier or purge all items
 * @param {String} itemName 
 * @param {Boolean} isPurge 
 * @returns {Promise}
 */
exports.removeItem = (itemName = null, isPurge = false) => {
    return fs.readFile(bagoo)
        .then(body => JSON.parse(body))
        .then(content => {
            if(isPurge){
                return fs.writeFile(bagoo, JSON.stringify({}, null, 2))
            }

            // check if item exists
            if(!content?.[itemName]){
                return Promise.reject("Item not found");
            }

            delete content[itemName];
            return fs.writeFile(bagoo, JSON.stringify(content, null, 2))
        })
};

/**
 * Copys the bagoo json store the path passed in by the user
 * Does not delete the original store or switches the store context
 */
exports.copybagoo = () => {
    prompt.message = "Enter the path to where you want to export your bag to";
    prompt.start()
    prompt.get("path", (err, result) => {
        if(err) console.log(err);
        const { path } = result;
        if(path){
            console.log(`Copying your bag to ${path}`)
            shelljs.cp("./bagoo.json", path)
        }
    });
};
