const Report = require("../../Model/DReport");
const DReport = require("../../utils/fullReport/dReport/dReport");
const sentenceFinal = require("../../utils/fullReport/sayings/sentenceFinal");

const addReport = (req, res) => {
  const { _id } = req.user;
  const { language } = req.body;
  const { dReport } = JSON.parse(DReport(language));
  const newObj = {
    dReportWritings: sentenceFinal("daily", language),
    dReport,
    userId: _id,
  };
  new Report(newObj)
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
  Report.find({ userId: _id })
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
