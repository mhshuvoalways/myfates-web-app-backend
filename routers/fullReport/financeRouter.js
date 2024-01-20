const router = require("express").Router();
const { addReport, getReports } = require("../../controllers/fullReport/financeController");
const authenticate = require("../../middlewares/authenticate");

router.post("/addfinance", authenticate, addReport);
router.get("/getfinances", authenticate, getReports);

module.exports = router;
