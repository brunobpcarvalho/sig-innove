const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Pessoa = require("./Pessoa");
const Usuario = require("./Usuario");

const Compra = db.define('compras', {
    dataCompra: {
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

Compra.belongsTo(Pessoa);
Compra.belongsTo(Usuario);
Compra.sync()
module.exports = Compra;
