const fs = require("fs");
const path = require("path");
const { fullDate2 } = require(".");

const writeTxtFile = (content, fileName) => {
  fs.writeFileSync(
    path.join(__dirname, "lead_ids", `/${fileName}`),
    content,
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("El archivo de leads ha sido guardado!");
    }
  );
  return fileName;
};

module.exports = writeTxtFile;
