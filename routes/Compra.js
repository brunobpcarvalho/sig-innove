const express = require("express")
const router = express.Router()
const ControllerCompra = require('../controllers/ControllerCompra')
const {User} = require("../helpers/User")
/*----------------------------------------------------------------------------*/

router.get('/index', User, ControllerCompra.index)

router.get('/store', User, ControllerCompra.store)

router.post('/create', User, ControllerCompra.create)

router.get('/edit/:id', User, ControllerCompra.edit)

router.post('/update', User, ControllerCompra.update)

router.post('/delete', User, ControllerCompra.delete)

router.get('/estornar/:id', User, ControllerCompra.estornar)

router.get('/historico/:id', User, ControllerCompra.historico)

router.post("/filter", User, ControllerCompra.filter)

router.post("/gerar-financeiro", User, ControllerCompra.gerarFinanceiro)

/*----------------------------------------------------------------------------*/
module.exports = router;
