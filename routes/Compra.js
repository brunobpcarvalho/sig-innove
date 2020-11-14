const express = require("express")
const router = express.Router()
const ControllerCompra = require('../controllers/ControllerCompra')
const {Admin} = require("../helpers/Admin")
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/index', User, ControllerCompra.index)

router.get('/store', Admin, ControllerCompra.store)

router.post('/create', Admin, ControllerCompra.create)

router.get('/edit/:id', Admin, ControllerCompra.edit)

router.post('/update', Admin, ControllerCompra.update)

router.post('/delete', Admin, ControllerCompra.delete)

router.get('/estornar/:id', Admin, ControllerCompra.estornar)

router.get('/historico/:id', Admin, ControllerCompra.historico)

router.post("/filter", Admin, ControllerCompra.filter)

router.post("/gerar-financeiro", Admin, ControllerCompra.gerarFinanceiro)

/*router.post("/list-vendas/estornar-venda/:id", Admin, ControllerVenda.estornarVenda);

router.get("/generate-pdf/:id", Admin, ControllerVenda.generatePdf);*/

/*----------------------------------------------------------------------------*/
module.exports = router;
