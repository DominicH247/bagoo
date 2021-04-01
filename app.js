#!/usr/bin/env node

const yargs = require("yargs")
const { cmdMapping } = require("./commands/mappings");

const baggo = yargs
    .command("add", "Adds a new item", {
        name: {
            describe: "name identifier for your item",
            demandOption: true
        },
        description: {
            describe: "description of the item",
            demandOption: false
        },
        catagory: {
            describe: "add your item to a catagory",
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
        catagory: {
            describe: "read the catagory of the item",
            demandOption: false
        },
        value: {
            describe: "read the value of the item",
            demandOption: false
        }
    })
    .command("list", "list all catagories within your bag or all items under a particular catagory", {
        catagory: {
            describe: "name of the catagory",
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
    .help()
    .alias("help", "h")
    .alias("description", "d")
    .alias("catagory", "c")
    .alias("value", "v")
    .alias("name", "n")
    .alias("purge", "p")
    .argv

const main = (baggo) => {
   const baggoCommand = baggo._[0];

   // take the frist name passed in
   const itemName = (
       Array.isArray(baggo?.name) ? baggo?.name[0] : baggo?.name
    ).toLowerCase();

   cmdMapping[baggoCommand](baggo, itemName);
}

main(baggo);
