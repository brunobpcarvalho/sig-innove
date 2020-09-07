const express = require("express")
const router = express.Router()
var ControllerPessoa = require('../controllers/ControllerPessoa')
var ControllerRelatorio = require('../controllers/ControllerRelatorio')
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/list-pessoas', Admin, ControllerPessoa.listAll)

router.post('/list-pessoas/nova', Admin, ControllerPessoa.add)

router.post('/list-pessoas/deletar', Admin, ControllerPessoa.delete)

router.post("/list-pessoas/editar", Admin, ControllerPessoa.update)

router.post("/list-pessoas/validar", Admin, ControllerPessoa.validar);

router.post("/list-pessoas/filter", Admin, ControllerPessoa.filter);

router.post("/list-pessoas/gerar-pdf/", Admin, ControllerRelatorio.GerarPdfPessoas)

/*----------------------------------------------------------------------------*/

module.exports = router
