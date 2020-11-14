const express = require("express");
const router = express.Router();
const ControllerContasPagar = require('../controllers/ControllerContasPagar')
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/index', Admin, ControllerContasPagar.index);

router.post('/create', Admin, ControllerContasPagar.create);

router.post('/destroy', Admin, ControllerContasPagar.destroy);

router.get("/edit/:id", Admin, ControllerContasPagar.edit);

router.post("/update", Admin, ControllerContasPagar.update);

/*----------------------------------------------------------------------------*/
module.exports = router;
