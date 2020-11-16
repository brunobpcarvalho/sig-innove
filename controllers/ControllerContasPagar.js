const db = require("../config/conexao")
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const ContasPagar = require("../models/ContasPagar")
const Compra = require("../models/Compra")
const Pessoa = require("../models/Pessoa")
const ParcelaContaPagar = require("../models/ParcelaContaPagar")
const Caixa = require("../models/Caixa")
const MovimentacaoCaixa = require("../models/MovimentacaoCaixa")

exports.index = (req, res) => {
	ContasPagar.findAll({include: [{ model: Pessoa, as: 'pessoa' }]}).then((dadosContaPagar) => {
		Pessoa.findAll({where: {[Op.and]: [{funcao: 'Fornecedor'}, {ativo: 'Ativo'}]}}).then((dadosFornecedor) => {
			const contextContasPagar = {
				contasPagar: dadosContaPagar.map(dado => {
					return {
						id: dado.id,
						dataCompetencia: dado.dataCompetencia,
						quantidadeDeParcelas: dado.quantidadeDeParcelas,
						valorTotal: dado.valorTotal,
						desconto: dado.desconto,
						compraId: dado.compraId,
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
			req.flash("msg_erro", "Erro ao buscar ou listar Fornecedores!: " + erro)
			res.redirect("/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao buscar ou listar Contas a Pagar!: " + erro)
		res.redirect("/index")
	})
}

exports.create = async (req, res) => {
	const pagamento = await ContasPagar.create({ dataCompetencia, quantidadeDeParcelas, valorTotal, pessoaId } = req.body)

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
		const parcelaContaPagar = new ParcelaContaPagar({
			parcela: parcela[i],
			formaDePagamento: formaDePagamento[i],
			valorDaParcela: valorDaParcela[i],
			dataDeVencimento: dataDeVencimento[i],
			valorPago: valorPago[i],
			dataDePagamento: dataDePagamento[i],
			desconto: desconto[i],
			status: status[i],
			pagamentoId: pagamento.id
		})

		const caixaAberto = await Caixa.findOne({where: {status: 'aberto'}})

		if(parcelaContaPagar.status === true && caixaAberto != null){
			var horaDaMovimentacao = new Date().DataHoraAtual()

			const movCaixa = new MovimentacaoCaixa({
				horaDaMovimentacao: horaDaMovimentacao,
				origem: 'Pagamento',
				tipoDeRecebimento: parcelaContaPagar.formaDePagamento,
				tipoDeMovimento: 'Saida',
				valor: parcelaContaPagar.valorPago,
				pagamentoId: pagamento.id,
				caixaId: caixaAberto.id,
				usuarioId: req.body.usuarioId,
			})

			var totalSaidas = parseFloat(caixaAberto.totalSaidas) + parseFloat(parcelaContaPagar.valorPago)
			var saldoAtual = parseFloat(caixaAberto.saldoAtual) - parseFloat(parcelaContaPagar.valorPago)

			caixaAberto.totalSaidas = totalSaidas,
			caixaAberto.saldoAtual = saldoAtual

			await caixaAberto.save().then(() => {
			}).catch((erro) => {
				req.flash("msg_erro", "Erro: Não foi possível salvar Recebimento!" + erro)
				res.redirect("/contas-receber/index")
			})

			await movCaixa.save().then(() => {
			}).catch((erro) => {
				req.flash("msg_erro", "Erro: Não foi possível salvar Recebimento!" + erro)
				res.redirect("/contas-receber/index")
			})
		}

		parcelaContaPagar.save().then(() => {
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível salvar Pagamento!" + erro)
			res.redirect("/contas-pagar/index")
		})
	}
	req.flash("msg_sucesso", "Pagamento salvo com sucesso!")
	res.redirect("/contas-pagar/index")
}

exports.destroy = async (req, res) => {

	const movCaixa = await MovimentacaoCaixa.findAll({where: {pagamentoId: req.body.id}})

	if(movCaixa.length < 1){
		ParcelaContaPagar.destroy({where: {pagamentoId: req.body.id}}).then(() => {
			if(!req.body.compra || typeof req.body.compra == undefined || req.body.compra == null || req.body.compra == ''){
				ContasPagar.destroy({where: {id: req.body.id}}).then(() => {
					req.flash("msg_sucesso", "Pagamento deletado com sucesso!")
					res.redirect("/contas-pagar/index")
				}).catch((erro) => {
					req.flash("msg_erro", "Não foi possível excluir este Pagamento!6" + erro)
					res.redirect("/contas-pagar/index")
				})
			} else {
				Compra.findByPk(req.body.compra).then(compra => {
					compra.financeiro = 'nao';
					compra.save().then(() => {
						ContasPagar.destroy({ where: {id: req.body.id}}).then(() => {
							req.flash("msg_sucesso", "Pagamento deletado com sucesso!")
							res.redirect("/contas-pagar/index")
						}).catch((erro) => {
							req.flash("msg_erro", "Não foi possível excluir este Pagamento!2" + erro)
							res.redirect("/contas-pagar/index")
						})
					}).catch((erro) => {
						req.flash("msg_erro", "Não foi possível excluir este Pagamento!3" + erro)
						res.redirect("/contas-pagar/index")
					})
				}).catch(erro => {
					req.flash("msg_erro", "Não foi possível excluir este Pagamento!4" + erro)
					res.redirect("/contas-pagar/index")
				})
			}
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível excluir este Pagamento!4" + erro)
			res.redirect("/contas-pagar/index")
		})
	}else {
		req.flash("msg_erro", "Não é possivel excluir este pagamento, pois está vinculada a um registro!")
		res.redirect("/pessoas/list-pessoas")
	}
}

exports.edit = (req, res) => {
	ContasPagar.findByPk(req.params.id, {include: [{ model: Pessoa, as: 'pessoa' }]}).then((dadosContaPagar) =>{
		ParcelaContaPagar.findAll({where: {pagamentoId: req.params.id}}).then((dadosParcelaContaPagar) =>{
			const pagamento = {
				id: dadosContaPagar.id,
				pessoaId: dadosContaPagar.pessoa.id,
				pessoaNome: dadosContaPagar.pessoa.nome,
				dataCompetencia: dadosContaPagar.dataCompetencia,
				quantidadeDeParcelas: dadosContaPagar.quantidadeDeParcelas,
				valorTotal: dadosContaPagar.valorTotal,
				compraId: dadosContaPagar.compraId
			}
			const contextParcelaContaPagar = {
				parcelas: dadosParcelaContaPagar.map(dado => {
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
			res.render("contas-pagar/edit", {pagamento: pagamento, parcelaContaPagar: contextParcelaContaPagar.parcelas})
		}).catch((erro) => {
			req.flash("msg_erro", "Erro ao buscar as parcelas do pagamento!")
			res.redirect("/contas-pagar/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao buscar o pagamento!")
		res.redirect("/contas-pagar/index")
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

	ParcelaContaPagar.destroy({where: {pagamentoId: req.body.id}});

	for (var i = 0; i < parcela.length; i++) {
		if(!dataDePagamento[i] || typeof dataDePagamento[i] == undefined){
			dataDePagamento[i] = null;
		}
		const parcelaContaPagar = new ParcelaContaPagar({
			parcela: parcela[i],
			formaDePagamento: formaDePagamento[i],
			valorDaParcela: valorDaParcela[i],
			dataDeVencimento: dataDeVencimento[i],
			valorPago: valorPago[i],
			dataDePagamento: dataDePagamento[i],
			desconto: desconto[i],
			status: status[i],
			pagamentoId: req.body.id
		})
		parcelaContaPagar.save().then(() => {
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível salvar Pagamento!" + erro)
			res.redirect("/contas-pagar/index")
		})
	}
	ContasPagar.findByPk(id = req.body.id).then((pagamento) =>{
		pagamento.dataCompetencia = req.body.dataCompetencia,
		pagamento.quantidadeDeParcelas = req.body.quantidadeDeParcelas,
		pagamento.valorTotal = req.body.valorTotal,

		pagamento.save().then(() => {
			req.flash("msg_sucesso", "Pagamento alterado com sucesso!")
			res.redirect("/contas-pagar/index")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel salvar a alteração: " + erro)
			res.redirect("/contas-pagar/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel encontrar o pagamento: " + erro)
		res.redirect("/contas-pagar/index")
	})
}
