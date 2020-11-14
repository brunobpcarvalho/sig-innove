const Sequelize = require('sequelize');
var db = require("../config/conexao");
const Pessoa = require("./Pessoa");

const ContasPagar = db.define('pagamento', {
  dataCompetencia: {
    type: Sequelize.DATEONLY
  },
  quantidadeDeParcelas: {
    type: Sequelize.INTEGER
  },
  valorTotal: {
    type: Sequelize.DECIMAL(10, 2)
  },
  compraId: {
    type: Sequelize.INTEGER
  }
})

ContasPagar.belongsTo(Pessoa);
ContasPagar.sync()
module.exports = ContasPagar;
