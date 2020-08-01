var db = require("../config/conexao")
const Fabricante = require("../models/Fabricante")
const Produto = require("../models/Produto")


exports.listAll = (req, res) => {
	Fabricante.findAll().then((dados) => {
		const context = {
      fabricantes: dados.map(dado => {
        return {
          id: dado.id,
          nome: dado.nome,
          ativo: dado.ativo,
        }
      })
    }
		res.render("produtos/list-fabricantes", {fabricantes: context.fabricantes})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel listar os fabricantes!")
		res.redirect("/index")
	})
}

exports.add = (req, res) => {
	Fabricante.create({
		nome: req.body.nome,
		ativo: req.body.ativo
	}).then(() => {
		req.flash("msg_sucesso", "Fabricante salvo com sucesso!")
		res.redirect("/produtos/list-fabricantes")
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel salvar o fabricante!")
		res.redirect("/index")
	})
}

exports.delete = (req, res) => {
	Produto.findAll({where: {fabricanteId: req.body.id}}).then((fabricante) =>{
		if(fabricante.length < 1){
			Fabricante.destroy({where: {id: req.body.id}}).then(() => {
				req.flash("msg_sucesso", "Fabricante deletado com sucesso!")
				res.redirect("/produtos/list-fabricantes")
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possivel excluir o fabricante!")
				res.redirect("/produtos/list-fabricantes")
			})
		}else {
			req.flash("msg_erro", "Não é possivel excluir esse Fabricante, pois esta sendo utilizado em um Produto!")
			res.redirect("/produtos/list-fabricantes")
		}
	}).catch((erro)=>{
		req.flash("msg_erro", "Não foi possivel encontrar o fabricante!")
		res.redirect("/produtos/list-fabricantes")
	})
}

exports.update = (req, res) => {
	Fabricante.findByPk(id = req.body.id).then((fabricante) =>{
		fabricante.nome = req.body.nome,
		fabricante.ativo = req.body.ativo

		fabricante.save().then(() => {
			req.flash("msg_sucesso", "Fabricante editado com sucesso!")
			res.redirect("/produtos/list-fabricantes")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel editar o fabricante!")
			res.redirect("/produtos/list-fabricantes")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel encontrar o fabricante!")
		res.redirect("/produtos/list-fabricantes")
	})
}

exports.validar = (req, res) => {
	Fabricante.findAll({where: {nome: req.body.nome}}).then((fabricante) => {
		if(fabricante.length > 0){
			res.send(true)
		} else {
			res.send(false)
		}
	}).catch((erro) => {
		req.flash("msg_erro", "Houve um erro ao validar!")
		res.redirect("/produtos/list-fabricantes")
	})
}
