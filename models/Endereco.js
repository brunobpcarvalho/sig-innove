const Sequelize = require('sequelize');
var db = require("../config/conexao");

const Endereco = db.define('enderecos', {
  cep: {
    type: Sequelize.STRING
  },
  rua: {
    type: Sequelize.STRING
  },
  numero: {
    type: Sequelize.STRING
  },
  bairro: {
    type: Sequelize.STRING
  },
  cidade: {
    type: Sequelize.STRING
  },
  uf: {
    type: Sequelize.STRING
  }
});

module.exports = Endereco;
