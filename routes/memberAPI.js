var express = require("express");
var router = express.Router();
//const { checkToken } = require("../middleware/checkToken");
const MemberControllerAPI = require("../controller/memberControllerAPI");
const UserRepository = require("../repository/user");
const userRepository = new UserRepository();
const memberControllerAPI = new MemberControllerAPI(userRepository);

router.post("/checkAccount", memberControllerAPI.checkAccount);
router.post("/getAcount", memberControllerAPI.getAccount);
router.post("/createNewUser", memberControllerAPI.createNewUser);

module.exports = router;
