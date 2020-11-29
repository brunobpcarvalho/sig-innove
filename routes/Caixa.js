const express = require("express");
const router = express.Router();
const ControllerCaixa = require('../controllers/ControllerCaixa')
const {User} = require("../helpers/User")
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/index', User, ControllerCaixa.index);

router.post('/create', User, ControllerCaixa.create);

router.get("/edit/:id", User, ControllerCaixa.edit);

router.post('/destroy', Admin, ControllerCaixa.destroy);

router.get("/verifica-caixa-aberto", User, ControllerCaixa.verificaCaixaAberto);

router.post('/fechar-caixa', User, ControllerCaixa.fecharCaixa);

router.post('/adicionar-retirar-dinheiro', Admin, ControllerCaixa.adicionarRemoverDinheiro);

router.get("/movimentos-caixa/:id", Admin, ControllerCaixa.movimentosCaixa);
/*----------------------------------------------------------------------------*/
module.exports = router;
