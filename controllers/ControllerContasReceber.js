const db = require("../config/conexao")
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const ContasReceber = require("../models/ContasReceber")
const Venda = require("../models/Venda")
const Pessoa = require("../models/Pessoa")

exports.index = (req, res) => {
	ContasReceber.findAll({include: [{ model: Pessoa, as: 'pessoa' }]}).then((dadosContaReceber) => {
		Pessoa.findAll({where: {[Op.and]: [{funcao: 'Cliente'}, {ativo: 'Ativo'}]}}).then((dadosCliente) => {
			const contextContasReceber = {
				contasReceber: dadosContaReceber.map(dado => {
					return {
						id: dado.id,
						dataCompetencia: dado.dataCompetencia,
						quantidadeDeParcelas: dado.quantidadeDeParcelas,
						valorTotal: dado.valorTotal,
						desconto: dado.desconto,
						venda: dado.venda,
						pessoa: dado.pessoa.nome
					}
				})
			}

			const contextClientes = {
				clientes: dadosCliente.map(dado => {
					return {
						id: dado.id,
						nome: dado.nome
					}
				})
			}
			res.render("contas-receber/index", {contasReceber: contextContasReceber.contasReceber, clientes: contextClientes.clientes})
		}).catch(erro => {
			req.flash("error_msg", "Erro ao buscar ou listar Clientes!: " + erro)
			res.redirect("/index")
		})
	}).catch((erro) => {
		req.flash("error_msg", "Erro ao buscar ou listar Contas a Receber!: " + erro)
		res.redirect("/index")
	})
}

exports.store = (req, res) => {
	var dataPagamento = req.body.dataPagamento
	var desconto = req.body.descontoRecebimento

	if(!dataPagamento || typeof dataPagamento == undefined || dataPagamento == null){
		dataPagamento = null;
	}
	if(!desconto || typeof desconto == undefined || desconto == null || desconto == ''){
		desconto = 0;
	}

	const novoRecebimento = new ContasReceber({
		formaPagamento: req.body.formaPagamento,
		valor: req.body.valor,
		valorPago: req.body.valorPago,
		desconto: desconto,
		dataCompetencia: req.body.dataCompetencia,
		dataVencimento: req.body.dataVencimento,
		dataPagamento: dataPagamento,
		pago: req.body.pago,
		venda: req.body.venda,
		pessoaId: req.body.pessoaId
	})

	novoRecebimento.save().then(() => {
		req.flash("msg_sucesso", "Recebimento cadastrado com sucesso!")
		res.redirect("/contas-receber/index")
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível salvar Recebimento!"+ erro)
		res.redirect("/contas-receber/index")
	})
}

exports.destroy = (req, res) => {
	if(!req.body.venda || typeof req.body.venda == undefined || req.body.venda == null || req.body.venda == ''){
		ContasReceber.destroy({where: {id: req.body.id}}).then(() => {
			req.flash("msg_sucesso", "Recebimento deletado com sucesso!")
			res.redirect("/contas-receber/index")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível excluir este Recebimento!6" + erro)
			res.redirect("/contas-receber/index")
		})
	} else {
		ContasReceber.findAll({where: {venda: req.body.venda}}).then(recebimentos => {
			if(recebimentos.length > 1){
				ContasReceber.destroy({where: {id: req.body.id}}).then(() => {
					req.flash("msg_sucesso", "Recebimento deletado com sucesso!")
					res.redirect("/contas-receber/index")
				}).catch((erro) => {
					req.flash("msg_erro", "Não foi possível excluir este Recebimento!1" + erro)
					res.redirect("/contas-receber/index")
				})
			} else {
				Venda.findByPk(req.body.venda).then(venda => {
					venda.financeiro = 'nao';
					venda.save().then(() => {
						ContasReceber.destroy({ where: {id: req.body.id}}).then(() => {
							req.flash("msg_sucesso", "Recebimento deletado com sucesso!")
							res.redirect("/contas-receber/index")
						}).catch((erro) => {
							req.flash("msg_erro", "Não foi possível excluir este Recebimento!2" + erro)
							res.redirect("/contas-receber/index")
						})
					}).catch((erro) => {
						req.flash("msg_erro", "Não foi possível excluir este Recebimento!3" + erro)
						res.redirect("/contas-receber/index")
					})
				}).catch(erro => {
					req.flash("msg_erro", "Não foi possível excluir este Recebimento!4" + erro)
					res.redirect("/contas-receber/index")
				})
			}

		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível excluir este Recebimento!5" + erro)
			res.redirect("/contas-receber/index")
		})
	}

}

exports.update = (req, res) => {
	var dataPagamento = req.body.dataPagamento
	if(!dataPagamento || typeof dataPagamento == undefined || dataPagamento == null){
		dataPagamento = null;
	}
	ContasReceber.findByPk(req.body.id).then((contasReceber) =>{
		contasReceber.formaPagamento = req.body.formaPagamento,
		contasReceber.valor = req.body.valor,
		contasReceber.valorPago = req.body.valorPago,
		contasReceber.desconto = req.body.descontoRecebimento,
		contasReceber.dataCompetencia = req.body.dataCompetencia,
		contasReceber.dataVencimento = req.body.dataVencimento,
		contasReceber.dataPagamento = dataPagamento,
		contasReceber.pago = req.body.pago,
		contasReceber.venda = req.body.venda,
		contasReceber.pessoaId = req.body.pessoaId

		contasReceber.save().then(() => {
			req.flash("msg_sucesso", "Recebimento editado com sucesso!")
			res.redirect("/contas-receber/index")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível editar este Recebimento!" + erro)
			res.redirect("/contas-receber/index")
		})

	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível localizar o Recebimento!")
		res.redirect("/contas-receber/index")
	})
}
