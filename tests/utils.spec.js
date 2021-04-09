const fs = require("fs").promises;
const appRoot = require("app-root-path");
const { setBagooPath, getBagooPath } = require("../utils/index");

const reset = () => fs.writeFile("./tests/testConfig.json", JSON.stringify({
    bago_path: ""
}, null, 2));

afterEach(() => reset());

describe("setBagooPath()", () => {
    it("when passing valid path it sets it in the config file", (done) => {
        setBagooPath("test/test")
            .then(() => {
                return getBagooPath();
            })
            .then(result => {
                expect(result).toEqual("test/test");
                done();
            })
    })
    it("when passing empty path it defaults to base project path", (done) => {
        setBagooPath()
            .then(() => {
                return getBagooPath();
            })
            .then(result => {
                expect(result).toEqual(appRoot.path);
                done();
            })
    })
});
