const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Venda = require("./Venda");
const Produto = require("./Produto");

const ItensVenda = db.define('itens_venda', {
  quantidade: {
    type: Sequelize.INTEGER
  },
  valorUnitario: {
    type: Sequelize.DECIMAL(10, 2)
  },
  valorTotal: {
    type: Sequelize.DECIMAL(10, 2)
  }
})

ItensVenda.belongsTo(Venda);
ItensVenda.belongsTo(Produto);

module.exports = ItensVenda;