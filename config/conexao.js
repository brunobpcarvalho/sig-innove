require("dotenv").config();
const Sequelize = require('sequelize');
var conexao;

if (process.env.DATABASE_URL) {
	
console.log("teste")
	conexao = new Sequelize(process.env.DATABASE_URL, {
		dialect:  'postgres',
		protocol: 'postgres',
		dialectOptions: {"ssl": true},
        	logging: false
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
