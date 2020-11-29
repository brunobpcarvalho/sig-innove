const express = require("express")
const router = express.Router()
var ControllerModelo = require('../controllers/ControllerModelo')
const {User} = require("../helpers/User")

router.get('/list-modelos', User, ControllerModelo.listAll);

router.post('/list-modelos/nova', User, ControllerModelo.add);

router.post('/list-modelos/deletar', User, ControllerModelo.delete);

router.post("/list-modelos/editar", User, ControllerModelo.update);

router.post("/list-modelos/validar", User, ControllerModelo.validar);

/*----------------------------------------------------------------------------*/
module.exports = router;
