const express = require("express");
const router = express.Router();
const ControllerContasPagar = require('../controllers/ControllerContasPagar')
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/index', Admin, ControllerContasPagar.index);

router.post('/store', Admin, ControllerContasPagar.store);

router.post('/destroy', Admin, ControllerContasPagar.destroy);

router.post("/update", Admin, ControllerContasPagar.update);

/*----------------------------------------------------------------------------*/
module.exports = router;
