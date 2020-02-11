const Sequelize = require('sequelize');
var db = require("../config/conexao");

const Categoria = db.define('categorias', {
  nome: {
    type: Sequelize.STRING
  },
  ativo: {
    type: Sequelize.STRING
  }
})

Categoria.sync({force: true})
module.exports = Categoria;
