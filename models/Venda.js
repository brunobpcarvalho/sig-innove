const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Pessoa = require("./Pessoa");
const Usuario = require("./Usuario");

const Venda = db.define('vendas', {
    dataVenda: {
        type: Sequelize.DATEONLY
    },
    valorTotal: {
        type: Sequelize.DECIMAL(10, 2)
    },
    desconto: {
        type: Sequelize.DECIMAL(10, 2)
    },
    condicaoPagamento: {
        type: Sequelize.STRING
    },
    parcelas: {
        type: Sequelize.INTEGER
    },
    status: {
        type: Sequelize.STRING
    },
    financeiro: {
        type: Sequelize.STRING,
        defaultValue: 'nao'
    }
})

Venda.belongsTo(Pessoa);
Venda.belongsTo(Usuario);
Venda.sync()
module.exports = Venda;
