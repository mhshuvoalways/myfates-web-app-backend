const Love = require("../../Model/Love");
const LoveReport = require("../../utils/fullReport/love/loveReport");
const sentenceFinal = require("../../utils/fullReport/sayings/sentenceFinal");

const addReport = (req, res) => {
  const { _id } = req.user;
  const { language } = req.body;
  const { loveReport } = JSON.parse(LoveReport(language));
  const newObj = {
    loveReportWritings: sentenceFinal("love", language),
    loveReport,
    userId: _id,
  };
  new Love(newObj)
    .save()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => {
      serverError(res);
    });
};

const getReports = (req, res) => {
  const { _id } = req.user;
  Love.find({ userId: _id })
    .then((response) => {
      res.status(200).json(response[response.length - 1]);
    })
    .catch(() => {
      serverError(res);
    });
};

module.exports = {
  addReport,
  getReports,
};
