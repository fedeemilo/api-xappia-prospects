const path = require("path");
const multer = require("multer");
const { simpleDate } = require("../utils/dates");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname.split(" ").join("-").toLowerCase();

        cb(null, simpleDate + "-" + fileName);
    }
});

// Multer Upload Storage
const upload = multer({ storage });

module.exports = upload;
