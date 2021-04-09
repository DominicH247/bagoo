const fs = require("fs").promises;
const prompt = require("prompt")
const shelljs = require("shelljs");

/**
 * Retrieves a single item from the bagoo json store
 * @param {String} itemName 
 * @param {string} flag 
 * @param {String} bagooFilePath
 * @returns {Promise}
 */
exports.getItem = (itemName, flag, bagooFilePath) => {
    return fs.readFile(bagooFilePath)
        .then(body => JSON.parse(body))
        .then(content => {
            if(!content?.[itemName] || !itemName) {
                return "\nItem not found\n"
            };

            if(!content?.[itemName]?.[flag] && flag){
                return "\nInvalid flag\n"
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
 * @param {String} bagooFilePath
 * @returns {Promise}
 */
exports.addItem = (itemName, itemDto = {}, bagooFilePath) => {
    return fs.readFile(bagooFilePath)
        .then(body => JSON.parse(body))
        .then(content => {
            const dtoCopy = {...itemDto}

            // Check if add new item or updating an existing one
            isExistingItem = content?.[itemName] ? true : false;

            if(!isExistingItem){
                // Check if new item contains a value
                isContainingValue = Object.keys(dtoCopy).includes("value");
                
                if(!isContainingValue || itemDto?.value === ""){
                    return Promise.reject("\nPlease enter a value for your new item\n");
                }
            }

            // collect the invalid keys
            const invalidFlags = Object.keys(itemDto).filter(key => {
                if(key !== "description" && key !== "value" && key !== "category"){
                    return key
                }
            });
            // remove invalid keys 
            invalidFlags.forEach(flag => delete dtoCopy[flag])

            const newItemObj = {
                category: dtoCopy?.category || "other",
                description: dtoCopy?.description || "",
                value: dtoCopy?.value || "",
            }

            transferObj = isExistingItem? dtoCopy : newItemObj;

            content[itemName] = {
                ...content[itemName],
                ...transferObj
            }

            return fs.writeFile(bagooFilePath, JSON.stringify(content, null, 2))
        })
};

/**
 * Lists the available catagories within the bagoo json store, or if passed an existing category will list all items held within that category 
 * @param {String} category 
 * @param {String} bagooFilePath
 * @returns {Array}
 */
exports.listItems = (category = null, bagooFilePath) => {
    return fs.readFile(bagooFilePath)
        .then(body => JSON.parse(body))
        .then(content => {
            if(category !== null){
                const catagories = Object.keys(content)
                    .filter(itemName => {
                        if(content[itemName].category === category){
                            return itemName;
                        };
                    })
                    .map(itemName => ({ [itemName]: content[itemName]?.description || "No description" }))

                return catagories.length ? catagories : Promise.reject("\ncategory does not exist\n");
            } 

            return [...new Set(Object.keys(content).map(itemName => content[itemName].category))];
        })
};

/**
 * Removes an item when passed in the name identifier or purge all items
 * @param {String} itemName 
 * @param {Boolean} isPurge
 * @param {String} bagooFilePath
 * @returns {Promise}
 */
exports.removeItem = (itemName = null, isPurge = false, bagooFilePath) => {
    return fs.readFile(bagooFilePath)
        .then(body => JSON.parse(body))
        .then(content => {
            if(isPurge){
                return fs.writeFile(bagooFilePath, JSON.stringify({}, null, 2))
            }

            // check if item exists
            if(!content?.[itemName]){
                return Promise.reject("Item not found");
            }

            delete content[itemName];
            return fs.writeFile(bagooFilePath, JSON.stringify(content, null, 2))
        })
};

/**
 * Copys the bagoo json store the path passed in by the user
 * Does not delete the original store or switches the store context
 */
exports.copybagoo = () => {
    prompt.message = "\nEnter the path to where you want to export your bag to\n";
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

/**
 * Sets a new location for the bagoo
 * @param {String} path 
 * @returns Promise
 */
exports.configureBagoo = (path="") => {
    if(!path){
        return Promise.reject("\nPlease enter a valid path\n")
    }
    bagoo = path.concat("/bagoo.json");
    return fs.access(bagoo, fs.F_OK)
        .then(() => {
                console.log(`\nLocation set to ${bagoo}\n`);
                return bagoo
            })
            .catch(() => Promise.reject("\nNo bagoo file found, copy your bagoo.json file" +
                " to the location first using the bagoo \"copy\" command\n"))
}
