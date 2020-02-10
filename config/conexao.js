const Sequelize = require('sequelize');
const config = require("./database.js")
const conexao = new Sequelize(config);

conexao.authenticate().then(() => {
  console.log("Conectado ao Postgres");
}).catch((err) => {
  console.log("Erro ao se conectar: " + err);
})

module.exports = conexao;