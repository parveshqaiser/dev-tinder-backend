

const cloudServer = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config();

cloudServer.v2.config({
    cloud_name :process.env.CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY,
});

module.exports = {cloudServer};

