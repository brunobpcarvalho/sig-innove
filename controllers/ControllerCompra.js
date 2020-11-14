var db = require("../config/conexao")
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Compra = require("../models/Compra")
const Usuario = require("../models/Usuario")
const Pessoa = require("../models/Pessoa")
const Produto = require("../models/Produto")
const ItensCompra = require("../models/ItensCompra")
const ContasPagar = require("../models/ContasPagar")
const ParcelaContaPagar = require("../models/ParcelaContaPagar")
const Empresa = require("../models/Empresa")
const PDFDocument = require("pdfkit")

exports.index = async (req, res) => {
	Compra.findAll({include: [{ model: Pessoa, as: 'pessoa' }, { model: Usuario, as: 'usuario' }]}).then((dadosCompra) => {
		const contextCompra = {
			compras: dadosCompra.map(dado => {
				return {
					id: dado.id,
					pessoa: dado.pessoa.nome,
					status: dado.status,
					usuario: dado.usuario.usuario,
					dataCompra: dado.dataCompra,
					valorTotal: dado.valorTotal,
					parcelas: dado.parcelas,
					financeiro: dado.financeiro
				}
			})
		}
		res.render("compras/index", {compras: contextCompra.compras})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro: Não foi possível listar a pagina de Compra!" + erro)
		res.redirect("/index")
	})
}
exports.store = async (req, res) => {
	Pessoa.findAll({where: {[Op.and]: [{funcao: 'Fornecedor'}, {ativo: 'Ativo'}]}}).then((dadosFornecedor) => {
		Produto.findAll({where: {ativo: 'Ativo'}}, {attributes: ['id', 'valorCusto', 'descricao']}).then((dadosProduto) => {
			const contextPessoa = {
				fornecedores: dadosFornecedor.map(dado => {
					return {
						id: dado.id,
						nome: dado.nome,
					}
				})
			}

			const contextProduto = {
				produtos: dadosProduto.map(dado => {
					return {
						id: dado.id,
						descricao: dado.descricao,
						valorCusto: dado.valorCusto,
					}
				})
			}
			res.render("compras/store", {produtos: contextProduto.produtos, fornecedores: contextPessoa.fornecedores})
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível buscar os Produtos")
			res.redirect("compras/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro: Não foi possível buscar os Forncedores!")
		res.redirect("compras/index")
	})
}

exports.create = async (req, res) => {
	const compra = await Compra.create({ usuarioId, pessoaId, dataCompra, valorTotal, desconto, condicaoPagamento, parcelas, status } = req.body)

	const itens = req.body.produtos
	const quantidade = req.body.quantidade
	const valorUnit = req.body.valorUnitario
	const subTotal = req.body.subTotal

	for (var i = 0; i < itens.length; i++) {
		const itensCompra = new ItensCompra({
			quantidade: quantidade[i],
			valorUnitario: valorUnit[i],
			valorTotal: subTotal[i],
			desconto: req.body.desconto,
			compraId: compra.id,
			produtoId: itens[i]
		})
		if(compra.status === 'COMPRA'){
			const quantidadeCompra = parseInt(quantidade[i])
			Produto.findOne({where: {id: itens[i]}}).then((produto)=>{
				produto.quantidade += quantidadeCompra
				produto.save().then(() => {
				}).catch((erro) => {
					req.flash("msg_erro", "Erro: Não foi possível salvar itens da Compra!")
					res.redirect("/compras/index")
				})
			}).catch((erro) => {
				req.flash("msg_erro", "Erro: Não foi possível salvar itens da Compra!" + erro)
				res.redirect("/compras/index")
			})
		}
		itensCompra.save().then(() => {
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível salvar itens da Compra!" + erro)
			res.redirect("/compras/index")
		})
	}
	req.flash("msg_sucesso", "Compra realizada com sucesso!")
	res.redirect("/compras/index")
}

exports.edit = async (req, res) => {
	Compra.findByPk(req.params.id, {include: [{ model: Pessoa, as: 'pessoa' }, { model: Usuario, as: 'usuario'}]}).then((dadosCompra) =>{
		ItensCompra.findAll({where: {compraId: req.params.id}, include: [{ model: Produto, as: 'produto' }]}).then((dadosItensCompra) =>{
			Produto.findAll({attributes: ['id', 'quantidade', 'valorUnitario', 'descricao']}).then((dadosProduto) => {
				const compra = {
					id: dadosCompra.id,
					pessoaId: dadosCompra.pessoa.id,
					pessoaNome: dadosCompra.pessoa.nome,
					status: dadosCompra.status,
					dataCompra: dadosCompra.dataCompra,
					usuarioId: dadosCompra.usuario.id,
					usuario: dadosCompra.usuario.usuario,
					desconto: dadosCompra.desconto,
					valorTotal: dadosCompra.valorTotal,
					condicaoPagamento: dadosCompra.condicaoPagamento,
					parcelas: dadosCompra.parcelas
				}
				const contextItensCompra = {
					itensCompra: dadosItensCompra.map(dado => {
						return {
							descricaoProduto: dado.produto.descricao,
							quantidade: dado.quantidade,
							valorUnitario: dado.valorUnitario,
							valorTotal: dado.valorTotal,
						}
					})
				}
				const contextProduto = {
					produtos: dadosProduto.map(dado => {
						return {
							id: dado.id,
							quantidade: dado.quantidade,
							valorUnitario: dado.valorUnitario,
							descricao: dado.descricao
						}
					})
				}
				res.render("compras/edit", {compra: compra, itensCompra: contextItensCompra.itensCompra, produtos: contextProduto.produtos})
			}).catch((erro) => {
				req.flash("msg_erro", "Erro ao listar os produtos!" + erro)
				res.redirect("/compras/index")
			})
		}).catch((erro) => {
			req.flash("msg_erro", "Erro ao buscar ou listar os itens da compra!")
			res.redirect("/compras/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao buscar ou listar essa compra!")
		res.redirect("/compras/index")
	})
}

exports.update = async (req, res) => {
	const itens = req.body.produtos
	const quantidade = req.body.quantidade
	const valorUnit = req.body.valorUnitario
	const subTotal = req.body.subTotal

	ItensCompra.destroy({where: {compraId: req.body.compraId}});

	for (var i = 0; i < itens.length; i++) {
		const itensCompra = new ItensCompra({
			quantidade: quantidade[i],
			valorUnitario: valorUnit[i],
			valorTotal: subTotal[i],
			desconto: req.body.desconto,
			compraId: req.body.compraId,
			produtoId: itens[i]
		})
		if(req.body.status === 'COMPRA'){
			const quantidadeCompra = parseInt(quantidade[i])
			Produto.findOne({where: {id: itens[i]}}).then((produto)=>{
				produto.quantidade += quantidadeCompra
				produto.save().then(() => {
				}).catch((erro) => {
					req.flash("msg_erro", "Não foi possível salvar itens da compra!")
					res.redirect("/compras/index")
				})
			}).catch((erro) => {
				req.flash("msg_erro", "Erro ao salvar essa compra!")
				res.redirect("/compras/index")
			})
		}
		itensCompra.save().then(() => {
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível salvar itens da Compra!" + erro)
			res.redirect("/compras/index")
		})
	}
	Compra.findByPk(id = req.body.compraId).then((compra) =>{
		compra.dataCompra = req.body.dataCompra,
		compra.valorTotal = req.body.valorTotal,
		compra.desconto = req.body.desconto,
		compra.condicaoPagamento = req.body.condicaoPagamento,
		compra.parcelas = req.body.parcelas,
		compra.status = req.body.status,
		compra.pessoaId = req.body.pessoaId,
		compra.usuarioId = req.body.usuarioId

		compra.save().then(() => {
			req.flash("msg_sucesso", "Compra alterada com sucesso!")
			res.redirect("/compras/index")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel salvar a alteração: " + erro)
			res.redirect("/compras/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel encontrar a compra: " + erro)
		res.redirect("/compras/index")
	})
}

exports.delete = async (req, res) => {
	ItensCompra.destroy({where: {compraId: req.body.id}}).then(() => {
		Compra.destroy({where: {id: req.body.id}}).then(() => {
			req.flash("msg_sucesso", "Compra deletada com sucesso!")
			res.redirect("/compras/index")
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Houve um erro ao deletar a Compra")
			res.redirect("/compras/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro: Houve um erro ao deletar os itens desta Compra")
		res.redirect("/compras/index")
	})
}

exports.estornar = async (req, res) => {
	Compra.update({ financeiro: 'nao', status: 'PEDIDO' }, { where: {id: req.params.id}}).then((compra) =>{
		ItensCompra.findAll({where: {compraId: req.params.id}}).then((itensCompra) => {
			for(var i = 0; i < itensCompra.length; i++){
				const quantidadeItensCompra = parseInt(itensCompra[i].quantidade)
				Produto.findOne({where: {id: itensCompra[i].produtoId}}).then((produto)=>{
					produto.quantidade -= quantidadeItensCompra
					produto.save().then(() => {
					}).catch((erro) => {
						req.flash("msg_erro", "Erro ao estornar essa Compra!")
						res.redirect("/compras/index")
					})
				}).catch((erro) => {
					req.flash("msg_erro", "Erro ao estornar essa Compra!")
					res.redirect("/compras/index")
				})
			}
		}).catch((erro) => {
			req.flash("msg_erro", "Erro ao estornar essa Compra!")
			res.redirect("/compras/index")
		})
		req.flash("msg_sucesso", "Compra estornada com sucesso!")
		res.redirect("/compras/index")
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao estornar essa Compra!")
		res.redirect("/compras/index")
	})
}

exports.historico = async (req, res) => {
	console.log('req.params.id', req.params.id);
	const historico = await ItensCompra.findAll({
		attributes: ['quantidade', 'valorUnitario'],
		include: [{
			model: Compra, as: 'compra',
			attributes: ['id', 'dataCompra'],
			where: {status: 'COMPRA'},
			include: [{
				model: Pessoa, as: 'pessoa',
				attributes: ['nome'],
			}]
		}],
		where: {produtoId: req.params.id}
	})

	return res.json(historico)
}

exports.gerarFinanceiro = async (req, res) => {
	const compra = await Compra.findByPk(req.body.compraId)

	const contaPagar = await ContasPagar.create({
		dataCompetencia: req.body.dataCompetencia,
		quantidadeDeParcelas: req.body.quantidadeDeParcelas,
		valorTotal: req.body.valorTotal,
		compraId: req.body.compraId,
		pessoaId: compra.pessoaId
	})

	var parcela = req.body.parcela
	var formaDePagamento = req.body.formaDePagamento
	var valorDaParcela = req.body.valorDaParcela
	var dataDeVencimento = req.body.dataDeVencimento
	var valorPago = req.body.valorPago
	var dataDePagamento = req.body.dataDePagamento
	var desconto = req.body.desconto
	var status = req.body.status

	for (var i = 0; i < parcela.length; i++) {
		if(!dataDePagamento[i] || typeof dataDePagamento[i] == undefined){
			dataDePagamento[i] = null;
		}
		const novaParcela = new ParcelaContaPagar({
			parcela: parcela[i],
			formaDePagamento: formaDePagamento[i],
			valorDaParcela: valorDaParcela[i],
			dataDeVencimento: dataDeVencimento[i],
			valorPago: valorPago[i],
			dataDePagamento: dataDePagamento[i],
			desconto: desconto[i],
			status: status[i],
			pagamentoId: contaPagar.id
		})

		novaParcela.save().then(() => {
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível gerar Financeiro" + erro)
			res.redirect("/vendas/list-vendas")
		})
	}
	compra.financeiro = 'sim'
	compra.save().then(() => {
		req.flash("msg_sucesso", "Financeiro gerado com sucesso!")
		res.redirect("/compras/index")
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível gerar Financeiro" + erro)
		res.redirect("/compras/index")
	})
}

exports.filter = (req, res) => {
	const { filterFornecedor, filterDataInicio, filterDataFim, filterStatus, filterFinanceiro, filterValorInicio, filterValorFim } = req.body
	let sql = `select C."id", P."nome" AS pessoa, C."status", C."financeiro", U."usuario", C."dataCompra", C."valorTotal" `
	+ `FROM "compras" AS C `
	+ `JOIN "pessoas" AS P ON C."pessoaId" = P."id" `
	+ `JOIN "usuarios" AS U ON C."usuarioId" = U."id" `
	+ `WHERE 1=1`;
	let filters = [];
	let values = {
		fornecedor: '',
		status: '',
		financeiro: '',
		dataInicio: '',
		dataFim: '',
		valorInicio: '',
		valorFim: ''
	}

	if (filterFornecedor !== '') {
		sql += ` AND P."nome" ~* '` + filterFornecedor + `'` ;
		filters.push('Fornecedor')
		values.fornecedor = filterFornecedor
	}
	if (filterStatus !== '') {
		sql += ` AND "status" = '` + filterStatus + `'` ;
		filters.push('Status')
		values.status = filterStatus
	}
	if (filterFinanceiro !== '') {
		sql += ` AND "financeiro" = '` + filterFinanceiro + `'` ;
		filters.push('Financeiro')
		values.financeiro = filterFinanceiro
	}
	// TEM QUE VALIDAR SE AS DUAS DATAS ESTÂO PREENCHIDAS
	if (filterDataInicio !== '' || filterDataFim !== '') {
		sql += ` AND (V."dataCompra" BETWEEN '` + filterDataInicio + `' AND '` + filterDataFim + `')`;
		filters.push('Periodo de: ' + filterDataInicio + ' Até: ' + filterDataFim)
		values.dataInicio = filterDataInicio
		values.dataFim = filterDataFim
	}

	if (filterValorInicio !== '' || filterValorFim !== '') {
		sql += ` AND (C."valorTotal" BETWEEN '` + filterValorInicio + `' AND '` + filterValorFim + `')`;
		filters.push('Valor de: ' + filterValorInicio + ' Até: ' + filterValorFim)
		values.valorInicio = filterValorInicio
		values.valorFim = filterValorFim
	}

	db.query(sql, { type: db.QueryTypes.SELECT}).then(compras => {
		res.render("compras/index", {compras: compras, filters: filters, values: values})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao filtrar: " + erro)
		res.redirect("compras/index")
	})
}
