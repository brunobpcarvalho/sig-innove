const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Pessoa = require("./Pessoa");

const ContasReceber = db.define('recebimento', {
  formaPagamento: {
    type: Sequelize.STRING
  },
  valor: {
    type: Sequelize.DECIMAL(10, 2)
  },
  valorPago: {
    type: Sequelize.DECIMAL(10, 2)
  },
  desconto: {
    type: Sequelize.DECIMAL(10, 2)
  },
  dataCompetencia: {
    type: Sequelize.DATEONLY
  },
  dataVencimento: {
    type: Sequelize.DATEONLY
  },
  dataPagamento: {
    type: Sequelize.DATEONLY
  },
  pago: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  venda: {
    type: Sequelize.INTEGER
  }
})

ContasReceber.belongsTo(Pessoa);
ContasReceber.sync()
module.exports = ContasReceber;
