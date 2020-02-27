const express = require("express")
const router = express.Router()
const ControllerRelatorio = require("../controllers/ControllerRelatorio")
const {Admin} = require("../helpers/Admin")

router.get('/lucro-por-produto', Admin, ControllerRelatorio.LucroPorProduto)
router.get('/lucro-por-produto/gerar-pdf', Admin, ControllerRelatorio.GerarPdfLucroProduto)

router.get('/estoque-de-seguranca', Admin, ControllerRelatorio.EstoqueDeSeguranca)
router.get('/estoque-de-seguranca/gerar-pdf', Admin, ControllerRelatorio.GerarPdfEstoqueDeSeguranca)

/*----------------------------------------------------------------------------*/
module.exports = router;
