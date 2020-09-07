const Sequelize = require('sequelize');
var db = require("../config/conexao");
const ContasReceber = require("./ContasReceber");

const ParcelaContaReceber = db.define('parcela_recebimento', {
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
ParcelaContaReceber.belongsTo(ContasReceber);
ParcelaContaReceber.sync()
module.exports = ParcelaContaReceber;
