const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Modelo = require("./Modelo");
const Fabricante = require("./Fabricante");

const Produto = db.define('produtos', {
  descricao: {
    type: Sequelize.STRING
  },
  unidadeMedida: {
    type: Sequelize.STRING
  },
  valorUnitario: {
    type: Sequelize.DECIMAL(10, 2)
  },
  ativo: {
    type: Sequelize.STRING
  }
})

Produto.belongsTo(Modelo);
Produto.belongsTo(Fabricante);

module.exports = Produto;
