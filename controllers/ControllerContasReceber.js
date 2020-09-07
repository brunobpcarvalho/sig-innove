const db = require("../config/conexao")
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const ContasReceber = require("../models/ContasReceber")
const Venda = require("../models/Venda")
const Pessoa = require("../models/Pessoa")
const ParcelaContaReceber = require("../models/ParcelaContaReceber")

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
						vendaId: dado.vendaId,
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

exports.store = async (req, res) => {
	const recebimento = await ContasReceber.create({ dataCompetencia, quantidadeDeParcelas, valorTotal, pessoaId } = req.body)

	const parcela = req.body.parcela
	const formaDePagamento = req.body.formaDePagamento
	const valorDaParcela = req.body.valorDaParcela
	const dataDeVencimento = req.body.dataDeVencimento
	const valorPago = req.body.valorPago
	const dataDePagamento = req.body.dataDePagamento
	const desconto = req.body.desconto
	const status = req.body.status

	for (var i = 0; i < parcela.length; i++) {
		if(!dataDePagamento[i] || typeof dataDePagamento[i] == undefined){
			dataDePagamento[i] = null;
		}
		const parcelaContaReceber = new ParcelaContaReceber({
			parcela: parcela[i],
			formaDePagamento: formaDePagamento[i],
			valorDaParcela: valorDaParcela[i],
			dataDeVencimento: dataDeVencimento[i],
			valorPago: valorPago[i],
			dataDePagamento: dataDePagamento[i],
			desconto: desconto[i],
			status: status[i],
			recebimentoId: recebimento.id
		})
		parcelaContaReceber.save().then(() => {
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível salvar Recebimento!" + erro)
			res.redirect("/contas-receber/index")
		})
	}
	req.flash("msg_sucesso", "Recebimento salvo com sucesso!")
	res.redirect("/contas-receber/index")
}

exports.destroy = (req, res) => {
	ParcelaContaReceber.destroy({where: {recebimentoId: req.body.id}}).then(() => {
		if(!req.body.venda || typeof req.body.venda == undefined || req.body.venda == null || req.body.venda == ''){
			ContasReceber.destroy({where: {id: req.body.id}}).then(() => {
				req.flash("msg_sucesso", "Recebimento deletado com sucesso!")
				res.redirect("/contas-receber/index")
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possível excluir este Recebimento!6" + erro)
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
		req.flash("msg_erro", "Não foi possível excluir este Recebimento!4" + erro)
		res.redirect("/contas-receber/index")
	})
}

exports.edit = (req, res) => {
	ContasReceber.findByPk(req.params.id, {include: [{ model: Pessoa, as: 'pessoa' }]}).then((dadosContaReceber) =>{
		ParcelaContaReceber.findAll({where: {recebimentoId: req.params.id}}).then((dadosParcelaContaReceber) =>{
			const recebimento = {
				id: dadosContaReceber.id,
				pessoaId: dadosContaReceber.pessoa.id,
				pessoaNome: dadosContaReceber.pessoa.nome,
				dataCompetencia: dadosContaReceber.dataCompetencia,
				quantidadeDeParcelas: dadosContaReceber.quantidadeDeParcelas,
				valorTotal: dadosContaReceber.valorTotal,
				vendaId: dadosContaReceber.vendaId
			}
			const contextParcelaContaReceber = {
				parcelas: dadosParcelaContaReceber.map(dado => {
					return {
						id: dado.id,
						parcela: dado.parcela,
						formaDePagamento: dado.formaDePagamento,
						valorDaParcela: dado.valorDaParcela,
						dataDeVencimento: dado.dataDeVencimento,
						valorPago: dado.valorPago,
						dataDePagamento: dado.dataDePagamento,
						desconto: dado.desconto,
						status: dado.status
					}
				})
			}
			res.render("contas-receber/edit", {recebimento: recebimento, parcelaContaReceber: contextParcelaContaReceber.parcelas})
		}).catch((erro) => {
			req.flash("error_msg", "Erro ao buscar as parcelas do recebimento!")
			res.redirect("/contas-receber/index")
		})
	}).catch((erro) => {
		req.flash("error_msg", "Erro ao buscar o recebimento!")
		res.redirect("/contas-receber/index")
	})
}

exports.update = (req, res) => {
	const parcela = req.body.parcela
	const formaDePagamento = req.body.formaDePagamento
	const valorDaParcela = req.body.valorDaParcela
	const dataDeVencimento = req.body.dataDeVencimento
	const valorPago = req.body.valorPago
	const dataDePagamento = req.body.dataDePagamento
	const desconto = req.body.desconto
	const status = req.body.status

	ParcelaContaReceber.destroy({where: {recebimentoId: req.body.id}});

	for (var i = 0; i < parcela.length; i++) {
		if(!dataDePagamento[i] || typeof dataDePagamento[i] == undefined){
			dataDePagamento[i] = null;
		}
		const parcelaContaReceber = new ParcelaContaReceber({
			parcela: parcela[i],
			formaDePagamento: formaDePagamento[i],
			valorDaParcela: valorDaParcela[i],
			dataDeVencimento: dataDeVencimento[i],
			valorPago: valorPago[i],
			dataDePagamento: dataDePagamento[i],
			desconto: desconto[i],
			status: status[i],
			recebimentoId: req.body.id
		})
		parcelaContaReceber.save().then(() => {
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível salvar Recebimento!" + erro)
			res.redirect("/contas-receber/index")
		})
	}
	ContasReceber.findByPk(id = req.body.id).then((recebimento) =>{
		recebimento.dataCompetencia = req.body.dataCompetencia,
		recebimento.quantidadeDeParcelas = req.body.quantidadeDeParcelas,
		recebimento.valorTotal = req.body.valorTotal,

		recebimento.save().then(() => {
			req.flash("msg_sucesso", "Recebimento alterado com sucesso!")
			res.redirect("/contas-receber/index")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel salvar a alteração: " + erro)
			res.redirect("/contas-receber/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel encontrar o recebimento: " + erro)
		res.redirect("/contas-receber/index")
	})
}
