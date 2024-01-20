const Finance = require("../../Model/Finance");
const FinanceReport = require("../../utils/fullReport/finance/financeAPI");
const sentenceFinal = require("../../utils/fullReport/sayings/sentenceFinal");

const addReport = (req, res) => {
  const { _id } = req.user;
  const { language } = req.body;
  const { financeReport } = JSON.parse(FinanceReport(language));
  const newObj = {
    financeReportWritings: sentenceFinal("finance", language),
    financeReport,
    userId: _id,
  };
  new Finance(newObj)
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
  Finance.find({ userId: _id })
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
