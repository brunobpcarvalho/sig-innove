const express = require("express")
const router = express.Router()
var ControllerProduto = require('../controllers/ControllerProduto')
const {User} = require("../helpers/User")

router.get('/list-produtos', User, ControllerProduto.listAll);

router.post('/list-produtos/nova', User, ControllerProduto.add);

router.post('/list-produtos/deletar', User, ControllerProduto.delete);

router.post("/list-produtos/editar", User, ControllerProduto.update);

router.post("/list-produtos/controle-estoque", User, ControllerProduto.controleEstoque);

/*----------------------------------------------------------------------------*/
module.exports = router;
