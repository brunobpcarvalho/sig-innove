const express = require("express")
const router = express.Router()
const ControllerRelatorio = require("../controllers/ControllerRelatorio")
const {Admin} = require("../helpers/Admin")

router.get('/relatorio-lucro-produto', Admin, ControllerRelatorio.LucroPorProduto)

router.get('/relatorio-lucro-produto/gerar-pdf', Admin, ControllerRelatorio.GerarPdfLucroProduto)

/*----------------------------------------------------------------------------*/
module.exports = router;
