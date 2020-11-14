const express = require("express");
const router = express.Router();
const ControllerContasReceber = require('../controllers/ControllerContasReceber')
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/index', Admin, ControllerContasReceber.index);

router.post('/create', Admin, ControllerContasReceber.create);

router.post('/destroy', Admin, ControllerContasReceber.destroy);

router.get("/edit/:id", Admin, ControllerContasReceber.edit);

router.post("/update", Admin, ControllerContasReceber.update);

/*----------------------------------------------------------------------------*/
module.exports = router;
