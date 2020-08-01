var db = require("../config/conexao")
const Modelo = require("../models/Modelo")
const Produto = require("../models/Produto")

exports.listAll = (req, res) => {
	Modelo.findAll().then((dados) => {
		const context = {
      modelos: dados.map(dado => {
        return {
          id: dado.id,
          descricao: dado.descricao,
          ativo: dado.ativo,
        }
      })
    }
		res.render("produtos/list-modelos", {modelos: context.modelos})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível listar os modelos!")
		res.redirect("/index")
	})
}

exports.add = (req, res) => {
	const novoModelo = new Modelo({
		descricao: req.body.descricao,
		ativo: req.body.ativo
	})
	novoModelo.save().then(() => {
		req.flash("msg_sucesso", "Modelo salvo com sucesso!")
		res.redirect("/produtos/list-modelos")
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao salvar modelo!")
		res.redirect("/index")
	})
}

exports.delete = (req, res) => {
	Produto.findAll({where: {modeloId: req.body.id}}).then((modelo) =>{
		if(modelo.length == 0){
			Modelo.destroy({where: {id: req.body.id}}).then(() => {
				req.flash("msg_sucesso", "Modelo deletado com sucesso!")
				res.redirect("/produtos/list-modelos")
			}).catch((erro) => {
				req.flash("msg_erro", "Erro ao deletar este modelo!")
				res.redirect("/produtos/list-modelos")
			})
		}else {
			req.flash("msg_erro", "Não é possivel excluir esse Modelo, pois esta sendo utilizado em um Produto!")
			res.redirect("/produtos/list-modelos")
		}
	}).catch((erro)=>{
		req.flash("msg_erro", "Não foi possivel encontrar este modelo!")
		res.redirect("/produtos/list-modelos")
	})
}

exports.update = (req, res) => {
	Modelo.findByPk(id = req.body.id).then((modelo) =>{
		modelo.descricao = req.body.descricao,
		modelo.ativo = req.body.ativo

		modelo.save().then(() => {
			req.flash("msg_sucesso", "Modelo editado com sucesso!")
			res.redirect("/produtos/list-modelos")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel editar este modelo!")
			res.redirect("/produtos/list-modelos")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel encontrar este modelo!")
		res.redirect("/produtos/list-modelos")
	})
}

exports.validar = (req, res) => {
	Modelo.findAll({where: {descricao: req.body.campo}}).then((modelo) => {
		if(modelo.length > 0){
			res.send(true)
		} else {
			res.send(false)
		}
	}).catch((erro) => {
		req.flash("msg_erro", "Houve um erro ao validar!")
		res.redirect("/produtos/list-modelos")
	})
}
