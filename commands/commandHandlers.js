const prompt = require("prompt");
const {
    addItem,
    getItem,
    removeItem,
    listItems,
    copybagoo,
    configureBagoo
} = require("./index");

/**
 * Add item command handler
 * @param {Object} bagoo 
 * @param {String} itemName 
 */
exports.add = (bagoo, itemName) => {
    // create itemDto
    const itemDto = Object.keys(bagoo).reduce((ref, curr) => {
        if(curr === "category" || curr === "value" || curr === "description"){
            ref[curr] = bagoo[curr]
        }
        return ref
    }, {});

    addItem(itemName, itemDto).catch(err => console.log(err));
};

/**
 * Get item command handler
 * @param {Object} bagoo 
 * @param {String} itemName 
 */
exports.get = (bagoo, itemName) => {
    // get the first flag passed in ignores any associated value
    const flag = Object.keys(bagoo).filter(flag => {
        if (flag === "value" || flag === "description" || flag === "category"){
            return flag
        }
    })[0]

    return getItem(itemName, flag)
        .then(item => {
            // if returned item is object log the key-value to console
            if(typeof item === "object"){
                const entries =  Object.entries(item);
                entries.forEach((item, idx) => {
                    console.log(`${idx === 0 ? '\n':""}${item[0]}: ${item[1]} ${entries.length - 1 === idx ? '\n':""}`)
                })
            } else {
                console.log(item);
            }
        });
}

/**
 * Remove item command handler
 * @param {Object} bagoo 
 * @param {String} itemName 
 */
exports.remove = (bagoo, itemName) => {
    let isPurge = bagoo?.purge || false;
    const remove = () => {
        removeItem(itemName, isPurge).then(() => {
            if(isPurge){
                console.log("\nYour bag has been emptied\n")
            } else {
                console.log(`\nRemoved ${itemName} from your bag\n`)
            }
        })
        .catch(err => console.log(err))
    }

    if(isPurge){
        prompt.message = "This action will remove all items in your bag, are you sure?";
        prompt.start()
        prompt.get("(Y/N)", (err, result) => {
            if(err) console.log(err);

            const { "(Y/N)": answer } = result;
            const formattedAnswer = answer.toLowerCase();
            if(formattedAnswer === "y" || formattedAnswer === "yes"){
                isPurge = true;
                remove();
            } else {
                isPurge = false
            };
        });
    } else {
        if(itemName){
            remove();
        } else {
            console.log("\nEnter the name of the item your want to remove e.g. -n='item name'\n")
        }
    }
};

/**
 * Remove item command handler
 * @param {Object} bagoo 
 */
exports.list = (bagoo) => {
    const category = bagoo?.category;
    listItems(bagoo?.category)
        .then(list => {
            if(category){
                console.log(`\nItems recorded under ${category}:`)
                list.forEach((item, idx) => {
                    const entry = Object.entries(item)[0];
                    console.log(`- ${entry[0]} : ${entry[1]}${list.length - 1 === idx ? '\n':""}`);
                })
            } else {
                console.log("\nAvailable categories:")
                list.length ? 
                    list.forEach(cat => console.log(`- ${cat !== null ? cat : "None"}\n`))
                    : console.log("- No items\n")
                
            }
        })
        .catch(err => console.log(err));
};

/**
 * Copy bagoo json store command handler
 */
exports.copy = () => {
    copybagoo()
};

exports.configure = () => {
    const location = bagoo?.location;
    console.log(location)
};

exports.baseDefault = () => console.log("Please enter a valid command, for help type bagoo --help");