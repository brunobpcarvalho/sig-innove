const Sequelize = require('sequelize');
var db = require("../config/conexao");

const Empresa = db.define('empresas', {
  name: {
    type: Sequelize.STRING
  },
  size: {
    type: Sequelize.DOUBLE
  },
  key: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  nomeFantasia: {
    type: Sequelize.STRING
  },
  razaoSocial: {
    type: Sequelize.STRING
  },
  cnpj: {
    type: Sequelize.STRING
  },
  ie: {
    type: Sequelize.STRING
  },
  telefone: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
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
  },
  complemento: {
    type: Sequelize.STRING
  }
})
module.exports = Empresa;
