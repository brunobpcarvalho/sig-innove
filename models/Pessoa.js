const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Endereco = require("./Endereco");

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
  tel1: {
    type: Sequelize.STRING
  },
  tel2: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  ativo: {
    type: Sequelize.STRING
  }
})

Pessoa.belongsTo(Endereco);

module.exports = Pessoa;
