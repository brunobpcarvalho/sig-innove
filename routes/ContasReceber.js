const express = require("express");
const router = express.Router();
const ControllerContasReceber = require('../controllers/ControllerContasReceber')
const {Admin} = require("../helpers/Admin")
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/index', User, ControllerContasReceber.index);

router.post('/store', Admin, ControllerContasReceber.store);

router.post('/destroy', Admin, ControllerContasReceber.destroy);

router.post("/update", Admin, ControllerContasReceber.update);

/*----------------------------------------------------------------------------*/
module.exports = router;
