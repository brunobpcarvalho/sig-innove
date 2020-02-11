const express = require("express")
const router = express.Router()
var ControllerCategoria = require('../controllers/ControllerCategoria')
const {User} = require("../helpers/User")
const {Admin} = require("../helpers/Admin")

router.get('/list-categorias', User, ControllerCategoria.listAll)

router.post('/list-categorias/nova', Admin, ControllerCategoria.add)

router.post('/list-categorias/deletar', Admin, ControllerCategoria.delete)

router.post("/list-categorias/editar", Admin, ControllerCategoria.update)

router.post("/list-categorias/validar", Admin, ControllerCategoria.validar);

/*----------------------------------------------------------------------------*/
module.exports = router;