const express = require("express");
const router = express.Router();
const ControllerVenda = require('../controllers/ControllerVenda')
const {Admin} = require("../helpers/Admin")
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/list-vendas', ControllerVenda.listAll);

router.get('/add-venda', Admin, ControllerVenda.addVenda);

router.post('/add-venda/nova', Admin, ControllerVenda.add);

router.post('/list-vendas/deletar', Admin, ControllerVenda.delete);

router.get("/list-vendas/edit/:id", Admin, ControllerVenda.updateVenda);

router.post("/list-vendas/update", Admin, ControllerVenda.update);

router.get("/list-vendas/gerar-financeiro/:id", Admin, ControllerVenda.gerarFinanceiro);

router.get("/list-vendas/estornar-venda/:id", Admin, ControllerVenda.estornarVenda);

router.get("/list-vendas/aprovar-venda/:id", ControllerVenda.aprovarVenda);

router.get("/generate-pdf/:id", Admin, ControllerVenda.generatePdf);

/*----------------------------------------------------------------------------*/
module.exports = router;
