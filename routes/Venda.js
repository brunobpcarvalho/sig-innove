const express = require("express");
const router = express.Router();
const ControllerVenda = require('../controllers/ControllerVenda')
const {Admin} = require("../helpers/Admin")
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/list-vendas', User, ControllerVenda.listAll);

router.get('/add-venda', Admin, ControllerVenda.addVenda);

router.post('/add-venda/nova', Admin, ControllerVenda.add);

router.post('/list-vendas/deletar', Admin, ControllerVenda.delete);

router.get("/list-vendas/edit/:id", Admin, ControllerVenda.updateVenda);

router.post("/list-vendas/update", Admin, ControllerVenda.update);

router.post("/list-vendas/gerar-financeiro", Admin, ControllerVenda.gerarFinanceiro);

router.get("/list-vendas/estornar-venda/:id", Admin, ControllerVenda.estornarVenda);

router.post("/list-vendas/filter", Admin, ControllerVenda.filter);

router.get("/generate-pdf/:id", Admin, ControllerVenda.generatePdf);

/*----------------------------------------------------------------------------*/
module.exports = router;
