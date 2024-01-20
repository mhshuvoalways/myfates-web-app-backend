const fs = require("fs");
const path = require("path");

// Function to read JSON file
function readJsonFile(filename) {
  const rawData = fs.readFileSync(filename);
  return JSON.parse(rawData);
}

// Function to get a random sentence from a category in the database
function getRandomSentenceFromCategory(db, category) {
  if (!db[category] || db[category].length === 0) return null;

  const randomIndex = Math.floor(Math.random() * db[category].length);
  return db[category][randomIndex];
}

function createSentenceListForDate(date, dbPath, reportName) {
  const db = readJsonFile(dbPath);
  const sentence = getRandomSentenceFromCategory(db, reportName);
  if (sentence) {
    let sentenceList = {
      date: date.toISOString().split("T")[0],
      sentence,
    };
    return sentenceList;
  }
}

function create28DaySentenceLists(reportName, language) {
  const startDate = new Date(); // Today's date
  const dbPath = path.join(__dirname, "sayings.json"); // Path to the updated JSON database
  const dbPathJapan = path.join(__dirname, "sayingsJapan.json");
  const finalPath = language === "jp" ? dbPathJapan : dbPath;
  let allSentenceLists = [];

  for (let day = 0; day < process.env.EXPIRE_DATE; day++) {
    // Corrected to 28 days
    const currentDate = new Date(startDate.getTime());
    currentDate.setDate(startDate.getDate() + day);
    const dailySentenceList = createSentenceListForDate(
      currentDate,
      finalPath,
      reportName
    );
    allSentenceLists.push(dailySentenceList);
  }
  return allSentenceLists;
}

module.exports = create28DaySentenceLists;
