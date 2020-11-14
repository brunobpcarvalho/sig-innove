const Sequelize = require('sequelize');
var db = require("../config/conexao");
const ContasPagar = require("./ContasPagar");

const ParcelaContaPagar = db.define('parcela_pagamento', {
    parcela: {
        type: Sequelize.INTEGER
    },
    formaDePagamento: {
        type: Sequelize.STRING
    },
    valorDaParcela: {
        type: Sequelize.DECIMAL(10, 2)
    },
    dataDeVencimento: {
        type: Sequelize.DATEONLY
    },
    valorPago: {
        type: Sequelize.DECIMAL(10, 2)
    },
    dataDePagamento: {
        type: Sequelize.DATEONLY
    },
    desconto: {
        type: Sequelize.DECIMAL(10, 2)
    },
    status: {
        type: Sequelize.BOOLEAN
    },
})
ParcelaContaPagar.belongsTo(ContasPagar);
ParcelaContaPagar.sync()
module.exports = ParcelaContaPagar;
