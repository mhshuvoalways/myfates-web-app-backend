const fs = require("fs");
const path = require("path");

const filePaths = [
  path.join(__dirname, "full/advice.json"),
  path.join(__dirname, "full/lifeCycle.json"),
  path.join(__dirname, "full/nature.json"),
  path.join(__dirname, "full/overview.json"),
  path.join(__dirname, "full/relationship.json"),
  path.join(__dirname, "full/swot.json"),

  path.join(__dirname, "love/idealPartner.json"),
  path.join(__dirname, "love/kids.json"),
  path.join(__dirname, "love/lifeCycle.json"),
  path.join(__dirname, "love/marriage.json"),
  path.join(__dirname, "love/needs.json"),
  path.join(__dirname, "love/overview.json"),

  path.join(__dirname, "money/outlook.json"),
  path.join(__dirname, "money/outlook2.json"),
  path.join(__dirname, "money/overview.json"),
  path.join(__dirname, "money/risk.json"),

  path.join(__dirname, "work-academic/idealCareer.json"),
  path.join(__dirname, "work-academic/learning.json"),
  path.join(__dirname, "work-academic/overview.json"),
];

const filePathsJapan = [
  path.join(__dirname, "japan/full/advice.json"),
  path.join(__dirname, "japan/full/lifeCycle.json"),
  path.join(__dirname, "japan/full/nature.json"),
  path.join(__dirname, "japan/full/overview.json"),
  path.join(__dirname, "japan/full/relationship.json"),
  path.join(__dirname, "japan/full/swot.json"),

  path.join(__dirname, "japan/love/idealPartner.json"),
  path.join(__dirname, "japan/love/kids.json"),
  path.join(__dirname, "japan/love/lifeCycle.json"),
  path.join(__dirname, "japan/love/marriage.json"),
  path.join(__dirname, "japan/love/needs.json"),
  path.join(__dirname, "japan/love/overview.json"),

  path.join(__dirname, "japan/money/longterm.json"),
  path.join(__dirname, "japan/money/risk.json"),
  path.join(__dirname, "japan/money/shortterm.json"),
  path.join(__dirname, "japan/money/manage.json"),

  path.join(__dirname, "japan/work-academic/idealCareer.json"),
  path.join(__dirname, "japan/work-academic/learning.json"),
  path.join(__dirname, "japan/work-academic/overview.json"),
];

function replacePlaceholders(text, userName, userGender) {
  // Define pronouns based on gender
  const pronouns = {
    male: { their: "his", them: "him", they: "he", themselves: "himself" },
    female: { their: "her", them: "her", they: "she", themselves: "herself" },
    nonbinary: {
      their: "their",
      them: "them",
      they: "they",
      themselves: "themselves",
    },
  };

  // Select the right set of pronouns
  const chosenPronouns = pronouns[userGender.toLowerCase()];

  // Function to capitalize the first letter
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Replace [NAME] with the user's name (capitalized)
  text = text.replace(/\[NAME\]/g, capitalize(userName));

  // Replace pronouns, ensuring the correct capitalization
  text = text.replace(/\[THEIR\]/g, (match, offset) =>
    offset === 0 || text[offset - 2] === "."
      ? capitalize(chosenPronouns.their)
      : chosenPronouns.their
  );
  text = text.replace(/\[THEM\]/g, (match, offset) =>
    offset === 0 || text[offset - 2] === "."
      ? capitalize(chosenPronouns.them)
      : chosenPronouns.them
  );
  text = text.replace(/\[THEY\]/g, (match, offset) =>
    offset === 0 || text[offset - 2] === "."
      ? capitalize(chosenPronouns.they)
      : chosenPronouns.they
  );
  text = text.replace(/\[THEMSELVES\]/g, (match, offset) =>
    offset === 0 || text[offset - 2] === "."
      ? capitalize(chosenPronouns.themselves)
      : chosenPronouns.themselves
  );
  return text;
}

