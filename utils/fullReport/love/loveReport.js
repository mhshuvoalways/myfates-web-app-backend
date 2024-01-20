// Import the required modules
const fs = require("fs");
const path = require("path");

const mainFunc = (language) => {
  // Function to get the name of the weekday
  function getWeekdayName(weekdayNumber) {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekdays[weekdayNumber];
  }
  function roundTo(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function calculateAverage(scores) {
    if (scores.length === 0) {
      console.error("Empty scores array");
      return 0; // or handle this scenario appropriately
    }

    // Sum up the 'score' property of each object in the array
    const sum = scores.reduce((a, b) => a + b.score, 0);
    const average = sum / scores.length;

    // Limit the average to two decimal places
    return average.toFixed(2);
  }

  // Function to generate daily content based on score
  function loadSentencesFromDb(filePath, section, score) {
    const key = `${section.toLowerCase()}${score}`;

    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

      if (!(key in data)) {
        return `No data available for key: ${key}`;
      }

      const sentences = data[key];

      if (!sentences || sentences.length === 0) {
        return "No sentence available for this score.";
      }

      // Randomly select a sentence from the array
      return sentences[Math.floor(Math.random() * sentences.length)];
    } catch (error) {
      if (error.code === "ENOENT") {
        return "File not found. Please check the file path.";
      } else if (error instanceof SyntaxError) {
        return "Invalid JSON format in the file.";
      } else {
        throw error;
      }
    }
  }

  module.exports = { getWeekdayName, loadSentencesFromDb };

  function scoreEval(score, section) {
    // Define mean and standard deviation for each section
    const sectionStats = {
      romance: { mean: 69.47, sd: 3.78 },
      intimacy: { mean: 64.64, sd: 4.19 },
      connection: { mean: 62.38, sd: 4.98 },
      destiny: { mean: 70.93, sd: 4.97 },
    };

    // Get mean and sd for the given section
    const mean = sectionStats[section]["mean"];
    const sd = sectionStats[section]["sd"];

    // Define score thresholds
    const veryLowThreshold = mean - 1.5 * sd;
    const lowThreshold = mean - 0.5 * sd;
    const highThreshold = mean + 0.5 * sd;
    const veryHighThreshold = mean + 1.5 * sd;

    // Determine score range
    let scoreRange;
    if (score < veryLowThreshold) {
      scoreRange = "Challenging"; // Very Low
    } else if (score < lowThreshold) {
      scoreRange = "Fair"; // Low
    } else if (score < highThreshold) {
      scoreRange = "Pleasant"; // Medium
    } else if (score < veryHighThreshold) {
      scoreRange = "Great"; // High
    } else {
      scoreRange = "Perfect"; // Very High
    }
    return scoreRange;
  }

  const filePathDirectory = path.join(__dirname, "loveDB.json");
  const filePathDirectoryJapan = path.join(__dirname, "loveJapan.json");
  const finalPath =
    language === "jp" ? filePathDirectoryJapan : filePathDirectory;
  function generateContent(score, section, filePath = finalPath) {
    // Determine score range
    if (scoreEval(score, section) == "Challenging") {
      scoreRange = "50"; // Very Low
    } else if (scoreEval(score, section) == "Fair") {
      scoreRange = "60"; // Low
    } else if (scoreEval(score, section) == "Pleasant") {
      scoreRange = "70"; // Medium
    } else if (scoreEval(score, section) == "Great") {
      scoreRange = "80"; // High
    } else {
      scoreRange = "90"; // Very High
    }

    // Get a sentence from the database
    return loadSentencesFromDb(filePath, section, scoreRange);
  }

  module.exports = { generateContent };

  const { randomInt } = require("crypto"); // For secure random number generation

  function generateRomanceScores(startDate, i) {
    // Calculate current date and day of the week
    // Assuming startDate is a Date object
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + i
      )
    );
    const dayOfWeek = currentDate.getUTCDay();

    // Define the score ranges for each time of the day for Romance
    const scoreRanges = {
      0: [51, 60, 8], // 8 AM
      1: [51, 60, 11], // 11 AM
      2: [60, 70, 14], // 2 PM
      3: [70, 80, 17], // 5 PM
      4: [80, 90, 20], // 8 PM
      5: [70, 85, 23], // 11 PM
      6: [60, 75, 2], // 2 AM
    };

    // Adjust the score range based on the day of the week for Romance
    const dayModifiers = {
      0: -4, // Monday
      1: -3, // Tuesday
      2: -3, // Wednesday
      3: 0, // Thursday
      4: 4, // Friday
      5: 6, // Saturday
      6: 4, // Sunday
    };
    const dayModifier = dayModifiers[dayOfWeek];

    // Generate scores for each time of the day
    const scores = [];
    for (let timeSlot = 0; timeSlot < 7; timeSlot++) {
      const [minScore, maxScore, time] = scoreRanges[timeSlot];
      let adjustedMin = Math.max(51, minScore + dayModifier); // Ensure score is within 51-99
      let adjustedMax = Math.min(99, maxScore + dayModifier); // Ensure score is within 51-99

      // Ensure adjustedMin is not greater than adjustedMax
      adjustedMin = Math.min(adjustedMin, adjustedMax);

      scores.push({
        score: randomInt(adjustedMin, adjustedMax + 1),
        time,
      }); // randomInt is inclusive at min and exclusive at max
    }

    return scores;
  }

  function generateIntimacyScores(startDate, i) {
    // Calculate current date and day of the week
    // Assuming startDate is a Date object
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + i
      )
    );
    const dayOfWeek = currentDate.getUTCDay();

    // Define the score ranges for each time of the day for Intimacy
    const scoreRanges = {
      0: [51, 55, 8], // 8 AM
      1: [51, 55, 11], // 11 AM
      2: [55, 65, 14], // 2 PM
      3: [60, 70, 17], // 5 PM
      4: [70, 85, 20], // 8 PM
      5: [65, 80, 23], // 11 PM
      6: [60, 70, 2], // 2 AM
    };

    // Adjust the score range based on the day of the week for Intimacy
    const dayModifiers = {
      0: -5, // Monday
      1: -3, // Tuesday
      2: -3, // Wednesday
      3: 0, // Thursday
      4: 5, // Friday
      5: 6, // Saturday
      6: 5, // Sunday
    };
    const dayModifier = dayModifiers[dayOfWeek];

    // Generate scores for each time of the day
    const scores = [];
    for (let timeSlot = 0; timeSlot < 7; timeSlot++) {
      const [minScore, maxScore, time] = scoreRanges[timeSlot];
      let adjustedMin = Math.max(51, minScore + dayModifier); // Ensure score is within 51-99
      let adjustedMax = Math.min(99, maxScore + dayModifier); // Ensure score is within 51-99

      // Ensure adjustedMin is not greater than adjustedMax
      adjustedMin = Math.min(adjustedMin, adjustedMax);
      scores.push({
        score: randomInt(adjustedMin, adjustedMax + 1),
        time,
      }); // randomInt is inclusive at min and exclusive at max
    }

    return scores;
  }
  function generateConnectionScores(startDate, i) {
    // Calculate current date and day of the week
    // Assuming startDate is a Date object
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + i
      )
    );
    const dayOfWeek = currentDate.getUTCDay();

    // Define the score ranges for each time of the day for Connection
    const scoreRanges = {
      0: [51, 55, 8], // 8 AM
      1: [51, 55, 11], // 11 AM
      2: [55, 65, 14], // 2 PM
      3: [60, 70, 17], // 5 PM
      4: [65, 75, 20], // 8 PM
      5: [60, 70, 23], // 11 PM
      6: [55, 65, 2], // 2 AM
    };

    // Adjust the score range based on the day of the week for Connection
    const dayModifiers = {
      0: -5, // Monday
      1: -3, // Tuesday
      2: -3, // Wednesday
      3: 0, // Thursday
      4: 5, // Friday
      5: 10, // Saturday
      6: 5, // Sunday
    };
    const dayModifier = dayModifiers[dayOfWeek];

    // Generate scores for each time of the day
    const scores = [];
    for (let timeSlot = 0; timeSlot < 7; timeSlot++) {
      const [minScore, maxScore, time] = scoreRanges[timeSlot];
      let adjustedMin = Math.max(51, minScore + dayModifier); // Ensure score is within 51-99
      let adjustedMax = Math.min(99, maxScore + dayModifier); // Ensure score is within 51-99

      // Ensure adjustedMin is not greater than adjustedMax
      adjustedMin = Math.min(adjustedMin, adjustedMax);

      scores.push({
        score: randomInt(adjustedMin, adjustedMax + 1),
        time,
      }); // randomInt is inclusive at min and exclusive at max
    }

    return scores;
  }

  function generateDestinyScores(startDate, i) {
    // Calculate current date and day of the week
    // Assuming startDate is a Date object
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + i
      )
    );
    const dayOfWeek = currentDate.getUTCDay();

    // Define the score ranges for each time of the day for Destiny
    const scoreRanges = {
      0: [51, 60, 8], // 8 AM
      1: [51, 60, 11], // 11 AM
      2: [60, 70, 14], // 2 PM
      3: [70, 80, 17], // 5 PM
      4: [80, 90, 20], // 8 PM
      5: [75, 85, 23], // 11 PM
      6: [65, 75, 2], // 2 AM
    };

    // Adjust the score range based on the day of the week for Destiny
    const dayModifiers = {
      0: -5, // Monday
      1: -3, // Tuesday
      2: -3, // Wednesday
      3: 0, // Thursday
      4: 5, // Friday
      5: 10, // Saturday
      6: 5, // Sunday
    };
    const dayModifier = dayModifiers[dayOfWeek];

    // Generate scores for each time of the day
    const scores = [];
    for (let timeSlot = 0; timeSlot < 7; timeSlot++) {
      const [minScore, maxScore, time] = scoreRanges[timeSlot];
      let adjustedMin = Math.max(51, minScore + dayModifier); // Ensure score is within 51-99
      let adjustedMax = Math.min(99, maxScore + dayModifier); // Ensure score is within 51-99

      // Ensure adjustedMin is not greater than adjustedMax
      adjustedMin = Math.min(adjustedMin, adjustedMax);

      scores.push({
        score: randomInt(adjustedMin, adjustedMax + 1),
        time,
      }); // randomInt is inclusive at min and exclusive at max
    }

    return scores;
  }

  function generateLoveReportForWeek(
    startDate,
    generateRomanceScores,
    generateIntimacyScores,
    generateConnectionScores,
    generateDestinyScores,
    generateContent
  ) {
    const loveReportData = {
      loveReportWritings: [
        "sentence about the overall destiny trends of the week",
        "sentence2 about significant destiny observations",
      ],
      loveReport: {
        Romance: { dailyData: [] },
        Intimacy: { dailyData: [] },
        Connection: { dailyData: [] },
        Destiny: { dailyData: [] },
      },
    };

    for (let i = 0; i < process.env.EXPIRE_DATE; i++) {
      // Each day's data
      const current_date = new Date(startDate.getTime());
      current_date.setUTCDate(startDate.getUTCDate() + i);
      const dayOfWeek = current_date.getUTCDay();

      const dayData = {
        date: current_date.toISOString(),
        weekday: getWeekdayName(dayOfWeek),
        scores: [],
        averageScore: 0,
        dailyAnnualdiff: [],
        dailyContent: "",
        scoreEval: "",
      };

      // Romance
      dayData["scores"] = generateRomanceScores(startDate, i);
      dayData["averageScore"] = calculateAverage(dayData["scores"]);
      dayData["dailyContent"] = generateContent(
        dayData["averageScore"],
        "romance"
      );
      dayData["dailyAnnualdiff"] = [roundTo(randomFloat(-0.15, 0.29), 3)];
      dayData["scoreEval"] = scoreEval(dayData["averageScore"], "romance");
      loveReportData["loveReport"]["Romance"]["dailyData"].push({ ...dayData });

      // Intimacy
      dayData["scores"] = generateIntimacyScores(startDate, i);
      dayData["averageScore"] = calculateAverage(dayData["scores"]);
      dayData["dailyContent"] = generateContent(
        dayData["averageScore"],
        "intimacy"
      );
      dayData["dailyAnnualdiff"] = [roundTo(randomFloat(-0.15, 0.29), 3)];
      dayData["scoreEval"] = scoreEval(dayData["averageScore"], "intimacy");
      loveReportData["loveReport"]["Intimacy"]["dailyData"].push({
        ...dayData,
      });

      // Connection
      dayData["scores"] = generateConnectionScores(startDate, i);
      dayData["averageScore"] = calculateAverage(dayData["scores"]);
      dayData["dailyContent"] = generateContent(
        dayData["averageScore"],
        "connection"
      );
      dayData["dailyAnnualdiff"] = [roundTo(randomFloat(-0.15, 0.29), 3)];
      dayData["scoreEval"] = scoreEval(dayData["averageScore"], "connection");
      loveReportData["loveReport"]["Connection"]["dailyData"].push({
        ...dayData,
      });

      // Destiny
      dayData["scores"] = generateDestinyScores(startDate, i);
      dayData["averageScore"] = calculateAverage(dayData["scores"]);
      dayData["dailyContent"] = generateContent(
        dayData["averageScore"],
        "destiny"
      );
      dayData["dailyAnnualdiff"] = [roundTo(randomFloat(-0.15, 0.29), 3)];
      dayData["scoreEval"] = scoreEval(dayData["averageScore"], "destiny");
      loveReportData["loveReport"]["Destiny"]["dailyData"].push({ ...dayData });
    }

    return loveReportData;
  }

  // Automatically set start_date to the current date
  const startDate = new Date();

  // Generate the weekly report data
  const loveReportWeekData = generateLoveReportForWeek(
    startDate,
    generateRomanceScores,
    generateIntimacyScores,
    generateConnectionScores,
    generateDestinyScores,
    generateContent
  );
  // Convert the data to a JSON string with indentation
  return JSON.stringify(loveReportWeekData, null, 4);
};

module.exports = mainFunc;
