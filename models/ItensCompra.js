const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Compra = require("./Compra");
const Produto = require("./Produto");

const ItensCompra = db.define('itens_compra', {
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

ItensCompra.belongsTo(Compra);
ItensCompra.belongsTo(Produto);
ItensCompra.sync()
module.exports = ItensCompra;