function processMultipleFiles(personalityType, userName, userGender, language) {
  const selectLanguage = language === "jp" ? filePathsJapan : filePaths;
  return Promise.all(
    selectLanguage.map((filePath) =>
      loadJsonFromFile(filePath)
        .then((jsonData) =>
          extractContentAndTitle(
            jsonData,
            personalityType,
            userName,
            userGender
          )
        )
        .catch((error) => {
          console.error("Error processing file:", filePath, error);
          return { title: "", content: "Error in file processing" };
        })
    )
  ).then((results) => {
    return language === "jp"
      ? {
          date: new Date().toISOString(),
          title: results[0].title, // Assuming the title from the first file is what you need
          fullAdvice: results[0].content,
          fullLifeCycle: results[1].content,
          fullNature: results[2].content,
          fullOverview: results[3].content,
          fullRelationship: results[4].content,
          fullSwot: results[5].content,

          loveIdealPartner: results[6].content,
          loveKids: results[7].content,
          loveLifeCycle: results[8].content,
          loveMarriage: results[9].content,
          loveNeeds: results[10].content,
          loveOverview: results[11].content,

          financeLongTerm: results[12].content,
          financeRisk: results[13].content,
          financeShortTerm: results[14].content,
          financeManage: results[15].content,

          academicIdealCareer: results[16].content,
          academicLearning: results[17].content,
          academicOverview: results[18].content,
          // Add more fields as needed
        }
      : {
          date: new Date().toISOString(),
          title: results[0].title, // Assuming the title from the first file is what you need
          fullAdvice: results[0].content,
          fullLifeCycle: results[1].content,
          fullNature: results[2].content,
          fullOverview: results[3].content,
          fullRelationship: results[4].content,
          fullSwot: results[5].content,

          loveIdealPartner: results[6].content,
          loveKids: results[7].content,
          loveLifeCycle: results[8].content,
          loveMarriage: results[9].content,
          loveNeeds: results[10].content,
          loveOverview: results[11].content,

          financeOutlook: results[12].content,
          financeOutlook2: results[13].content,
          financeOverview: results[14].content,
          financeRisk: results[15].content,

          academicIdealCareer: results[16].content,
          academicLearning: results[17].content,
          academicOverview: results[18].content,
          // Add more fields as needed
        };
  });
}

function loadJsonFromFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
}

function extractContentAndTitle(data, personalityType, userName, userGender) {
  let contentData, title;
  let isPersonalityTypeDB = false;

  // List of expected personality types
  const expectedPersonalityTypes = [
    "PGBR",
    "PGBX",
    "PGER",
    "PGEX",
    "POBR",
    "POBX",
    "POER",
    "POEX",
    "KGBR",
    "KGBX",
    "KGER",
    "KGEX",
    "KOBR",
    "KOBX",
    "KOER",
    "KOEX",
  ];

  // Check if the data structure includes personality types
  if (personalityType) {
    isPersonalityTypeDB =
      expectedPersonalityTypes.includes(personalityType) &&
      data.hasOwnProperty(personalityType);
  }

  if (isPersonalityTypeDB) {
    const categories = Object.keys(data[personalityType]);
    if (categories.length === 0) {
      return { title: "", content: "No categories available." };
    }

    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    contentData = data[personalityType][randomCategory].content;
    title = data[personalityType][randomCategory].title || "";
  } else {
    const categories = Object.keys(data);
    if (categories.length === 0) {
      return { title: "", content: "No categories available." };
    }

    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    contentData = data[randomCategory].content;
    title = data[randomCategory].title || "";
  }

  let allSentences = [];
  for (let key in contentData) {
    if (contentData.hasOwnProperty(key)) {
      let contentItem = contentData[key];
      if (typeof contentItem === "string") {
        contentItem = replacePlaceholders(contentItem, userName, userGender);
        allSentences.push(contentItem);
      } else if (Array.isArray(contentItem)) {
        contentItem.forEach((item) => {
          if (item && item.text) {
            item.text = replacePlaceholders(item.text, userName, userGender);
            allSentences.push(item.text);
          }
        });
      } else if (
        contentItem &&
        typeof contentItem === "object" &&
        contentItem.text
      ) {
        contentItem.text = replacePlaceholders(
          contentItem.text,
          userName,
          userGender
        );
        allSentences.push(contentItem.text);
      }
    }
  }

  return { title, content: allSentences.join(" ") };
}

module.exports = processMultipleFiles;
