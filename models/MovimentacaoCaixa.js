const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Usuario = require("./Usuario");
const ContasReceber = require("./ContasReceber");
const ContasPagar = require("./ContasPagar");
const Caixa = require("./Caixa");

const MovimentacaoCaixa = db.define('mov_caixa', {
    horaDaMovimentacao: {
        type: Sequelize.DATE(6)
    },
    origem: {
        type: Sequelize.STRING
    },
    tipoDeRecebimento: {
        type: Sequelize.STRING
    },
    tipoDeMovimento: {
        type: Sequelize.STRING
    },
    valor: {
        type: Sequelize.DECIMAL(10, 2)
    },
})

MovimentacaoCaixa.belongsTo(ContasReceber);
MovimentacaoCaixa.belongsTo(ContasPagar);
MovimentacaoCaixa.belongsTo(Usuario);
MovimentacaoCaixa.belongsTo(Caixa);
MovimentacaoCaixa.sync()
module.exports = MovimentacaoCaixa;
