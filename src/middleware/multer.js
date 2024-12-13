
const multer = require("multer");

// let storage = multer.diskStorage({
//     destination: function (req, file, cb){
//         cb(null, "../tinder-backend/src/uploads")
//     },
//     filename: function (req, file, cb) {
//        return cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

const storage = multer.memoryStorage();
const uploadFile = multer({ storage });

module.exports = {uploadFile};
