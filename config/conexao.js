const Sequelize = require('sequelize');
const conexao = new Sequelize('dbinnove', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

conexao.authenticate().then(() => {
  console.log("Conectado ao Postgres");
}).catch((err) => {
  console.log("Erro ao se conectar: " + err);
})

module.exports = conexao;
