const express = require("express")
const router = express.Router()
var ControllerPessoa = require('../controllers/ControllerPessoa')
var ControllerRelatorio = require('../controllers/ControllerRelatorio')
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/list-pessoas', User, ControllerPessoa.listAll)

router.post('/list-pessoas/nova', User, ControllerPessoa.add)

router.post('/list-pessoas/deletar', User, ControllerPessoa.delete)

router.post("/list-pessoas/editar", User, ControllerPessoa.update)

router.post("/list-pessoas/validar", User, ControllerPessoa.validar);

router.post("/list-pessoas/filter", User, ControllerPessoa.filter);

router.post("/list-pessoas/gerar-pdf/", User, ControllerRelatorio.GerarPdfPessoas)

/*----------------------------------------------------------------------------*/

module.exports = router
