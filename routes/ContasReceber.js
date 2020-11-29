const express = require("express");
const router = express.Router();
const ControllerContasReceber = require('../controllers/ControllerContasReceber')
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/index', User, ControllerContasReceber.index);

router.post('/create', User, ControllerContasReceber.create);

router.post('/destroy', User, ControllerContasReceber.destroy);

router.get("/edit/:id", User, ControllerContasReceber.edit);

router.post("/update", User, ControllerContasReceber.update);

/*----------------------------------------------------------------------------*/
module.exports = router;
