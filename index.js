const {promisify} = require('util');
const main = require("./main");


exports.handler = async (event, context={}, callback) => {
    const mainPromise = promisify(main);
    const result = await mainPromise();
    console.log("RES :", result );
    return result;
};
