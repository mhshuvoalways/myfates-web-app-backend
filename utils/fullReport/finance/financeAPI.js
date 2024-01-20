const fs = require("fs");
const path = require("path");

const mainFunction = (language) => {
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

  function loadSentencesFromDb(filePath, section, score) {
    const key = `${section.toLowerCase()}${score}`;

    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

      if (!data.hasOwnProperty(key)) {
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
  //score2eval

  function scoreEval(score, section) {
    // Define mean and standard deviation for each section
    const sectionStats = {
      insight: { mean: 60.11, sd: 2 },
      decision: { mean: 59.99, sd: 1.88 },
      execution: { mean: 60, sd: 1.8 },
      consistency: { mean: 63.66, sd: 2.15 },
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

  const filePathDirectory = path.join(__dirname, "financeDB.json");
  const filePathDirectoryJapan = path.join(__dirname, "financeJapan.json");
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

  function generateInsightScores(startDate, i) {
    // Calculate current date and day of the week
    // Assuming startDate is a number representing the offset in days
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + i
      )
    );
    const dayOfWeek = currentDate.getUTCDay();

    // Define score ranges for each time of the day
    const scoreRanges = {
      0: [35, 45, 8], // 8 AM
      1: [55, 65, 11], // 11 AM
      2: [50, 60, 2], // 2 PM
      3: [45, 55, 17], // 5 PM
      4: [65, 75, 20], // 8 PM
      5: [75, 85, 23], // 11 PM
      6: [25, 35, 2], // 2 AM
    };

    // Adjust the score range based on the day of the week
    const dayModifiers = {
      0: -3, // Monday
      1: 2, // Tuesday
      2: 4, // Wednesday
      3: 3, // Thursday
      4: 1, // Friday
      5: -3, // Saturday
      6: -4, // Sunday
    };
    const dayModifier = dayModifiers[dayOfWeek];

    // Generate scores for each time of the day
    const scores = [];
    for (let i = 0; i < 7; i++) {
      const [minScore, maxScore, time] = scoreRanges[i];
      let adjustedMin = Math.max(51, Math.min(99, minScore + dayModifier)); // Ensure score is within 51-99
      let adjustedMax = Math.min(99, Math.max(51, maxScore + dayModifier)); // Ensure score is within 51-99

      // Ensure adjustedMin is not greater than adjustedMax
      adjustedMin = Math.min(adjustedMin, adjustedMax);

      scores.push({
        score: randomInt(adjustedMin, adjustedMax + 1),
        time,
      }); // randomInt is inclusive at min and exclusive at max
    }

    return scores;
  }

  function generateDecisionScores(startDate, i) {
    // Calculate current date and day of the week
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + i
      )
    );
    const dayOfWeek = currentDate.getUTCDay();

    // Define score ranges for each time of the day
    const scoreRanges = {
      0: [45, 55, 8], // 8 AM
      1: [75, 85, 11], // 11 AM
      2: [55, 65, 2], // 2 PM
      3: [65, 75, 17], // 5 PM
      4: [50, 60, 20], // 8 PM
      5: [35, 45, 23], // 11 PM
      6: [20, 30, 2], // 2 AM
    };

    // Adjust the score range based on the day of the week
    const dayModifiers = {
      0: 0, // Monday
      1: 2, // Tuesday
      2: 3, // Wednesday
      3: 2, // Thursday
      4: 0, // Friday
      5: -4, // Saturday
      6: -5, // Sunday
    };
    const dayModifier = dayModifiers[dayOfWeek];

    // Generate scores for each time of the day
    const scores = [];
    for (let i = 0; i < 7; i++) {
      const [minScore, maxScore, time] = scoreRanges[i];
      let adjustedMin = Math.max(51, Math.min(99, minScore + dayModifier)); // Ensure score is within 51-99
      let adjustedMax = Math.min(99, Math.max(51, maxScore + dayModifier)); // Ensure score is within 51-99

      // Ensure adjustedMin is not greater than adjustedMax
      adjustedMin = Math.min(adjustedMin, adjustedMax);

      scores.push({
        score: randomInt(adjustedMin, adjustedMax + 1),
        time,
      }); // randomInt is inclusive at min and exclusive at max
    }

    return scores;
  }

  function generateExecutionScores(startDate, i) {
    // Calculate current date and day of the week
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + i
      )
    );
    const dayOfWeek = currentDate.getUTCDay();

    // Define score ranges for each time of the day
    const scoreRanges = {
      0: [55, 65, 8], // 8 AM
      1: [80, 90, 11], // 11 AM
      2: [60, 70, 14], // 2 PM
      3: [50, 60, 17], // 5 PM
      4: [35, 45, 20], // 8 PM
      5: [25, 35, 23], // 11 PM
      6: [15, 25, 2], // 2 AM
    };

    // Adjust the score range based on the day of the week
    const dayModifiers = {
      0: -2, // Monday
      1: 3, // Tuesday
      2: 4, // Wednesday
      3: 3, // Thursday
      4: 1, // Friday
      5: -3, // Saturday
      6: -4, // Sunday
    };
    const dayModifier = dayModifiers[dayOfWeek];

    // Generate scores for each time of the day
    const scores = [];
    for (let i = 0; i < 7; i++) {
      const [minScore, maxScore, time] = scoreRanges[i];
      let adjustedMin = Math.max(51, Math.min(99, minScore + dayModifier)); // Ensure score is within 51-99
      let adjustedMax = Math.min(99, Math.max(51, maxScore + dayModifier)); // Ensure score is within 51-99

      // Ensure adjustedMin is not greater than adjustedMax
      adjustedMin = Math.min(adjustedMin, adjustedMax);

      scores.push({
        score: randomInt(adjustedMin, adjustedMax + 1),
        time,
      }); // randomInt is inclusive at min and exclusive at max
    }

    return scores;
  }

  function generateConsistencyScores(startDate, i) {
    // Calculate current date and day of the week
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + i
      )
    );
    const dayOfWeek = currentDate.getUTCDay();

    // Define score ranges for each time of the day
    const scoreRanges = {
      0: [65, 75, 8], // 8 AM
      1: [75, 85, 11], // 11 AM
      2: [70, 80, 2], // 2 PM
      3: [60, 70, 17], // 5 PM
      4: [45, 55, 20], // 8 PM
      5: [35, 45, 23], // 11 PM
      6: [25, 35, 2], // 2 AM
    };

    // Adjust the score range based on the day of the week
    const dayModifiers = {
      0: -2, // Monday
      1: 3, // Tuesday
      2: 4, // Wednesday
      3: 3, // Thursday
      4: 0, // Friday
      5: -4, // Saturday
      6: -3, // Sunday
    };
    const dayModifier = dayModifiers[dayOfWeek];

    // Generate scores for each time of the day
    const scores = [];
    for (let i = 0; i < 7; i++) {
      const [minScore, maxScore, time] = scoreRanges[i];
      let adjustedMin = Math.max(51, Math.min(99, minScore + dayModifier)); // Ensure score is within 51-99
      let adjustedMax = Math.min(99, Math.max(51, maxScore + dayModifier)); // Ensure score is within 51-99

      // Ensure adjustedMin is not greater than adjustedMax
      adjustedMin = Math.min(adjustedMin, adjustedMax);

      scores.push({
        score: randomInt(adjustedMin, adjustedMax + 1),
        time,
      }); // randomInt is inclusive at min and exclusive at max
    }

    return scores;
  }

  function generateFinanceReportForWeek(
    startDate,
    generateInsightScores,
    generateDecisionScores,
    generateExecutionScores,
    generateConsistencyScores,
    generateContent
  ) {
    const financeReportData = {
      financeReportWritings: [
        "sentence about the overall finance trends of the week",
        "sentence2 about significant finance observations",
      ],
      financeReport: {
        Insight: { dailyData: [] },
        Decision: { dailyData: [] },
        Execution: { dailyData: [] },
        Consistency: { dailyData: [] },
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

      // Insight
      dayData["scores"] = generateInsightScores(startDate, i);
      dayData["averageScore"] = calculateAverage(dayData["scores"]);
      dayData["dailyContent"] = generateContent(
        dayData["averageScore"],
        "insight"
      );
      dayData["dailyAnnualdiff"] = [roundTo(randomFloat(-0.15, 0.29), 3)];
      dayData["scoreEval"] = scoreEval(dayData["averageScore"], "insight");
      financeReportData["financeReport"]["Insight"]["dailyData"].push({
        ...dayData,
      });

      dayData["scores"] = generateDecisionScores(startDate, i);
      dayData["averageScore"] = calculateAverage(dayData["scores"]);
      dayData["dailyContent"] = generateContent(
        dayData["averageScore"],
        "decision"
      );
      dayData["dailyAnnualdiff"] = [roundTo(randomFloat(-0.15, 0.29), 3)];
      dayData["scoreEval"] = scoreEval(dayData["averageScore"], "decision");
      financeReportData["financeReport"]["Decision"]["dailyData"].push({
        ...dayData,
      });

      // Execution Section
      dayData["scores"] = generateExecutionScores(startDate, i);
      dayData["averageScore"] = calculateAverage(dayData["scores"]);
      dayData["dailyContent"] = generateContent(
        dayData["averageScore"],
        "execution"
      );
      dayData["dailyAnnualdiff"] = [roundTo(randomFloat(-0.15, 0.29), 3)];
      dayData["scoreEval"] = scoreEval(dayData["averageScore"], "execution");
      financeReportData["financeReport"]["Execution"]["dailyData"].push({
        ...dayData,
      });

      // Consistency Section
      dayData["scores"] = generateConsistencyScores(startDate, i);
      dayData["averageScore"] = calculateAverage(dayData["scores"]);
      dayData["dailyContent"] = generateContent(
        dayData["averageScore"],
        "consistency"
      );
      dayData["dailyAnnualdiff"] = [roundTo(randomFloat(-0.15, 0.29), 3)];
      dayData["scoreEval"] = scoreEval(dayData["averageScore"], "consistency");
      financeReportData["financeReport"]["Consistency"]["dailyData"].push({
        ...dayData,
      });
    }

    return financeReportData;
  }

  // Automatically set start_date to the current date
  const startDate = new Date();

  // Generate the weekly report data
  const financeReportWeekData = generateFinanceReportForWeek(
    startDate,
    generateInsightScores,
    generateDecisionScores,
    generateExecutionScores,
    generateConsistencyScores,
    generateContent
  );

  return JSON.stringify(financeReportWeekData, null, 4);
};

module.exports = mainFunction;
