const express = require("express")
const router = express.Router()
var ControllerProduto = require('../controllers/ControllerProduto')
const {User} = require("../helpers/User")
const {Admin} = require("../helpers/Admin")

router.get('/list-produtos', User, ControllerProduto.listAll);

router.post('/list-produtos/nova', Admin, ControllerProduto.add);

router.post('/list-produtos/deletar', Admin, ControllerProduto.delete);

router.post("/list-produtos/editar", Admin, ControllerProduto.update);

router.post("/list-produtos/controle-estoque", Admin, ControllerProduto.controleEstoque);

/*----------------------------------------------------------------------------*/
module.exports = router;
