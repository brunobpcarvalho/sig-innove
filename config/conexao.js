require("dotenv").config();
const Sequelize = require('sequelize');
var conexao;

if (process.env.DATABASE_URL) {
	conexao = new Sequelize(process.env.DATABASE_URL, {
		dialect:  'postgres',
		protocol: 'postgres',
		dialectOptions: {"ssl": false},
        	logging: false
  })
	console.log(conexao)
} else {
	conexao = new Sequelize('dbinnove', 'postgres', 'postgres', {
		host: 'database',
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
