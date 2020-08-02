var db = require("../config/conexao")
const Usuario = require("../models/Usuario")
const Venda = require("../models/Venda")
const bcrypt = require("bcryptjs")
const passport = require("passport")

exports.index = (req, res) => {
	Usuario.findAll().then((dadosUsuarios) => { // sort serve para ordenar pela data
		const contextUsuarios = {
			usuarios: dadosUsuarios.map(dado => {
				return {
					id: dado.id,
					usuario: dado.usuario,
					nivelAcesso: dado.nivelAcesso,
					dataInclusao: dado.dataInclusao,
					ativo: dado.ativo,
					createdAt: dado.createdAt
				}
			})
		}
		res.render("usuarios/index", {usuarios: contextUsuarios.usuarios})
	}).catch((erro) => {
		res.redirect("/index")
	})
}

exports.edit = (req, res) => {
	Usuario.findByPk(req.params.id).then((dadosUsuario) =>{
		const usuario = {
			id: dadosUsuario.id,
			usuario: dadosUsuario.usuario,
			nivelAcesso: dadosUsuario.nivelAcesso,
			dataInclusao: dadosUsuario.dataInclusao,
			ativo: dadosUsuario.ativo,
		}
		res.render("usuarios/edit", {usuario: usuario})
	}).catch((erro) => {
		req.flash("error_msg", "Erro ao buscar ou listar essa venda!")
		res.redirect("/usuarios/index")
	})
}

exports.create = (req, res) => {
	const novoUsuario = new Usuario({
		usuario: req.body.usuario,
		senha: req.body.senha,
		nivelAcesso: req.body.nivelAcesso,
		dataInclusao: req.body.dataInclusao,
		ativo: req.body.ativo
	})

	bcrypt.genSalt(10, (erro, salt) => {
		bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
			if(erro){
				req.flash("msg_erro", "Houve um erro ao gerar hash da Senha!")
				res.redirect("/usuarios/index")
			}
			novoUsuario.senha = hash
			novoUsuario.save().then(() => {
				req.flash("msg_sucesso", "Usuario cadastrado com sucesso!")
				res.redirect("/usuarios/index")
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possível salvar este usuario!")
				res.redirect("/usuarios/index")
			})
		})
	})
}

exports.destroy = (req, res) => {
	Venda.findAll({where: {usuarioId: req.body.id}}).then((usuario) =>{
		if(usuario.length < 1){
			Usuario.destroy({ where: {id: req.body.id}}).then(() => {
				req.flash("msg_sucesso", "Usuário deletado com sucesso!")
				res.redirect("/usuarios/index")
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possível excluir este usuario!")
				res.redirect("/usuarios/index")
			})
		}else {
			req.flash("msg_erro", "Não é possivel excluir esse Usuário, pois está sendo utilizado em uma Venda!")
			res.redirect("/usuarios/index")
		}
	}).catch((erro)=>{
		req.flash("msg_erro", "Não foi possivel encontrar o Usuario! " + erro)
		res.redirect("/usuarios/index")
	})



}

exports.update = (req, res) => {
	Usuario.findByPk(req.body.id).then((usuario) =>{

		usuario.usuario = req.body.usuario,
		usuario.nivelAcesso = req.body.nivelAcesso,
		usuario.dataInclusao = req.body.dataInclusao,
		usuario.ativo = req.body.ativo

		if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
			usuario.save().then(() => {
				req.flash("msg_sucesso", "Usuario editado com sucesso!")
				res.redirect("/usuarios/index")
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possível editar o usuario!")
				res.redirect("/usuarios/index")
			})
		} else {
			bcrypt.genSalt(10, (erro, salt) => {
				bcrypt.hash(req.body.senha, salt, (erro, hash) => {
					if(erro){
						req.flash("msg_erro", "Houve um erro ao gerar hash da Senha!")
						res.redirect("/usuarios/index")
					}
					usuario.senha = hash
					usuario.save().then(() => {
						req.flash("msg_sucesso", "Usuario editado com sucesso!")
						res.redirect("/usuarios/index")
					}).catch((erro) => {
						req.flash("msg_erro", "Não foi possível salvar este usuario!")
						res.redirect("/usuarios/index")
					})
				})
			})
		}
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível localizar o usario!")
		res.redirect("/usuarios/index")
	})
}

exports.login = (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/index",
		failureRedirect: "/",
		failureFlash: true
	})(req, res, next)
}

exports.logout = (req, res) => {
	req.logout()
	req.flash("error", "Voce foi desconectado do Sistema!")
	res.redirect("/")
}
