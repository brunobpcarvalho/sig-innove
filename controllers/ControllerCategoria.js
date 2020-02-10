var db = require("../config/conexao")
const Categoria = require("../models/Categoria")
const Produto = require("../models/Produto")

exports.listAll = (req, res) => {
	Categoria.findAll().then((dados) => {
		const context = {
      categorias: dados.map(dado => {
        return {
          id: dado.id,
          nome: dado.nome,
          ativo: dado.ativo,
        }
      })
    }
		res.render("produtos/list-categorias", {categorias: context.categorias})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível listar as categorias!")
		res.redirect("/index")
	})
}

exports.add = (req, res) => {
	Categoria.create({
		nome: req.body.nome,
		ativo: req.body.ativo
	}).then(() => {
		req.flash("msg_sucesso", "Categoria salva com sucesso!")
		res.redirect("/produtos/list-categorias")
	}).catch((erro) => {
		res.redirect("/index")
	})
}

exports.delete = (req, res) => {
	Produto.findAll({where: {categoriaId: req.body.id}}).then((produto) =>{
		if(produto.length < 1){
			Categoria.destroy({where: {id: req.body.id}}).then(() => {
				req.flash("msg_sucesso", "Categoria deletada com sucesso!")
				res.redirect("/produtos/list-categorias")
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possivel excluir esta categoria!: " + erro)
				res.redirect("/index")
			})
		}else {
			req.flash("msg_erro", "Não é possivel excluir essa categoria, pois esta sendo utilizada em um Produto!")
			res.redirect("/produtos/list-categorias")
		}
	}).catch((erro)=>{
		req.flash("msg_erro", "Não foi possível deletar esta categoria!")
		res.redirect("/produtos/list-categorias")
	})
}

exports.update = (req, res) => {
	Categoria.findByPk(id = req.body.id).then((categoria) =>{
		categoria.nome = req.body.nome,
		categoria.ativo = req.body.ativo

		categoria.save().then(() => {
			req.flash("msg_sucesso", "Categoria editada com sucesso!")
			res.redirect("/produtos/list-categorias")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível editar esta categoria!")
			res.redirect("/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível encontrar esta categoria!")
		res.redirect("/index")
	})
}

exports.validar = (req, res) => {
	Categoria.findAll({where: {nome: req.body.nome}}).then((categoria) => {
		if(categoria.length > 0){
			res.send('existe')
		}
		res.send('nao')
	}).catch((erro) => {
		req.flash("msg_erro", "Houve um erro ao validar!")
		res.redirect("/produtos/list-categorias")
	})
}
