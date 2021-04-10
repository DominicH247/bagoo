const appRoot = require("app-root-path");
const fs = require("fs").promises;

let config = appRoot.path.concat("/config.json");

if(process.env.NODE_ENV === "test"){
    config = appRoot.path.concat("/tests/testConfig.json");
}

/**
 * Gets the bagoo_path from config.json
 * @returns Promise
 */
const getBagooPath = () => {
    return fs.readFile(config)
        .then(body => JSON.parse(body))
        .then(content => {
            if(!content.bagoo_path){
                return setBagooPath().then(() => getBagooPath());
            } else {
                return content.bagoo_path;
            }
        });
};

/**
 * Sets the bagoo_path from config.json
 * @param {String} path 
 * @returns Promise
 */
const setBagooPath = (path = appRoot.path) => {
    return fs.readFile(config)
        .then(body => JSON.parse(body))
        .then(content => {
            const configCopy = {...content};
            configCopy.bagoo_path = path;

            return fs.writeFile(config, JSON.stringify({...configCopy}, null, 2));
        });
};

exports.getBagooPath = getBagooPath;
exports.setBagooPath = setBagooPath;
