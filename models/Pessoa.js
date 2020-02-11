const Sequelize = require('sequelize');
var db = require("../config/conexao");

const Pessoa = db.define('pessoas', {
  nome: {
    type: Sequelize.STRING
  },
  tipo: {
    type: Sequelize.STRING
  },
  funcao: {
    type: Sequelize.STRING
  },
  cpf_cnpj: {
    type: Sequelize.STRING
  },
  ie: {
    type: Sequelize.STRING
  },
  razao_social: {
    type: Sequelize.STRING
  },
  nome_mae: {
    type: Sequelize.STRING
  },
  dataNascimento: {
    type: Sequelize.DATEONLY
  },
  telefone: {
    type: Sequelize.STRING
  },
  celular: {
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
  },
  ativo: {
    type: Sequelize.STRING
  }
})
Pessoa.sync({force: true})
module.exports = Pessoa;
