const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Venda = require("../models/Venda")
const Usuario = require("../models/usuario")
const Pessoa = require("../models/pessoa")
const Produto = require("../models/produto")
const Parcela = require("../models/Parcela")
const ItensVenda = require("../models/ItensVenda")
const ContasReceber = require("../models/ContasReceber")
const Empresa = require("../models/Empresa")
const PDFDocument = require("pdfkit")

exports.listAll = (req, res) => {
	Venda.findAll({include: [{ model: Pessoa, as: 'pessoa' }, { model: Usuario, as: 'usuario' }]}).then((dadosVenda) => {
		const contextVenda = {
			vendas: dadosVenda.map(dado => {
				return {
					id: dado.id,
					pessoa: dado.pessoa.nome,
					status: dado.status,
					usuario: dado.usuario.usuario,
					dataVenda: dado.dataVenda,
					valorTotal: dado.valorTotal,
					financeiro: dado.financeiro
				}
			})
		}
		res.render("vendas/list-vendas", {vendas: contextVenda.vendas})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro: Não foi possível listar a pagina de Venda!" + erro)
		res.redirect("/index")
	})
}

exports.addVenda = (req, res) => {
	Pessoa.findAll({where: {[Op.and]: [{funcao: 'Cliente'}, {ativo: 'Ativo'}]}}).then((dadosCliente) => {
		Produto.findAll({where: {ativo: 'Ativo'}}, {attributes: ['id', 'quantidade', 'valorUnitario', 'descricao']}).then((dadosProduto) => {
			const contextPessoa = {
				clientes: dadosCliente.map(dado => {
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
						valorUnitario: dado.valorUnitario,
						quantidade: dado.quantidade,
					}
				})
			}
			res.render("vendas/add-venda", {produtos: contextProduto.produtos, clientes: contextPessoa.clientes})
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível listar os Produtos")
			res.redirect("/index")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro: Não foi possível listar os Clientes!")
		res.redirect("/index")
	})
}

exports.add = async (req, res) => {
	const venda = await Venda.create({ usuarioId, pessoaId, dataVenda, valorTotal, desconto, status } = req.body)

	const itens = req.body.produtos
	const quantidade = req.body.quantidade
	const valorUnit = req.body.valorUnitario
	const subTotal = req.body.subTotal
	const parcelas = req.body.parcelas

	const formaPagamento = req.body.formaPagamento
	const dataParcela = req.body.dataParcela
	const valorParcela = req.body.valorParcela

	for (var i = 0; i < parcelas; i++) {
		const parcela = await Parcela.create({
			formaPagamento: formaPagamento[i],
			vencimento: dataParcela[i],
			valor: valorParcela[i],
			vendaId: venda.id
		})
	}

	for (var i = 0; i < itens.length; i++) {
		const itensVenda = new ItensVenda({
			quantidade: quantidade[i],
			valorUnitario: valorUnit[i],
			valorTotal: subTotal[i],
			desconto: req.body.desconto,
			vendaId: venda.id,
			produtoId: itens[i]
		})
		if(venda.status === 'VENDA'){
			const quantidadeVenda = quantidade[i]
			Produto.findOne({where: {id: itens[i]}}).then((produto)=>{
				produto.quantidade -= quantidadeVenda
				produto.save().then(() => {
				}).catch((erro) => {
					req.flash("msg_erro", "Erro: Não foi possível salvar itens da venda!")
					res.redirect("/vendas/list-vendas")
				})
			}).catch((erro) => {
				req.flash("msg_erro", "Erro: Não foi possível salvar itens da venda!" + erro)
				res.redirect("/vendas/list-vendas")
			})
		}
		itensVenda.save().then(() => {
			req.flash("msg_sucesso", "Venda realizada com sucesso!")
			res.redirect("/vendas/list-vendas")
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível salvar itens da venda!" + erro)
			res.redirect("/vendas/list-vendas")
		})
	}
}

exports.delete = (req, res) => {
	Venda.findOne({where: {id: req.body.id}}).then(venda => {
		if(venda.financeiro === 'sim' || venda.status === "VENDA"){

		}
	}).catch(erro =>{

	})
	Parcela.destroy({where: {vendaId: req.body.id}}).then(() => {
		ItensVenda.destroy({where: {vendaId: req.body.id}}).then(() => {
			Venda.destroy({where: {id: req.body.id}}).then(() => {
				req.flash("msg_sucesso", "Venda deletada com sucesso!")
				res.redirect("/vendas/list-vendas")
			}).catch((erro) => {
				req.flash("msg_erro", "Erro: Houve um erro ao deletar a venda")
				res.redirect("/vendas/list-vendas")
			})
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Houve um erro ao deletar os itens desta venda")
			res.redirect("/vendas/list-vendas")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro: Houve um erro ao deletar as Parcelas desta venda")
		res.redirect("/vendas/list-vendas")
	})
}

exports.updateVenda = (req, res) => {
	Venda.findByPk(req.params.id, {include: [{ model: Pessoa, as: 'pessoa' }, { model: Usuario, as: 'usuario'}]}).then((dadosVenda) =>{
		ItensVenda.findAll({where: {vendaId: req.params.id}, include: [{ model: Produto, as: 'produto' }]}).then((dadosItensVenda) =>{
			Parcela.findAll({where: {vendaId: req.params.id}}).then((dadosParcela) =>{
				Produto.findAll({attributes: ['id', 'quantidade', 'valorUnitario', 'descricao']}).then((dadosProduto) => {

					const venda = {
						id: dadosVenda.id,
						pessoaId: dadosVenda.pessoa.id,
						pessoaNome: dadosVenda.pessoa.nome,
						status: dadosVenda.status,
						dataVenda: dadosVenda.dataVenda,
						usuarioId: dadosVenda.usuario.id,
						usuario: dadosVenda.usuario.usuario,
						desconto: dadosVenda.desconto,
						valorTotal: dadosVenda.valorTotal,
					}
					const contextItensVenda = {
						itensVenda: dadosItensVenda.map(dado => {
							return {
								descricaoProduto: dado.produto.descricao,
								quantidade: dado.quantidade,
								valorUnitario: dado.valorUnitario,
								valorTotal: dado.valorTotal,
							}
						})
					}
					const contextParcela = {
						parcelas: dadosParcela.map(dado => {
							return {
								formaPagamento: dado.formaPagamento,
								vencimento: dado.vencimento,
								valor: dado.valor,
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
					res.render("vendas/edit-venda", {venda: venda, itensVenda: contextItensVenda.itensVenda, parcelas: contextParcela.parcelas, produtos: contextProduto.produtos})
				}).catch((erro) => {
					req.flash("error_msg", "Erro ao listar os produtos!" + erro)
					res.redirect("/vendas/list-vendas")
				})
			}).catch((erro) => {
				req.flash("error_msg", "Erro ao buscar ou listar as pacelas da venda!")
				res.redirect("/vendas/list-vendas")
			})
		}).catch((erro) => {
			req.flash("error_msg", "Erro ao buscar ou listar os itens da venda!")
			res.redirect("/vendas/list-vendas")
		})
	}).catch((erro) => {
		req.flash("error_msg", "Erro ao buscar ou listar essa venda!")
		res.redirect("/vendas/list-vendas")
	})
}

exports.update = async (req, res) => {
	const itens = req.body.produtos
	const quantidade = req.body.quantidade
	const valorUnit = req.body.valorUnitario
	const subTotal = req.body.subTotal
	const parcelas = req.body.parcelas

	const formaPagamento = req.body.formaPagamento
	const dataParcela = req.body.dataParcela
	const valorParcela = req.body.valorParcela
	ItensVenda.destroy({
		where: {
			vendaId: req.body.vendaId
		}
	});
	Parcela.destroy({
		where: {
			vendaId: req.body.vendaId
		}
	});

	for (var i = 0; i < parcelas; i++) {
		const parcela = await Parcela.create({
			formaPagamento: formaPagamento[i],
			vencimento: dataParcela[i],
			valor: valorParcela[i],
			vendaId: req.body.vendaId
		})
	}

	for (var i = 0; i < itens.length; i++) {
		const itensVenda = new ItensVenda({
			quantidade: quantidade[i],
			valorUnitario: valorUnit[i],
			valorTotal: subTotal[i],
			desconto: req.body.desconto,
			vendaId: req.body.vendaId,
			produtoId: itens[i]
		})
		if(req.body.status === 'VENDA'){
			const quantidadeVenda = quantidade[i]
			Produto.findOne({where: {id: itens[i]}}).then((produto)=>{
				produto.quantidade -= quantidadeVenda
				produto.save().then(() => {
				}).catch((erro) => {
					req.flash("msg_erro", "Erro: Não foi possível salvar itens da venda!")
					res.redirect("/vendas/list-vendas")
				})
			}).catch((erro) => {
				console.log(erro)
			})
		}
		itensVenda.save().then(() => {
			Venda.findByPk(id = req.body.vendaId).then((venda) =>{
				venda.dataVenda = req.body.dataVenda,
				venda.valorTotal = req.body.valorTotal,
				venda.desconto = req.body.desconto,
				venda.condicaoPagamento = req.body.condicaoPagamento,
				venda.status = req.body.status,
				venda.pessoaId = req.body.pessoaId,
				venda.usuarioId = req.body.usuarioId

				venda.save().then(() => {
					req.flash("msg_sucesso", "Venda alterada com sucesso!")
					res.redirect("/vendas/list-vendas")
				}).catch((erro) => {
					req.flash("msg_erro", "Não foi possivel salvar a alteração: " + erro)
					res.redirect("/vendas/list-vendas")
				})
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possivel encontrar a venda: " + erro)
				res.redirect("/vendas/list-vendas")
			})
		}).catch((erro) => {
			req.flash("msg_erro", "Erro: Não foi possível salvar itens da venda!" + erro)
			res.redirect("/vendas/list-vendas")
		})
	}
}

exports.gerarFinanceiro = (req, res) => {
	Venda.findByPk(req.params.id).then(venda => {
		Parcela.findAll({ where: {vendaId: venda.id}}).then(parcelas => {
			for (var i = 0; i < parcelas.length; i++) {
				const novoRecebimento = new ContasReceber({
					formaPagamento: parcelas[i].formaPagamento,
					valor: parcelas[i].valor,
					dataCompetencia: venda.dataVenda,
					dataVencimento: parcelas[i].vencimento,
					venda: venda.id,
					pessoaId: venda.pessoaId
				})

				novoRecebimento.save().then(() => {
				}).catch((erro) => {
					req.flash("msg_erro", "Não foi possível gerar Financeiro" + erro)
					res.redirect("/vendas/list-vendas")
				})
			}
			venda.financeiro = 'sim'
			venda.save().then(() => {
				req.flash("msg_sucesso", "Financeiro gerado com sucesso!")
				res.redirect("/vendas/list-vendas")
			}).catch((erro) => {
				req.flash("msg_erro", "Não foi possível gerar Financeiro" + erro)
				res.redirect("/vendas/list-vendas")
			})
		}).catch(erro => {
			req.flash("msg_erro", "Não foi possível gerar Financeiro" + erro)
			res.redirect("/vendas/list-vendas")
		})
	}).catch(erro => {
		req.flash("msg_erro", "Não foi possível gerar Financeiro" + erro)
		res.redirect("/vendas/list-vendas")
	})
}

exports.estornarVenda = (req, res) => {
	Venda.update({ financeiro: 'nao', status: 'ORCAMENTO' }, { where: {id: req.params.id}}).then((venda) =>{
		req.flash("msg_sucesso", "Venda estornada com sucesso!")
		res.redirect("/vendas/list-vendas")
	}).catch((erro) => {
		req.flash("error_msg", "Erro ao estornar essa venda!")
		res.redirect("/vendas/list-vendas")
	})
}

exports.aprovarVenda = (req, res) => {
	Venda.findByPk(req.params.id).then((venda) =>{
		ItensVenda.findAll({where: {vendaId: venda.id}}).then(itensVenda => {
			for(var i = 0; i < itensVenda.length; i++){
				const id = itensVenda[i].produtoId;
				const quantidade = itensVenda[i].quantidade;
				Produto.findByPk(id).then(produto => {
					const quantProd = produto.quantidade - quantidade;
					if(quantidade > produto.quantidade){
						req.flash("error_msg", "Produto com estoque Insuficiente - " + produto.descricao)
						res.redirect("/vendas/list-vendas")
					}
					produto.quantidade = quantProd;
					produto.save().then(()=> {

					}).catch(erro => {
						req.flash("error_msg", "Erro ao aprovar essa venda!" + erro)
						res.redirect("/vendas/list-vendas")
					})
				}).catch(erro => {
					req.flash("error_msg", "Erro ao aprovar essa venda!" + erro)
					res.redirect("/vendas/list-vendas")
				})
			}
		}).catch(erro => {
			req.flash("error_msg", "Erro ao aprovar essa venda!" + erro)
			res.redirect("/vendas/list-vendas")
		})

		venda.status = 'VENDA';
		venda.save().then(() => {
			req.flash("msg_sucesso", "Venda aprovada com sucesso!")
			res.redirect("/vendas/list-vendas")
		}).catch(erro => {
			req.flash("error_msg", "Erro ao aprovar essa venda!" + erro)
			res.redirect("/vendas/list-vendas")
		})
	}).catch((erro) => {
		req.flash("error_msg", "Erro ao aprovar essa venda!" + erro)
		res.redirect("/vendas/list-vendas")
	})
}

exports.generatePdf = (req, res) => {
	Empresa.findByPk(1).then(empresa => {
		Venda.findByPk(req.params.id, {include: [{ model: Pessoa, as: 'pessoa' }]}).then(venda => {
			ItensVenda.findAll({where: {vendaId: req.params.id}, include: [{ model: Produto, as: 'produto' }]}).then(itensVenda => {
				const doc = new PDFDocument({
					size: "A4",
					margins: {
						top: 50,
						bottom: 50,
						left: 50,
						right: 50
					}
				})

				generateHeader(doc, empresa);
				generateCustomerInformation(doc, venda);
				generateInvoiceTable(doc, itensVenda, venda);
				res.setHeader(
					"Content-disposition",
					'filename="Pedido-' + venda.id + ".pdf" + '"'
					)
				doc.pipe(res)
				doc.end()
			}).catch(erro => {
				req.flash("error_msg", "Erro ao buscar itens da venda!")
				res.redirect("/vendas/list-vendas")
			})
		}).catch(erro => {
			req.flash("error_msg", "Erro ao buscar dados da venda!")
			res.redirect("/vendas/list-vendas")
		})
	}).catch(erro => {
		req.flash("error_msg", "Erro ao buscar dados da empresa!")
		res.redirect("/vendas/list-vendas")
	})
}

/* --------------- CONFIGURAÇÂO DO TEMPLATE DO PDF ----------------------------------------------------------------*/

function generateHeader(doc, empresa) {
	doc
	.image("public/uploads/" + empresa.key, 50, 30, { width: 65 })
	.fillColor("#444444")
	.fontSize(14)
	.text(empresa.nomeFantasia, 200, 35, { align: "right" })
	.fontSize(9)
	.text(empresa.telefone, 200, 53, { align: "right" })
	.text(empresa.email, 200, 67, { align: "right" })
	.text(empresa.cnpj, 200, 81, { align: "right" })
	.text(empresa.rua + ", " + empresa.numero + " | " + empresa.cidade + " - " + empresa.uf , 200, 95, { align: "right" })
	.moveDown();
	generateHr(doc, 30, 560, 115);
}

function generateCustomerInformation(doc, venda) {
	doc
	.fillColor("#000000")
	.fontSize(10)
	.font("Helvetica-Bold")
	.text("PEDIDO - 00" + venda.id, 200, 135, { align: "right" })
	.fontSize(7)
	.font("Helvetica")
	.text("EMITIDO EM - " + formatDate(venda.createdAt), 200, 150, { align: "right" });

	doc
	.fontSize(10)
	.text(venda.pessoa.nome, 50, 125)
	.fontSize(8)
	.font("Helvetica")
	.text(venda.pessoa.telefone, 50, 140)
	.text(venda.pessoa.email, 50, 155)
	.text(venda.pessoa.rua + ", " + venda.pessoa.numero + ", " + venda.pessoa.bairro + " | " + venda.pessoa.cep, 50, 170)
	.text(venda.pessoa.cidade + " - " + venda.pessoa.uf, 50, 185)
	.moveDown();

	generateHr(doc, 30, 560, 203);
}

function generateInvoiceTable(doc, itensVenda, venda) {
	let i;
	const invoiceTableTop = 225;
	var sub_total = 0.0;

	doc.font("Helvetica-Bold");
	generateTableRow(
		doc,
		invoiceTableTop,
		"Código",
		"Descrição",
		"Quantidade",
		"Valor Unitário",
		"Total"
		);
	generateHr(doc, 45, 545, invoiceTableTop + 12);
	doc.font("Helvetica");
	
	for (i = 0; i < itensVenda.length; i++) {
		const position = invoiceTableTop + (i + 1) * 20;
		generateTableRow(
			doc,
			position,
			itensVenda[i].produto.id,
			itensVenda[i].produto.descricao,
			itensVenda[i].quantidade,
			"R$ " + itensVenda[i].valorUnitario,
			"R$ " + itensVenda[i].valorTotal
			);
		sub_total += parseFloat(itensVenda[i].valorTotal);
		generateHr(doc, 45, 545, position + 13);
	}

	const subtotalPosition = invoiceTableTop + (i + 1) * 20;
	generateTableRow(
		doc,
		subtotalPosition,
		"",
		"",
		"",
		"Subtotal",
		"R$ " + sub_total.toFixed(2)
		);

	const paidToDatePosition = subtotalPosition + 20;
	generateTableRow(
		doc,
		paidToDatePosition,
		"",
		"",
		"",
		"Desconto",
		"R$ " + venda.desconto
		);

	const duePosition = paidToDatePosition + 25;
	doc.font("Helvetica-Bold");
	generateTableRow(
		doc,
		duePosition,
		"",
		"",
		"",
		"VALOR TOTAL",
		"R$ " + venda.valorTotal
		);
	doc.font("Helvetica");

	generateFooter(doc, paidToDatePosition + 45);
}

function generateFooter(doc, alt) {
	generateHr(doc, 30, 560, alt);

	doc
	.fontSize(10)
	.text(
		"SigInnove - Sistema de Gestão.",
		50,
		alt + 15,
		{ align: "center", width: 500 }
		);
}

function generateTableRow(doc, y, codigo, descricao, quantidade, valorUnitario,	total) {
	doc
	.fontSize(7)
	.text(codigo, 50, y)
	.text(descricao, 100, y)
	.text(quantidade, 295, y, { width: 90, align: "right" })
	.text(valorUnitario, 385, y, { width: 90, align: "right" })
	.text(total, 0, y, { align: "right" });
}

function generateHr(doc, x1, x2, y) {
	doc
	.strokeColor("#aaaaaa")
	.lineWidth(0.5)
	.moveTo(x1, y)
	.lineTo(x2, y)
	.stroke();
}

function formatDate(date) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hr = date.getHours(); 
	const min = date.getMinutes();
	const seg = date.getSeconds();

	return day + "/" + month + "/" + year + " - " + hr + ":" + min + ":" + seg ;
}
