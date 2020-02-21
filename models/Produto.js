const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Modelo = require("./Modelo");
const Fabricante = require("./Fabricante");
const Categoria = require("./Categoria");

const Produto = db.define('produtos', {
  descricao: {
    type: Sequelize.STRING
  },
  quantidade: {
    type: Sequelize.INTEGER
  },
  valorUnitario: {
    type: Sequelize.DECIMAL(10, 2)
  },
  valorCusto: {
    type: Sequelize.DECIMAL(10, 2)
  },
  prazoReposicao: {
    type: Sequelize.INTEGER
  },
  ativo: {
    type: Sequelize.STRING
  }
})

Produto.belongsTo(Modelo);
Produto.belongsTo(Fabricante);
Produto.belongsTo(Categoria);

Produto.sync({force> true})

module.exports = Produto;
