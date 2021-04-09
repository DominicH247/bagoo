const { getItem, addItem, listItems, removeItem, configure, configureBagoo } = require("../commands/index");
const fs = require("fs").promises;
const os = require('os');
const appRoot = require("app-root-path");

const testFilePath = appRoot.path.concat("/tests/test.json");

beforeEach(() => {
    const testData = {
        "item 1": {
          "category": "cat1",
          "description": "This is a description1",
          "value": "this is the value of item1"
        },
        "item 2": {
          "category": "cat1",
          "description": "This is a description2",
          "value": "this is a the value of item2"
        },
        "item 3": {
          "category": "cat2",
          "description": "This is a description3",
          "value": "this is a the value of item3"
        },
        "item 4": {
            "category": "catB",
            "description": "This is a description4",
            "value": "this is the value of item4"
          },
          "item 5": {
            "category": "cat1",
            "description": "This is a description5",
            "value": "this is a the value of item5"
          },
          "item 6": {
            "category": "catB",
            "description": "This is a description6",
            "value": "this is a the value of item6"
          },
          "item 7": {
            "category": "catA",
            "description": "This is a description7",
            "value": "this is a the value of item7"
          },
    }

    return fs.writeFile("./tests/test.json", JSON.stringify(testData, null, 2))
})

afterEach(() => fs.writeFile("./tests/test.json", JSON.stringify({})))

describe("getItem()", () => {
    describe("passing in only item name", () => {
        it("when pass in an existing item name it returns the category, description and value", (done) => {
            getItem("item 1", null, testFilePath).then(result => {
                expect(result).toEqual(
                        {
                            "category" : "cat1",
                            "description": "This is a description1",
                            "value": "this is the value of item1" 
                        }
                );
                done();
            });
        });
        it("if passed in an existing item name it returns an object of the item", (done) => {
            getItem("item 1", null, testFilePath).then(result => {
                expect(typeof result).toBe("object");
                done();
            });
        });
        it("if passed an item name that does not exist it returns not found string", (done) => {
            getItem("does not exist", null, testFilePath).then(result => {
                expect(result).toEqual("\nItem not found\n");
                done();
            });
        });
    });

    describe("passing in item name and a flag", () => {
        it("When passed an existing item and --description flag it returns item description", (done) => {
            getItem("item 1", "description", testFilePath).then(result => {
                expect(result).toEqual("This is a description1");
                done();
            });
        })
        it("When passed an existing item and --value flag it returns item value", (done) => {
            getItem("item 1", "value", testFilePath).then(result => {
                expect(result).toEqual("this is the value of item1");
                done();
            });
        })
        it("When passed an existing item and --category flag it returns item category", (done) => {
            getItem("item 1", "category", testFilePath).then(result => {
                expect(result).toEqual("cat1");
                done();
            });
        })
        it("When pasing in a non existant flag it returns an error message", (done) => {
            getItem("item 1", "invalid", testFilePath).then(result => {
                expect(result).toEqual("\nInvalid flag\n");
                done();
            });
        })
    })
})

