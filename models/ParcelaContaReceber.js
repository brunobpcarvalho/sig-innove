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
        type: Sequelize.DATE
    },
    valorPago: {
        type: Sequelize.DECIMAL(10, 2)
    },
    dataDePagamento: {
        type: Sequelize.DATE
    },
    desconto: {
        type: Sequelize.DECIMAL(10, 2)
    },
    status: {
        type: Sequelize.STRING(8)
    },
})
ParcelaContaReceber.belongsTo(ContasReceber);
ParcelaContaReceber.sync()
module.exports = ParcelaContaReceber;
