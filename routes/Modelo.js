const express = require("express")
const router = express.Router()
var ControllerModelo = require('../controllers/ControllerModelo')
const {User} = require("../helpers/User")
const {Admin} = require("../helpers/Admin")

router.get('/list-modelos', User, ControllerModelo.listAll);

router.post('/list-modelos/nova', Admin, ControllerModelo.add);

router.post('/list-modelos/deletar', Admin, ControllerModelo.delete);

router.post("/list-modelos/editar", Admin, ControllerModelo.update);

router.post("/list-modelos/validar", Admin, ControllerModelo.validar);

/*----------------------------------------------------------------------------*/
module.exports = router;