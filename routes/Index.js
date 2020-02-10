const express = require("express")
const router = express.Router()
var ControllerIndex = require('../controllers/ControllerIndex')
const {User} = require("../helpers/User")

router.get('/index', User, ControllerIndex.listAll)

/*----------------------------------------------------------------------------*/
module.exports = router;