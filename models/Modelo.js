const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Categoria = require("./Categoria");

const Modelo = db.define('modelos', {
  descricao: {
    type: Sequelize.STRING
  },
  ativo: {
    type: Sequelize.STRING
  }
})

Modelo.belongsTo(Categoria);

module.exports = Modelo;
