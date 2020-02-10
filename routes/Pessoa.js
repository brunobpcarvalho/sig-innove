const express = require("express")
const router = express.Router()
var ControllerPessoa = require('../controllers/ControllerPessoa')
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/list-pessoas', Admin, ControllerPessoa.listAll)

router.post('/list-pessoas/nova', Admin, ControllerPessoa.add)

router.post('/list-pessoas/deletar', Admin, ControllerPessoa.delete)

router.post("/list-pessoas/editar", Admin, ControllerPessoa.update)

router.post("/list-pessoas/validar", Admin, ControllerPessoa.validar);

router.get("/list-pessoas/relatorio", Admin, ControllerPessoa.relatorio);

/*----------------------------------------------------------------------------*/

module.exports = router
