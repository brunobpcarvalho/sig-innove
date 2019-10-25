const Sequelize = require('sequelize');
const conexao = new Sequelize('dcc93jd5jlaocv', 'seslirhgjifqin', 'd04ed3a48086c3bbf3491f228d969e05bea1da9a9d1c1234755ba22008f252e3', {
  host: 'ec2-50-19-95-77.compute-1.amazonaws.com',
  dialect: 'postgres',
  logging: false
});

conexao.authenticate().then(() => {
  console.log("Conectado ao Postgres");
}).catch((err) => {
  console.log("Erro ao se conectar: " + err);
})

module.exports = conexao;
