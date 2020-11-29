const express = require("express");
const router = express.Router();
const ControllerContasPagar = require('../controllers/ControllerContasPagar')
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/index', User, ControllerContasPagar.index);

router.post('/create', User, ControllerContasPagar.create);

router.post('/destroy', User, ControllerContasPagar.destroy);

router.get("/edit/:id", User, ControllerContasPagar.edit);

router.post("/update", User, ControllerContasPagar.update);

/*----------------------------------------------------------------------------*/
module.exports = router;
