const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "2024jp.json");

function readSentencesFromFile() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getSentence(year, month, day, userName) {
  const db = readSentencesFromFile();
  const modValue = (year + month + day) % 15;
  const keys = Object.keys(db);
  const selectedCategory = db[keys[modValue]];
  const contents = selectedCategory.contents;

  let fullMessage = "";
  for (const section in contents) {
    fullMessage += contents[section].replaceAll("[NAME]", userName) + "\n\n";
  }

  return fullMessage;
}

module.exports = getSentence;
