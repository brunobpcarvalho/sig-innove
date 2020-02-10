const express = require("express");
const router = express.Router();
const ControllerContasPagar = require('../controllers/ControllerContasPagar')
const {Admin} = require("../helpers/Admin")
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/index', User, ControllerContasPagar.index);

router.post('/store', Admin, ControllerContasPagar.store);

router.post('/destroy', Admin, ControllerContasPagar.destroy);

router.post("/update", Admin, ControllerContasPagar.update);

/*----------------------------------------------------------------------------*/
module.exports = router;
