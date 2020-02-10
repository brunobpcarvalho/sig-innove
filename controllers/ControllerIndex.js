var db = require("../config/conexao")
const Pessoa = require("../models/Pessoa")
const Venda = require("../models/Venda")
const Produto = require("../models/Produto")
const ContasReceber = require("../models/ContasReceber")
const ContasPagar = require("../models/ContasPagar")

exports.listAll = (req, res) => {
	var date = new Date();
	var month = date.getMonth() + 1;

	Pessoa.count({where: {funcao: 'Cliente'}}).then(totalClientesCadastrados => {
		Pessoa.count({where: {funcao: 'Fornecedor'}}).then(totalFornecedoresCadastrados => {
			Venda.count().then(vendasRealizadas => {
				Produto.count().then(totalProdutosCadastrados => {
					db.query('SELECT Sum("quantidade" * "valorUnitario") as "vlrTotEmEstoque" FROM "produtos"', { type: db.QueryTypes.SELECT})
					.then(valorTotalEmEstoque => {
						db.query('SELECT EXTRACT(MONTH FROM "dataVencimento"), Sum("valor") as "vlrRecebAnual" FROM "recebimentos" GROUP BY EXTRACT(MONTH FROM"dataVencimento") ORDER BY EXTRACT(MONTH FROM"dataVencimento") ASC', { type: db.QueryTypes.SELECT})
						.then(valorRecebimentosAnual => {
							db.query('SELECT EXTRACT(MONTH FROM "dataVencimento"), Sum("valor") as "vlrPagaAnual" FROM "pagamentos" GROUP BY EXTRACT(MONTH FROM"dataVencimento") ORDER BY EXTRACT(MONTH FROM"dataVencimento") ASC', { type: db.QueryTypes.SELECT})
							.then(valorPagamentosAnual => {
								ContasReceber.count().then(recebimentosRealizados => {
									db.query('SELECT SUM("valorPago") FROM recebimentos WHERE EXTRACT(MONTH FROM "dataVencimento") = ' + month + ' AND pago = true', { type: db.QueryTypes.SELECT})
									.then(vlrRecebidoNoMes => {
										var valorRecebidoNoMes = vlrRecebidoNoMes[0].sum
										db.query('SELECT SUM("valor") FROM recebimentos WHERE EXTRACT(MONTH FROM "dataVencimento") = ' + month, { type: db.QueryTypes.SELECT})
										.then(vlrAReceberNoMes => {
											var valorAReceberNoMes = vlrAReceberNoMes[0].sum
											db.query('SELECT SUM("valorPago") FROM pagamentos WHERE EXTRACT(MONTH FROM "dataVencimento") = ' + month + ' AND pago = true', { type: db.QueryTypes.SELECT})
											.then(vlrPagoNoMes => {
												var valorPagoNoMes = vlrPagoNoMes[0].sum
												db.query('SELECT SUM("valor") FROM pagamentos WHERE EXTRACT(MONTH FROM "dataVencimento") = ' + month, { type: db.QueryTypes.SELECT})
												.then(vlrAPagarNoMes => {
													var valorAPagarNoMes = vlrAPagarNoMes[0].sum
													ContasPagar.count().then(pagamentosRealizados => {
														var porcentagemRecebido = CalcPorcentagem(valorRecebidoNoMes, valorAReceberNoMes)
														var diferencaRecebimento = Diferenca(valorRecebidoNoMes, valorAReceberNoMes).toFixed(2)

														var porcentagemPago = CalcPorcentagem(valorPagoNoMes, valorAPagarNoMes)
														var diferencaPagamento = Diferenca(valorPagoNoMes, valorAPagarNoMes).toFixed(2)

														Venda.sum('valorTotal').then(vlrTotVendas => {
															var valorTotalVendas = parseFloat(vlrTotVendas).toFixed(2);
															res.render("index", {
															totalClientesCadastrados: totalClientesCadastrados, 
															totalFornecedoresCadastrados: totalFornecedoresCadastrados, 
															totalProdutosCadastrados: totalProdutosCadastrados, 
															vendasRealizadas: vendasRealizadas, 
															recebimentosRealizados: recebimentosRealizados, 
															pagamentosRealizados: pagamentosRealizados, 
															valorTotalEmEstoque: valorTotalEmEstoque, 
															valorRecebimentosAnual: valorRecebimentosAnual,
															valorPagamentosAnual: valorPagamentosAnual,
															valorRecebidoNoMes: valorRecebidoNoMes,
															valorAReceberNoMes: valorAReceberNoMes,
															valorTotalVendas: valorTotalVendas,
															porcentagemRecebido: porcentagemRecebido,
															diferencaRecebimento: diferencaRecebimento,
															valorPagoNoMes: valorPagoNoMes,
															valorAPagarNoMes: valorAPagarNoMes,
															porcentagemPago: porcentagemPago,
															diferencaPagamento: diferencaPagamento
														});	
														}).catch((erro) => {
															console.log(erro);
															req.flash("msg_erro", "Não foi possivel listar!")
															res.render("/");
														})
													}).catch((erro) => {
														console.log(erro);
														req.flash("msg_erro", "Não foi possivel listar!")
														res.render("/");
													})
												}).catch((erro) => {
													console.log(erro);
													req.flash("msg_erro", "Não foi possivel listar!")
													res.render("/");
												})
											}).catch((erro) => {
												console.log(erro);
												req.flash("msg_erro", "Não foi possivel listar!")
												res.render("/");
											})
										}).catch((erro) => {
											console.log(erro);
											req.flash("msg_erro", "Não foi possivel listar!")
											res.render("/");
										})
									}).catch((erro) => {
										console.log(erro);
										req.flash("msg_erro", "Não foi possivel listar!")
										res.render("/");
									})
								}).catch((erro) => {
									console.log(erro);
									req.flash("msg_erro", "Não foi possivel listar!")
									res.render("/");
								})
							}).catch((erro) => {
								console.log(erro);
								req.flash("msg_erro", "Não foi possivel listar!")
								res.render("/");
							})
						}).catch((erro) => {
							console.log(erro);
							req.flash("msg_erro", "Não foi possivel listar!")
							res.render("/");
						})
					}).catch((erro) => {
						console.log(erro);
						req.flash("msg_erro", "Não foi possivel listar!")
						res.render("/");
					})
				}).catch((erro) => {
					console.log(erro);
					req.flash("msg_erro", "Não foi possivel listar!")
					res.render("/");
				})
			}).catch((erro) => {
				console.log(erro);
				req.flash("msg_erro", "Não foi possivel listar total de Vendas realizadas!")
				res.render("/");
			})
		}).catch((erro) => {
			console.log(erro);
			req.flash("msg_erro", "Não foi possivel listar total de Fornecedores!")
			res.render("/");
		})
	}).catch((erro) => {
		console.log(erro);
		req.flash("msg_erro", "Não foi possivel listar total de Clientes!")
		res.render("/");
	})
}


CalcPorcentagem = (vlrRecebidoPago, vlrReceberPagar) => {
	return porcentagem = Math.round((vlrRecebidoPago * 100) / vlrReceberPagar)
}

Diferenca = (vlrRecebidoPago, vlrReceberPagar) => {
	return diferenca = vlrReceberPagar - vlrRecebidoPago
}