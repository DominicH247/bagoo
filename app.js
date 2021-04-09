#!/usr/bin/env node

const yargs = require("yargs")
const { cmdMapping } = require("./commands/mappings");
const { getBagooPath } = require("./utils/index");

const bagoo = yargs
    .command("add", "Adds a new item", {
        name: {
            describe: "name identifier for your item",
            demandOption: true
        },
        description: {
            describe: "description of the item",
            demandOption: false
        },
        category: {
            describe: "add your item to a category",
            demandOption: false
        },
        value: {
            describe: "The value of your item",
            demandOption: true
        }
    })
    .command("get", "Get an item from your bag", {
        name: {
            describe: "item name identifier",
            demandOption: true
        },
        description: {
            describe: "read the description of the item",
            demandOption: false
        },
        category: {
            describe: "read the category of the item",
            demandOption: false
        },
        value: {
            describe: "read the value of the item",
            demandOption: false
        }
    })
    .command("list", "list all catagories within your bag or all items under a particular category", {
        category: {
            describe: "name of the category",
            demandOption: false
        }
    })
    .command("remove", "remove a particular item or empty your entire bag", {
        name: {
            describe: "name identifier for the item you want to remove",
            demandOption: false
        },
        purge: {
            describe: "empties the entire bag",
            demandOption: false
        }
    })
    .command("copy", "copy your bag to another location")
    .command("config", "configure the location of the bagoo store", {
        location: {
            describe: "path to the bagoo store",
            demandOption: true
        }
    })
    .help()
    .alias("help", "h")
    .alias("description", "d")
    .alias("category", "c")
    .alias("value", "v")
    .alias("name", "n")
    .alias("purge", "p")
    .alias("location", "l")
    .argv

const main = (bagoo) => {
    getBagooPath()
        .then(path => {
            const bagooPath = path.concat("/bagoo.json");
            const bagooCommand = bagoo._[0];
            
            // take the frist name passed in
            const itemName = Array.isArray(bagoo?.name) ? bagoo?.name[0].toLowerCase() : bagoo?.name;
            
            if(!bagooCommand){
                return Promise.reject("\nPlease enter a valid command, for help use \"bag --help\"\n")
            }
            cmdMapping[bagooCommand](bagoo, bagooPath, itemName);
        })
        .catch(err => console.log(err))
}

main(bagoo);
