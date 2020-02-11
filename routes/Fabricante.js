const express = require("express")
const router = express.Router()
var ControllerFabricante = require('../controllers/ControllerFabricante')
const {User} = require("../helpers/User")
const {Admin} = require("../helpers/Admin")

router.get('/list-fabricantes', User, ControllerFabricante.listAll)

router.post('/list-fabricantes/nova', Admin, ControllerFabricante.add)

router.post('/list-fabricantes/deletar', Admin, ControllerFabricante.delete)

router.post("/list-fabricantes/editar", Admin, ControllerFabricante.update)

router.post("/list-fabricantes/validar", Admin, ControllerFabricante.validar)

/*----------------------------------------------------------------------------*/
module.exports = router;