const Sequelize = require('sequelize');
var db = require("../config/conexao");

const Fabricante = db.define('fabricantes', {
  nome: {
    type: Sequelize.STRING
  },
  ativo: {
    type: Sequelize.STRING
  }
})

module.exports = Fabricante;
