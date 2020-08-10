const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Pessoa = require("./Pessoa");

const ContasReceber = db.define('recebimento', {
  dataCompetencia: {
    type: Sequelize.DATEONLY
  },
  quantidadeDeParcelas: {
    type: Sequelize.INTEGER
  },
  valorTotal: {
    type: Sequelize.DECIMAL(10, 2)
  },
  vendaId: {
    type: Sequelize.INTEGER
  }
})

ContasReceber.belongsTo(Pessoa);
ContasReceber.sync()
module.exports = ContasReceber;
