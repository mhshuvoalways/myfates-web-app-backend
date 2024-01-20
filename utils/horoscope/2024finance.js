const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "2024_finance.json"); // Update with your file path

function readSentencesFromFile() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getSentence(year, month, day) {
  const sentences = readSentencesFromFile();
  const modValue = (year + month + day) % 15;
  const keys = Object.keys(sentences);
  return sentences[keys[modValue]];
}

module.exports = getSentence;
