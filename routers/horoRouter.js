const router = require("express").Router();
const { addHoro, getHoro } = require("../controllers/horoScopeController");
const authenticate = require("../middlewares/authenticate");

router.post("/horoadd", authenticate, addHoro);
router.get("/horoget", authenticate, getHoro);

module.exports = router;
