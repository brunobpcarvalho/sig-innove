const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Usuario = require("./Usuario");

const Caixa = db.define('caixa', {
    dataAbertura: {
        type: Sequelize.DATE(6)
    },
    dataFechamento: {
        type: Sequelize.DATE(6)
    },
    troco: {
        type: Sequelize.DECIMAL(10, 2)
    },
    saldoFinaldoSistema: {
        type: Sequelize.DECIMAL(10, 2)
    },
    saldoFinaldoCaixa: {
        type: Sequelize.DECIMAL(10, 2)
    },
    saldoAtual: {
        type: Sequelize.DECIMAL(10, 2)
    },
    totalEntradas: {
        type: Sequelize.DECIMAL(10, 2)
    },
    totalSaidas: {
        type: Sequelize.DECIMAL(10, 2)
    },
    observacao: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'aberto'
    }
})

Caixa.belongsTo(Usuario);
Caixa.sync()
module.exports = Caixa;
