

const dataParser = require("datauri/parser.js");
const path = require("path");

function getDataUrl(file)
{
    let parser = new dataParser();
    let fileExtensionName = path.extname(file.originalname).toString();
    return parser.format(fileExtensionName,file.buffer).content;
}

module.exports= {getDataUrl}

