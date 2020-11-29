const express = require("express")
const router = express.Router()
var ControllerFabricante = require('../controllers/ControllerFabricante')
const {User} = require("../helpers/User")

router.get('/list-fabricantes', User, ControllerFabricante.listAll)

router.post('/list-fabricantes/nova', User, ControllerFabricante.add)

router.post('/list-fabricantes/deletar', User, ControllerFabricante.delete)

router.post("/list-fabricantes/editar", User, ControllerFabricante.update)

router.post("/list-fabricantes/validar", User, ControllerFabricante.validar)

/*----------------------------------------------------------------------------*/
module.exports = router;
