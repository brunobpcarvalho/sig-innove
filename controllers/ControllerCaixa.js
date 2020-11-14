var db = require("../config/conexao")
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Caixa = require("../models/Caixa")
const Usuario = require("../models/Usuario")
const MovimentacaoCaixa = require("../models/MovimentacaoCaixa")
const PDFDocument = require("pdfkit")

exports.index = async (req, res) => {
	Caixa.findAll({include: [{ model: Usuario, as: 'usuario' }]}).then((dados) => {
		const contextCaixa = {
			caixas: dados.map(dado => {
				return {
					id: dado.id,
					usuario: dado.usuario.usuario,
					dataAbertura: dado.dataAbertura,
					troco: dado.troco,
					saldoFinaldoCaixa: dado.saldoFinaldoCaixa,
					status: dado.status,
				}
			})
		}
		res.render("caixa/index", {caixas: contextCaixa.caixas})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro: Não foi possível listar o histórico de Caixa!" + erro)
		res.redirect("/index")
	})
}

exports.create = async (req, res) => {
	await Caixa.create({
		dataAbertura: req.body.dataAbertura,
		troco: req.body.troco,
		totalEntradas: 0.00,
		totalSaidas: 0.00,
		saldoAtual: req.body.troco,
		usuarioId: req.body.usuarioId
	})
	req.flash("msg_sucesso", "Caixa aberto com sucesso!")
	res.redirect("/caixa/index")
}