describe("addItem()", () => {
    describe("passing in a new item", () => {
        it("when passing a new item name and object containing key of value it adds it to json store", (done) => {
            addItem("brand new item", {value: "A VALUE"}, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["brand new item"]).toEqual({
                    category: "other",
                    description: "",
                    value: "A VALUE"
                })
                done()
            })
        })
        it("when passing a new item name and object containing key of value and description it adds it to json store", (done) => {
            addItem("brand new item", {value: "A VALUE", description: "A DESCRIPTION"}, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["brand new item"]).toEqual({
                    category: "other",
                    description: "A DESCRIPTION",
                    value: "A VALUE"
                })
                done()
            })
        })
        it("when passing a new item name and object containing key of value, description and category it adds it to json store", (done) => {
            addItem("brand new item", {value: "A VALUE", description: "A DESCRIPTION", category: "category"}, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["brand new item"]).toEqual({
                    category: "category",
                    description: "A DESCRIPTION",
                    value: "A VALUE"
                })
                done()
            })
        })
        it("when passing a new item name with no flags return an error to enter a value", (done) => {
            return addItem("DOES NOT EXIST", null, testFilePath).catch(err => {
                expect(err).toEqual("\nPlease enter a value for your new item\n")
                done();
            })
        })
        it("when passing a new item name with value of empty stings return an error to enter a value", (done) => {
            return addItem("something new", { value: "" }, testFilePath).catch(err => {
                expect(err).toEqual("\nPlease enter a value for your new item\n")
                done();
            })
        })
    })
    describe("When passing in an existing item it updates it", () => {
        it("existing item with flag of value, overwrites the value", (done) => {
            addItem("item 1", {value: "UPDATED VALUE"}, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["item 1"]).toEqual({
                    category: "cat1",
                    description: "This is a description1",
                    value: "UPDATED VALUE"
                })
                done()
            })
        })
        it("existing item with flag of description, overwrites the description", (done) => {
            addItem("item 1", {description: "UPDATED DESCRIPTION"}, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["item 1"]).toEqual({
                    category: "cat1",
                    description: "UPDATED DESCRIPTION",
                    value: "this is the value of item1"
                })
                done()
            })
        })
        it("existing item with flag of category, overwrites the category", (done) => {
            addItem("item 1", {category: "UPDATED category"}, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["item 1"]).toEqual({
                    category: "UPDATED category",
                    description: "This is a description1",
                    value: "this is the value of item1"
                })
                done()
            })
        })
        it("updates item when all flags are passed", (done) => {
            addItem("item 3", {
                category: "UPDATED category",
                description: "AN UPDATED DESCRIPTION",
                value: "AN UPDATED VALUE"
            }, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["item 3"]).toEqual({
                    category: "UPDATED category",
                    description: "AN UPDATED DESCRIPTION",
                    value: "AN UPDATED VALUE"
                })
                done()
            })
        })
        it("if passed an invalid flag it gets ignored", (done) => {
            addItem("item 3", {
                category: "UPDATED category",
                description: "AN UPDATED DESCRIPTION",
                value: "AN UPDATED VALUE",
                invalid: "NOT VALID"
            }, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["item 3"]).toEqual({
                    category: "UPDATED category",
                    description: "AN UPDATED DESCRIPTION",
                    value: "AN UPDATED VALUE"
                })
                done()
            })
        })
        it("if passed multiple invalid flag they all get ignored", (done) => {
            addItem("item 3", {
                category: "UPDATED category",
                description: "AN UPDATED DESCRIPTION",
                value: "AN UPDATED VALUE",
                invalid: "NOT VALID",
                invalid2: "TEST",
                invalid3: "SOMETHING ELSE"
            }, testFilePath).then(() => fs.readFile("./tests/test.json"))
            .then(body => JSON.parse(body))
            .then(content => {
                expect(content["item 3"]).toEqual({
                    category: "UPDATED category",
                    description: "AN UPDATED DESCRIPTION",
                    value: "AN UPDATED VALUE"
                })
                done()
            })
        })
        it("arguments are not mutated", (done) => {
            const mockItem = {
                category: "UPDATED category",
                description: "AN UPDATED DESCRIPTION",
                value: "AN UPDATED VALUE",
                invalid: "NOT VALID",
                invalid2: "TEST",
                invalid3: "SOMETHING ELSE"
            };

            addItem("item 3", mockItem, testFilePath).then(() => {
                expect(mockItem).toEqual({
                    category: "UPDATED category",
                    description: "AN UPDATED DESCRIPTION",
                    value: "AN UPDATED VALUE",
                    invalid: "NOT VALID",
                    invalid2: "TEST",
                    invalid3: "SOMETHING ELSE"
                })
                done()
            })
        })
    })
});

describe("listItems()", () => {
    describe("passing in a category", () => {
        it("list all items within an existing category", (done) => {
            listItems("cat1", testFilePath).then(content => {
                const expectedResult = [
                    { "item 1": "This is a description1" },
                    { "item 2": "This is a description2" },
                    { "item 5": "This is a description5" }
                ]
                expect(content).toEqual(expectedResult)
                done()
            })
        })
        it("returns error message if category is not found", (done) => {
            listItems("not exist", testFilePath).catch(err => {
                expect(err).toEqual("\ncategory does not exist\n")
                done()
            })
        })
    })
    describe("passing in empty category", () => {
        it("lists all the catagories containing within the store when no category passed", (done) => {
            listItems(null, testFilePath).then(content => {
                expect(content).toEqual([ 'cat1', 'cat2', 'catB', 'catA' ])
                done()
            })
        })
    })
});

describe("removeItem()", () => {
    describe("passing in existing item name", () => {
        it("passing in an existing item name it remove it from the json store", (done) => {
            removeItem("item 4", null, testFilePath).then(() =>  fs.readFile("./tests/test.json"))
                .then(body => JSON.parse(body))
                .then(content => {
                    const expectedResult = Object.keys(content);
                    expect(expectedResult.includes("item 4")).toEqual(false);
                    done();
                });
        });
        it("passing in a non existing item it returns message item not found", (done) => {
            removeItem("random", null, testFilePath).catch(err => {
                expect(err).toEqual("Item not found");
                done();
            });
        });
    })
    describe("remove all items in the store", () => {
        it("if purge is true it removes all items in json store", (done) => {
            removeItem(null, true, testFilePath).then(() => fs.readFile("./tests/test.json"))
                .then(body => JSON.parse(body))
                .then(content => {
                    expect(content).toEqual({})
                    done();
                });
        });
    });
});

describe("configureBagoo()", () => {
    describe("configure the location of the bagoo store", () => {
        it("when passing path it sets the bagoo store location to the path", (done) => {
            const homedir = os.homedir()
        
            fs.copyFile("bagoo.json", homedir.concat("/bagoo.json"))
                .then(() => {
                    return configureBagoo(homedir);
                })
                .then(result => {
                expect(result).toEqual(homedir.concat("/bagoo.json"));
                
                // remove file after test
                return fs.unlink(homedir.concat("/bagoo.json"))
            }).then(() => done());
        })
        it("if file does not exist return an error", (done) => {
            configureBagoo("/home").catch(err => {
                expect(err).toEqual("\nNo bagoo file found, copy your bagoo.json" + 
                    " file to the location first using the bagoo \"copy\" command\n")
                done();
            })
        })
        it("if path is empty return an error", () => {
            configureBagoo("").catch(err => {
                expect(err).toEqual("\nPlease enter a valid path\n")
            })
        })
    })
})
