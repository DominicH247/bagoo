const appRoot = require("app-root-path");
const fs = require("fs").promises;

const config = "./config.json";

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
