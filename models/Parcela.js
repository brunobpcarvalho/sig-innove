const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Venda = require("./Venda");

const Parcela = db.define('parcelas', {
  formaPagamento: {
    type: Sequelize.STRING
  },
  vencimento: {
    type: Sequelize.DATEONLY
  },
  valor: {
    type: Sequelize.DECIMAL(10, 2)
  }
})
Parcela.belongsTo(Venda);
module.exports = Parcela;
