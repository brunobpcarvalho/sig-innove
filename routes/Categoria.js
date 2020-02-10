const express = require("express")
const router = express.Router()
var ControllerCategoria = require('../controllers/ControllerCategoria')
const {User} = require("../helpers/User")

router.get('/list-categorias', User, ControllerCategoria.listAll)

router.post('/list-categorias/nova', User, ControllerCategoria.add)

router.post('/list-categorias/deletar', User, ControllerCategoria.delete)

router.post("/list-categorias/editar", User, ControllerCategoria.update)

router.post("/list-categorias/validar", User, ControllerCategoria.validar);

/*----------------------------------------------------------------------------*/
module.exports = router;