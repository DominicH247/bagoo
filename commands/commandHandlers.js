const prompt = require("prompt");
const {
    addItem,
    getItem,
    removeItem,
    listItems,
    copyBaggo
} = require("./index");

/**
 * Add item command handler
 * @param {Object} baggo 
 * @param {String} itemName 
 */
exports.add = (baggo, itemName) => {
    // create itemDto
    const itemDto = Object.keys(baggo).reduce((ref, curr) => {
        if(curr === "catagory" || curr === "value" || curr === "description"){
            ref[curr] = baggo[curr]
        }
        return ref
    }, {});

    addItem(itemName, itemDto)
};

/**
 * Get item command handler
 * @param {Object} baggo 
 * @param {String} itemName 
 */
exports.get = (baggo, itemName) => {
    // get the first flag passed in ignores any associated value
    const flag = Object.keys(baggo).filter(flag => {
        if (flag === "value" || flag === "description" || flag === "catagory"){
            return flag
        }
    })[0]

    return getItem(itemName, flag)
        .then(item => {
            // if returned item is object log the key-value to console
            if(typeof item === "object"){
                Object.entries(item).forEach(item => {
                    console.log(`${item[0]}: ${item[1]}`)
                })
            } else {
                console.log(item)
            }
        });
}

/**
 * Remove item command handler
 * @param {Object} baggo 
 * @param {String} itemName 
 */
exports.remove = (baggo, itemName) => {
    let isPurge = baggo?.purge || false;
    const remove = () => {
        removeItem(itemName, isPurge).then(() => {
            if(isPurge){
                console.log("Your bag has been emptied")
            } else {
                console.log(`Removed ${itemName} from your bag`)
            }
        });
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
            console.log("Enter the name of the item your want to remove e.g. -n='item name'")
        }
    }
};

/**
 * Remove item command handler
 * @param {Object} baggo 
 */
exports.list = (baggo) => {
    const catagory = baggo?.catagory;
    listItems(baggo?.catagory)
        .then(list => {
            if(catagory){
                console.log(`Items recorded under ${catagory}:`)
                list.forEach(item => {
                    const entry = Object.entries(item)[0];
                    console.log(`- ${entry[0]} : ${entry[1]}`)
                })
            } else {
                console.log("Available catagories:")
                list.forEach(cat => console.log(`- ${cat}`))
            }
        });
};

/**
 * Copy baggo json store command handler
 */
exports.copy = () => {
    copyBaggo()
};

exports.baseDefault = () => console.log("Please enter a valid command, for help type baggo --help");