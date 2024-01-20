const router = require("express").Router();
const { getReports, addReports } = require("../controllers/reportsController");
const authenticate = require("../middlewares/authenticate");

router.get("/getreports", authenticate, getReports);
router.post("/addreports", authenticate, addReports);

module.exports = router;
