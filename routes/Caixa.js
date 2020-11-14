const express = require("express");
const router = express.Router();
const ControllerCaixa = require('../controllers/ControllerCaixa')
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/index', Admin, ControllerCaixa.index);

router.post('/create', Admin, ControllerCaixa.create);

router.get("/edit/:id", Admin, ControllerCaixa.edit);

router.post('/destroy', Admin, ControllerCaixa.destroy);

router.get("/verifica-caixa-aberto", Admin, ControllerCaixa.verificaCaixaAberto);

router.post('/fechar-caixa', Admin, ControllerCaixa.fecharCaixa);

router.post('/adicionar-retirar-dinheiro', Admin, ControllerCaixa.adicionarRemoverDinheiro);

router.get("/movimentos-caixa/:id", Admin, ControllerCaixa.movimentosCaixa);
/*----------------------------------------------------------------------------*/
module.exports = router;