exports.edit = async (req, res) => {
	MovimentacaoCaixa.findAll({where: {caixaId: req.params.id}, include: [{ model: Usuario, as: 'usuario' }]}).then((dadosMovCaixa) =>{
		Caixa.findByPk(req.params.id, {include: [{ model: Usuario, as: 'usuario'}]}).then((dadosCaixa) =>{
			const caixa = {
				id: dadosCaixa.id,
				usuario: dadosCaixa.usuario.nome,
				dataAbertura: dadosCaixa.dataAbertura,
				dataFechamento: dadosCaixa.dataFechamento,
				troco: dadosCaixa.troco,
				saldoFinaldoSistema: dadosCaixa.saldoFinaldoSistema,
				saldoAtual: dadosCaixa.saldoAtual,
				totalEntradas: dadosCaixa.totalEntradas,
				totalSaidas: dadosCaixa.totalSaidas,
				saldoFinaldoCaixa: dadosCaixa.saldoFinaldoCaixa,
				observacao: dadosCaixa.observacao,
				status: dadosCaixa.status,
				usuarioId: dadosCaixa.usuario.id
			}

			const contextMovCaixa = {
				movCaixa: dadosMovCaixa.map(dado => {
					return {
						horaDaMovimentacao: dado.horaDaMovimentacao,
						origem: dado.origem,
						tipoDeRecebimento: dado.tipoDeRecebimento,
						tipoDeMovimento: dado.tipoDeMovimento,
						valor: dado.valor,
						usuario: dado.usuario.nome
					}
				})
			}
			res.render("caixa/edit", {caixa: caixa, movCaixa: contextMovCaixa.movCaixa})
		}).catch((erro) => {
			console.log('erro', erro);
			req.flash("msg_erro", "Erro ao visualizar caixa!" + erro)
			res.redirect("/caixa/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao visualizar caixa!" + erro)
		res.redirect("/caixa/index")
	})
}

exports.destroy = async (req, res) => {
	MovimentacaoCaixa.destroy({where: {caixaId: req.body.id}}).then(() => {
		Caixa.destroy({where: {id: req.body.id}}).then(() => {
			req.flash("msg_sucesso", "Caixa excluido com sucesso!")
			res.redirect("/caixa/index")
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possível excluir este Caixa!4" + erro)
			res.redirect("/caixa/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possível excluir este Caixa!4" + erro)
		res.redirect("/caixa/index")
	})
}

exports.verificaCaixaAberto = async (req, res) => {
	const caixaAberto = await Caixa.findAll({where: {status: 'aberto'}}).then((caixaAberto) => {
		if(caixaAberto.length > 0){
			res.send(true)
		} else {
			res.send(false)
		}
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao visualizar caixa!" + erro)
		res.redirect("/caixa/index")
	})
}

exports.fecharCaixa = async (req, res) => {
	Caixa.findByPk(req.body.id).then((caixa) => {
		caixa.saldoFinaldoSistema = req.body.saldoFinaldoSistema,
		caixa.saldoFinaldoCaixa = req.body.saldoFinaldoCaixa,
		caixa.dataFechamento = req.body.dataFechamento,
		caixa.observacao = req.body.observacao,
		caixa.status = req.body.status

		caixa.save().then(() => {
			req.flash("msg_sucesso", "Caixa fechado com sucesso!")
			res.redirect("/caixa/edit/" + req.body.id)
		}).catch((erro) => {
			req.flash("msg_erro", "Não foi possivel salvar a alteração: " + erro)
			res.redirect("/caixa/edit/" + req.body.id)
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao visualizar caixa!" + erro)
		res.redirect("/caixa/edit/" + req.body.id)
	})
}

exports.adicionarRemoverDinheiro = async (req, res) => {
	const movCaixa = new MovimentacaoCaixa({
		horaDaMovimentacao: req.body.horaDaMovimentacao,
		origem: req.body.origem,
		tipoDeRecebimento: req.body.tipoDeRecebimento,
		tipoDeMovimento: req.body.tipoDeMovimento,
		valor: req.body.valor,
		caixaId: req.body.caixaId,
		usuarioId: req.body.usuarioId,
	})

	await Caixa.findByPk(movCaixa.caixaId).then((caixa) => {
		if(movCaixa.tipoDeMovimento === 'Entrada'){
			var totalEntradas = parseFloat(caixa.totalEntradas) + parseFloat(movCaixa.valor)
			var saldoAtual = parseFloat(caixa.saldoAtual) + parseFloat(movCaixa.valor)
			caixa.totalEntradas = totalEntradas,
			caixa.saldoAtual = saldoAtual
		} else {
			var totalSaidas = parseFloat(caixa.totalSaidas) + parseFloat(movCaixa.valor)
			var saldoAtual = parseFloat(caixa.saldoAtual) - parseFloat(movCaixa.valor)
			caixa.totalSaidas = totalSaidas,
			caixa.saldoAtual = saldoAtual
		}

		caixa.save().then(() => {

		}).catch((erro) => {
			req.flash("msg_erro", "Erro na Movimentação" + erro)
			res.redirect("/caixa/edit/" + movCaixa.caixaId)
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro na Movimentação" + erro)
		res.redirect("/caixa/edit/" + movCaixa.caixaId)
	})

	movCaixa.save().then(() => {
		req.flash("msg_sucesso", "Movimentação realizada com sucesso!")
		res.redirect("/caixa/edit/" + movCaixa.caixaId)
	}).catch((erro) => {
		req.flash("msg_erro", "Erro na Movimentação" + erro)
		res.redirect("/caixa/edit/" + movCaixa.caixaId)
	})
}

exports.movimentosCaixa = async (req, res) => {
	var query = 'SELECT "origem", "tipoDeRecebimento", Sum("valor") AS "valor"' +
				'FROM "mov_caixas" ' +
				'WHERE "caixaId" = ' + req.params.id +
				' GROUP BY "origem", "tipoDeRecebimento"'

	db.query(query, { type: db.QueryTypes.SELECT}).then((movimentosCaixa) => {
		var x = (0.00).toFixed(2)
		var movCaixa = {
			dinheiro: x,
			cartao: x,
			reforco: x,
			pagamentos: x,
			retiradas: x
		}

		for (var i = 0; i < movimentosCaixa.length; i++) {
			if (movimentosCaixa[i].tipoDeRecebimento == 'Dinheiro') {
				movCaixa.dinheiro = movimentosCaixa[i].valor
			}
			if (movimentosCaixa[i].tipoDeRecebimento == 'CartaoC' || movimentosCaixa[i].formaRecPag == 'CartaoD') {
				movCaixa.cartao = movimentosCaixa[i].valor
			}
			if (movimentosCaixa[i].origem == 'Reforço') {
				movCaixa.reforco = movimentosCaixa[i].valor
			}
			if (movimentosCaixa[i].origem == 'Pagamento') {
				movCaixa.pagamentos = movimentosCaixa[i].valor
			}
			if (movimentosCaixa[i].origem == 'Retirada') {
				movCaixa.retiradas = movimentosCaixa[i].valor
			}
		}
		console.log('movCaixa', movCaixa);
		return res.json(movCaixa)
	}).catch((erro) => {
		req.flash("msg_erro", "Erro na Movimentação" + erro)
		res.redirect("/caixa/edit/" + req.body.caixaId)
	})
}

/*exports.update = async (req, res) => {
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
}*/
