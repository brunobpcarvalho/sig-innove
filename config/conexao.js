require("dotenv").config();
const Sequelize = require('sequelize');
var conexao; 

if (process.env.DATABASE_URL) {
	conexao = new Sequelize(process.env.DATABASE_URL, {
		dialect:  'postgres',
		protocol: 'postgres',
		port:     match[4],
		host:     match[3],
      logging:  false //false
  })
} else {
	conexao = new Sequelize('dbinnove', 'postgres', '123456', {
		host: 'localhost',
		dialect: 'postgres',
		logging: false
	});
}

conexao.authenticate().then(() => {
	console.log("Conectado ao Postgres");
}).catch((err) => {
	console.log("Erro ao se conectar: " + err);
})

module.exports = conexao;
