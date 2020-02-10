const express = require("express")
const router = express.Router()
var ControllerEmpresa = require('../controllers/ControllerEmpresa')
const {Admin} = require("../helpers/Admin")

const multer  = require('multer')
const multerConfig = require("../config/multer")

router.get('/index', Admin, ControllerEmpresa.index)

router.post('/store', Admin, multer(multerConfig).single('file'), ControllerEmpresa.store)

router.post('/update', Admin, multer(multerConfig).single('file'), ControllerEmpresa.update)

/*----------------------------------------------------------------------------*/
module.exports = router;
