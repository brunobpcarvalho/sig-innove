const express = require("express");
const router = express.Router();
var ControllerUsuario = require('../controllers/ControllerUsuario')
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/index', Admin, ControllerUsuario.index);

router.post('/create', Admin, ControllerUsuario.create);

router.post('/destroy', Admin, ControllerUsuario.destroy);

router.get("/edit/:id", Admin, ControllerUsuario.edit);

router.post("/update", Admin, ControllerUsuario.update);

/*-----------------------  LOGIN --------------------------------------------*/

router.post("/login", ControllerUsuario.login);

router.get("/logout", ControllerUsuario.logout);

/*----------------------------------------------------------------------------*/
module.exports = router;
