var db = require("../config/conexao")
const Produto = require("../models/Produto")
const Modelo = require("../models/Modelo")
const Fabricante = require("../models/Fabricante")
const Categoria = require("../models/Categoria")
const Venda = require("../models/Venda")
const ItensVenda = require("../models/ItensVenda")
const Empresa = require("../models/Empresa")
const PDFDocument = require("pdfkit")

exports.listAll = (req, res) => {
	Produto.findAll({include: [{ model: Fabricante, as: 'fabricante' }, { model: Modelo, as: 'modelo' }, { model: Categoria, as: 'categoria' }]}).then((dadosProduto) => {
		Modelo.findAll({where: {ativo: 'Ativo'}}).then((dadosModelo) => {
			Fabricante.findAll({where: {ativo: 'Ativo'}}).then((dadosFabricante) => {
				Categoria.findAll({where: {ativo: 'Ativo'}}).then((dadosCategoria) => {
					const contextProduto = {
						produtos: dadosProduto.map(dado => {
							return {
								id: dado.id,
								descricao: dado.descricao,
								quantidade: dado.quantidade,
								fabricante: dado.fabricante.nome,
								modelo: dado.modelo.descricao,
								categoria: dado.categoria.nome,
								valorUnitario: dado.valorUnitario,
								valorCusto: dado.valorCusto,
								prazoReposicao: dado.prazoReposicao,
								ativo: dado.ativo,
							}
						})
					}
					const contextModelo = {
						modelos: dadosModelo.map(dado => {
							return {
								id: dado.id,
								descricao: dado.descricao,
								ativo: dado.ativo,
							}
						})
					}
					const contextFabricante = {
						fabricantes: dadosFabricante.map(dado => {
							return {
								id: dado.id,
								nome: dado.nome,
								ativo: dado.ativo,
							}
						})
					}
					const contextCategoria = {
						categorias: dadosCategoria.map(dado => {
							return {
								id: dado.id,
								nome: dado.nome,
								ativo: dado.ativo,
							}
						})
					}

					res.render("produtos/list-produtos", {produtos: contextProduto.produtos, modelos: contextModelo.modelos, fabricantes: contextFabricante.fabricantes, categorias: contextCategoria.categorias})
				}).catch((erro) => {
					req.flash("msg_erro", "Não foi possivel listar as Categorias!" + erro)
					res.redirect("/index")
				})
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possivel listar os fabricantes!" + erro)
				res.redirect("/index")
			})
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel listar os modelos!" + erro)
			res.redirect("/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel listar os produtos!" + erro)
		res.redirect("/index")
	})
}

exports.add = async (req, res) => {
	const novoProduto = await Produto.create({
		descricao: req.body.descricao,
		fabricanteId: req.body.fabricante,
		modeloId: req.body.modelo,
		categoriaId: req.body.categoria,
		valorUnitario: req.body.valorUnitario,
		valorCusto: req.body.valorCusto,
		prazoReposicao: req.body.prazoReposicao,
		ativo: req.body.ativo,
	})

	req.flash("msg_sucesso", "Produto salvo com sucesso!")
	res.redirect("/produtos/list-produtos")
}

exports.delete = (req, res) => {
	ItensVenda.findAll({where: {produtoId: req.body.id}}).then((itensVenda) =>{
		if(itensVenda.length < 1){
			Produto.destroy({where: {id: req.body.id}}).then(() => {
				req.flash("msg_sucesso", "Produto deletado com sucesso!")
				res.redirect("/produtos/list-produtos")
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possivel deletar o produto. Erro: " + erro)
				res.redirect("/produtos/list-produtos")
			})
		}else {
			req.flash("msg_erro", "Não é possivel excluir esse Produto, pois esta sendo utilizado em uma Venda!")
			res.redirect("/produtos/list-produtos")
		}
	}).catch((erro)=>{
		req.flash("msg_erro", "Não foi possivel encontrar o produto! " + erro)
		res.redirect("/produtos/list-produtos")
	})
}

exports.update = (req, res) => {
	Produto.findByPk(id = req.body.id).then((produto) =>{
		produto.descricao = req.body.descricao,
		produto.fabricanteId = req.body.fabricante,
		produto.modeloId = req.body.modelo,
		produto.categoriaId = req.body.categoria,
		produto.valorUnitario = req.body.valorUnitario,
		valorCusto = req.body.valorCusto,
		prazoReposicao = req.body.prazoReposicao,
		produto.ativo = req.body.ativo

		produto.save().then(() => {
			req.flash("msg_sucesso", "Produto editado com sucesso!")
			res.redirect("/produtos/list-produtos")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel salvar a alteração: " + erro)
			res.redirect("/produtos/list-produtos")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel encontrar o produto: " + erro)
		res.redirect("/produtos/list-produtos")
	})
}

exports.controleEstoque = (req, res) => {
	Produto.findByPk(req.body.id, {attributes: ['id', 'quantidade']}).then((produto) =>{
		produto.quantidade = req.body.quantidadeEstoque

		produto.save().then(() => {
			req.flash("msg_sucesso", "Estoque editado com sucesso!")
			res.redirect("/produtos/list-produtos")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel salvar a alteração: " + erro)
			res.redirect("/produtos/list-produtos")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel encontrar o produto: " + erro)
		res.redirect("/produtos/list-produtos")
	})
}
