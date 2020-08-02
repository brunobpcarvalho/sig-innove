const Sequelize = require('sequelize');
var db = require("../config/conexao");

const Usuario = db.define('usuarios', {
    nome: {
        type: Sequelize.STRING
    },
    usuario:{
        type: Sequelize.STRING
    },
    senha: {
        type: Sequelize.STRING
    },
    nivelAcesso: {
        type: Sequelize.STRING
    },
    ativo: {
        type: Sequelize.STRING
    }
})
Usuario.sync({force: true})
module.exports = Usuario;
