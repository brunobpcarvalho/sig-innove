const db = require("../config/conexao")
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const ContasPagar = require("../models/ContasPagar")
//const Venda = require("../models/Venda")
const Pessoa = require("../models/pessoa")

exports.index = (req, res) => {
	ContasPagar.findAll({include: [{ model: Pessoa, as: 'pessoa' }]}).then((dadosContaPagar) => {
		Pessoa.findAll({where: {[Op.and]: [{funcao: 'Fornecedor'}, {ativo: 'Ativo'}]}}).then((dadosFornecedor) => {
			const contextContasPagar = {
				contasPagar: dadosContaPagar.map(dado => {
					return {
						id: dado.id,
						formaPagamento: dado.formaPagamento,
						valor: dado.valor,
						valorPago: dado.valorPago,
						desconto: dado.desconto,
						dataCompetencia: dado.dataCompetencia,
						dataVencimento: dado.dataVencimento,
						dataPagamento: dado.dataPagamento,
						pago: dado.pago,
						compra: dado.compra,
						pessoa: dado.pessoa.nome
					}
				})
			}

			const contextFornecedores = {
				fornecedores: dadosFornecedor.map(dado => {
					return {
						id: dado.id,
						nome: dado.nome
					}
				})
			}
			res.render("contas-pagar/index", {contasPagar: contextContasPagar.contasPagar, fornecedores: contextFornecedores.fornecedores})
		}).catch(erro => {
			req.flash("error_msg", "Erro ao buscar ou listar Clientes!: " + erro)
			res.redirect("/index")
		})

	}).catch((erro) => {
		req.flash("error_msg", "Erro ao buscar ou listar Contas a Pagar!: " + erro)
		res.redirect("/index")
	})
}

exports.store = (req, res) => {
	var dataPagamento = req.body.dataPagamento
	var desconto = req.body.descontoPagamento

	if(!dataPagamento || typeof dataPagamento == undefined || dataPagamento == null){
		dataPagamento = null;
	}
	if(!desconto || typeof desconto == undefined || desconto == null || desconto == ''){
		desconto = 0;
	}

	const novoPagamento = new ContasPagar({
		formaPagamento: req.body.formaPagamento,
		valor: req.body.valor,
		valorPago: req.body.valorPago,
		desconto: desconto,
		dataCompetencia: req.body.dataCompetencia,
		dataVencimento: req.body.dataVencimento,
		dataPagamento: dataPagamento,
		pago: req.body.pago,
		compra: req.body.compra,
		pessoaId: req.body.pessoaId
	})

	novoPagamento.save().then(() => {
		req.flash("msg_sucesso", "Pagamento cadastrado com sucesso!")
		res.redirect("/contas-pagar/index")
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível salvar Pagamento!"+ erro)
		res.redirect("/contas-pagar/index")
	})
}

exports.destroy = (req, res) => {
	ContasPagar.destroy({ where: {id: req.body.id}}).then(() => {
		req.flash("msg_sucesso", "Pagamento deletado com sucesso!")
		res.redirect("/contas-pagar/index")
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível excluir este Pagamento!")
		res.redirect("/contas-pagar/index")
	})
}

exports.update = (req, res) => {
	var dataPagamento = req.body.dataPagamento
	if(!dataPagamento || typeof dataPagamento == undefined || dataPagamento == null){
		dataPagamento = null;
	}
	ContasPagar.findByPk(req.body.id).then((contasPagar) =>{
		contasPagar.formaPagamento = req.body.formaPagamento,
		contasPagar.valor = req.body.valor,
		contasPagar.valorPago = req.body.valorPago,
		contasPagar.desconto = req.body.descontoPagamento,
		contasPagar.dataCompetencia = req.body.dataCompetencia,
		contasPagar.dataVencimento = req.body.dataVencimento,
		contasPagar.dataPagamento = dataPagamento,
		contasPagar.pago = req.body.pago,
		contasPagar.compra = req.body.compra,
		contasPagar.pessoaId = req.body.pessoaId

		contasPagar.save().then(() => {
			req.flash("msg_sucesso", "Pagamento editado com sucesso!")
			res.redirect("/contas-pagar/index")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível editar este Pagamento!" + erro)
			res.redirect("/contas-pagar/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível localizar o Pagamento!")
		res.redirect("/contas-pagar/index")
	})
}
