const express = require("express");
const router = express.Router();
const ControllerVenda = require('../controllers/ControllerVenda')
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/list-vendas', User, ControllerVenda.listAll);

router.get('/add-venda', User, ControllerVenda.addVenda);

router.post('/add-venda/nova', User, ControllerVenda.add);

router.post('/list-vendas/deletar', User, ControllerVenda.delete);

router.get("/list-vendas/edit/:id", User, ControllerVenda.updateVenda);

router.post("/list-vendas/update", User, ControllerVenda.update);

router.post("/list-vendas/gerar-financeiro", User, ControllerVenda.gerarFinanceiro);

router.get("/list-vendas/estornar-venda/:id", User, ControllerVenda.estornarVenda);

router.post("/list-vendas/filter", User, ControllerVenda.filter);

router.get("/generate-pdf/:id", User, ControllerVenda.generatePdf);

/*----------------------------------------------------------------------------*/
module.exports = router;
