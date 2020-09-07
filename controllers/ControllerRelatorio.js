var db = require("../config/conexao")
const Produto = require("../models/Produto")
const Empresa = require("../models/Empresa")

const PDFDocument = require("pdfkit")
const Querys = {
	lucratividade: 'SELECT "id",' +
	'"descricao", ' +
	'"valorUnitario", ' +
	'"valorCusto", ' +
	'("valorUnitario" - "valorCusto") AS "lucratividade", ' +
	'CAST((("valorUnitario" - "valorCusto") / "valorUnitario") * 100 AS DECIMAL(10,2)) AS "margemDeLucro" ' +
	'FROM "produtos" ' +
	'ORDER BY "lucratividade" DESC',

	estoqueDeSeguranca:
	`SELECT P."descricao",
	P."id",
	P."quantidade",
	P."prazoReposicao",
	CAST(
		(COALESCE(
			(SELECT
				SUM(iv."quantidade") * P."prazoReposicao"
				FROM "itens_vendas" iv
				INNER JOIN "vendas" v on v."id" = iv."vendaId"
				WHERE P."id" = iv."produtoId" AND v."dataVenda" > CURRENT_DATE - INTERVAL '30 days'
				GROUP BY iv."produtoId"
			),
			COALESCE(
				(SELECT
					SUM(iv."quantidade") * P."prazoReposicao"
					FROM "itens_vendas" iv
					INNER JOIN "vendas" v on v."id" = iv."vendaId"
					WHERE P."id" = iv."produtoId"
					GROUP BY iv."produtoId"
				),
				P."quantidade"
			)
		)) AS DECIMAL(10,2)
	) + (CAST(
		(COALESCE(
			CAST(
				(SELECT
					SUM(iv."quantidade")
					FROM "itens_vendas" iv
					INNER JOIN "vendas" v on v."id" = iv."vendaId"
					WHERE P."id" = iv."produtoId" AND v."dataVenda" > CURRENT_DATE - INTERVAL '30 days'
					GROUP BY iv."produtoId"
				) AS DECIMAL(10,2)
			),
			COALESCE(
				CAST(
					(SELECT
						SUM(iv."quantidade")
						FROM "itens_vendas" iv
						INNER JOIN "vendas" v on v."id" = iv."vendaId"
						WHERE P."id" = iv."produtoId"
						GROUP BY iv."produtoId"
					) AS DECIMAL(10,2)
				),
				0
			)
		) / 30) AS DECIMAL(10,2)
	) * P."prazoReposicao") AS "pontoDePedido"
	FROM "produtos" P
	LEFT JOIN "itens_vendas" iv on P."id" = iv."produtoId"
	GROUP BY P."id"`,
}

exports.LucroPorProduto = (req, res) => {
	db.query(Querys.lucratividade, { type: db.QueryTypes.SELECT})
	.then(lucratividade => {
		res.render("relatorios/lucro-por-produto", {lucratividade: lucratividade});
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel gerar relatorio")
		res.redirect("/index")
	})
}

exports.EstoqueDeSeguranca = (req, res) => {
	db.query(Querys.estoqueDeSeguranca, { type: db.QueryTypes.SELECT}).then(estoqueDeSeguranca => {
		res.render("relatorios/estoque-de-seguranca", {estoqueDeSeguranca: estoqueDeSeguranca})
	}).catch((err) => {
		req.flash("msg_erro", "Não foi possivel gerar relatorio" + err)
		res.redirect("/index")
	})
}

exports.GerarPdfEstoqueDeSeguranca = (req, res) => {
	Empresa.findByPk(1).then(empresa => {
		db.query(Querys.estoqueDeSeguranca, { type: db.QueryTypes.SELECT})
		.then(estoqueDeSeguranca => {
			const doc = new PDFDocument({
				size: "A4",
				margins: {
					top: 50,
					bottom: 50,
					left: 50,
					right: 50
				}
			})
			const columns = [
				"CÓDIGO",
				"DESCRIÇÃO",
				"QTDE. ESTOQUE",
				"PRAZO REPOSIÇÃO",
				"PONTO DE PEDIDO"
			]
			const largura = [
				{ width: 30, align: "center" },
				'',
				{ width: 90, align: "center" },
				{ width: 90, align: "center" },
				{ width: 100, align: "center" }
			]
			generateHeader(doc, empresa);
			generateCustomerInformation(doc, "RELATORIO DE ESTOQUE DE SEGURANÇA");

			const x = [50, 90, 245, 325, 425]
			var top = 158;
			var contador = 0;
			var y;
			var yTop = [158, 158, 158, 158, 158]
			generateTableTop(doc, x, yTop, columns, largura)

			for (let i = 0; i < estoqueDeSeguranca.length; i++) {
				if (y == 758) {
					doc.addPage()
					top = 8
					contador = 0;
				}
				y = top + (contador + 1) * 17;
				var y2 = [y, y, y, y, y, y]
				const estoqueDeSegurancaColumns = [
					estoqueDeSeguranca[i].id,
					estoqueDeSeguranca[i].descricao,
					estoqueDeSeguranca[i].quantidade,
					estoqueDeSeguranca[i].prazoReposicao,
					estoqueDeSeguranca[i].pontoDePedido
				]
				generateTableRow( doc, x, y2, estoqueDeSegurancaColumns, largura );
				generateHr(doc, 45, 545, y + 10);
				contador ++;
			}
			const footerPosition = y + (contador + 3) * 2;

			generateFooter(doc, footerPosition);

			res.setHeader("Content-disposition", 'filename="EstoqueDeSeguranca.pdf"')
			doc.pipe(res)
			doc.end()
		}).catch(erro => {
			req.flash("error_msg", "Erro ao buscar produtos!")
			res.redirect("/relatorios/estoque-de-seguranca")
		})
	}).catch(erro => {
		req.flash("error_msg", "Erro ao buscar dados da Empresa!")
		res.redirect("/relatorios/estoque-de-seguranca")
	})
}

exports.GerarPdfLucroProduto = (req, res) => {
	Empresa.findByPk(1).then(empresa => {
		db.query(Querys.lucratividade, { type: db.QueryTypes.SELECT})
		.then(lucratividade => {
			const doc = new PDFDocument({
				size: "A4",
				margins: {
					top: 50,
					bottom: 50,
					left: 50,
					right: 50
				}
			})
			const columns = [
				"CÓDIGO",
				"DESCRIÇÃO",
				"VALOR UNITÁRIO",
				"VALOR DE CUSTO",
				"LUCRO",
				"MARGEM DE LUCRO",
			]
			const largura = [
				{ width: 30, align: "center" },
				'',
				{ width: 90, align: "center" },
				{ width: 90, align: "center" },
				{ width: 100, align: "center" },
				{ width: 100, align: "center" }
			]
			generateHeader(doc, empresa);
			generateCustomerInformation(doc, "RELATORIO DE LUCRO POR PRODUTO");

			const x = [50, 90, 240, 320, 380, 450]
			var top = 158;
			var contador = 0;
			var y;
			var yTop = [158, 158, 158, 158, 158, 158]
			generateTableTop(doc, x, yTop, columns, largura)

			for (let i = 0; i < lucratividade.length; i++) {
				if (y == 758) {
					doc.addPage()
					top = 8
					contador = 0;
				}
				y = top + (contador + 1) * 17;
				var y2 = [y, y, y, y, y, y]
				const lucratividadeColumns = [
					lucratividade[i].id,
					lucratividade[i].descricao,
					lucratividade[i].valorUnitario,
					lucratividade[i].valorCusto,
					lucratividade[i].lucratividade,
					lucratividade[i].margemDeLucro +'%'
				]
				generateTableRow( doc, x, y2, lucratividadeColumns, largura );
				generateHr(doc, 45, 545, y + 10);
				contador ++;
			}
			const footerPosition = y + (contador + 3) * 2;

			generateFooter(doc, footerPosition);

			res.setHeader("Content-disposition", 'filename="LucroPorProduto.pdf"')
			doc.pipe(res)
			doc.end()
		}).catch(erro => {
			req.flash("error_msg", "Erro ao buscar produtos! - " + erro)
			res.redirect("/relatorios/lucro-por-produto")
		})
	}).catch(erro => {
		req.flash("error_msg", "Erro ao buscar dados da Empresa! - " + erro)
		res.redirect("/relatorios/lucro-por-produto")
	})
}

exports.GerarPdfPessoas = (req, res) => {
	Empresa.findByPk(1).then(empresa => {
		const { filterTipo, filterFuncao, filterCidade, filterUf, filterAtivo } = req.body
		const filter = []
		let sql = 'select * from "pessoas" where 1 = 1';

		if (filterTipo !== '') {
			sql += ` AND "tipo" = '` + filterTipo + `'` ;
			filter.push(" "+filterTipo)
		}
		if (filterFuncao !== '') {
			sql += ` AND "funcao" = '` + filterFuncao + `'` ;
			filter.push(" "+filterFuncao)
		}
		if (filterCidade !== '') {
			sql += ` AND "cidade" LIKE '%` + filterCidade + `%'` ;
			filter.push(" "+filterCidade)
		}
		if (filterUf !== '') {
			sql += ` AND "uf" = '` + filterUf + `'` ;
			filter.push(" "+filterUf)
		}
		if (filterAtivo !== '') {
			sql += ` AND "ativo" = '` + filterAtivo + `'` ;
			filter.push(" "+filterAtivo)
		}

		sql += ` ORDER BY "id" ASC`

		db.query(sql, { type: db.QueryTypes.SELECT}).then(pessoas => {
			const doc = new PDFDocument({
				size: "A4",
				margins: {
					top: 50,
					bottom: 50,
					left: 50,
					right: 50
				}
			})
			const columns = [
				"CÓDIGO",
				"NOME",
				"CPF/CNPJ",
				"TIPO",
				"FUNÇÃO",
				"ENDEREÇO",
				"SITUAÇÃO"
			]
			const largura = [
				{ width: 30, align: "center" },
				'',
				{ width: 90, align: "center" },
				{ width: 90, align: "center" },
				{ width: 90, align: "center" },
				{ width: 115, align: "center" },
				{ width: 90, align: "center" }
			]
			generateHeader(doc, empresa);
			generateCustomerInformation(doc, "RELATORIO DE PESSOAS", "FILTROS: " + filter);

			const x = [30, 65, 245, 305, 345, 410, 490]
			var top = 158;
			var contador = 0;
			var y;
			var yTop = [158, 158, 158, 158, 158, 158, 158]
			generateTableTop(doc, x, yTop, columns, largura)

			for (let i = 0; i < pessoas.length; i++) {

				if (y == 752) {
					doc.addPage()
					top = 8
					contador = 0;
				}
				y = top + (contador + 1) * 22;
				var y2 = [y, y, y, y, y, y - 5 , y]
				const pessoasColumns = [
					pessoas[i].id,
					pessoas[i].nome,
					pessoas[i].cpf_cnpj,
					pessoas[i].tipo,
					pessoas[i].funcao,
					pessoas[i].rua + ", " + pessoas[i].numero + ", " + pessoas[i].bairro + " | " + pessoas[i].cidade + " - " + pessoas[i].uf,
					pessoas[i].ativo
				]
				generateTableRow( doc, x, y2, pessoasColumns, largura );
				generateHr(doc, 30, 560, y + 15);
				contador ++;
			}
			const footerPosition = y + (contador + 3) * 2;

			generateFooter(doc, footerPosition);

			res.setHeader("Content-disposition", 'filename="Pessoas.pdf"')
			doc.pipe(res)
			doc.end()
		}).catch((erro) => {
			req.flash("msg_erro", "Erro ao buscar pessoas: " + erro)
			res.redirect("/pessoas/list-pessoas")
		})
	}).catch(erro => {
		req.flash("error_msg", "Erro ao buscar dados da Empresa! - " + erro)
		res.redirect("/pessoas/list-pessoas")
	})
}



/* Configurações do PDF */
generateHeader = (doc, empresa) =>{
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

generateCustomerInformation = (doc, descricao, filtros) => {
	var data = new Date();
	doc
	.fillColor("#000000")
	.fontSize(10)
	.font("Helvetica")
	.text("RELATORIO EMITIDO EM - " + formatDate(data), 200, 125, { align: "right" });
	doc
	.fontSize(10)
	.text(descricao, 50, 125);
	doc
	.fontSize(6)
	.text(filtros, 50, 140)
	.moveDown();
	generateHr(doc, 30, 560, 150);
}

/* Gerar corpo com os dados */

generateTableTop = (doc, x, y, column, largura) => {
	doc.font("Helvetica-Bold");
	generateTableRow( doc, x, y, column, largura );
	generateHr(doc, 30, 560, 158 + 12);
	doc.font("Helvetica");
}

/* Gerar Colunas */
generateTableColumn = (doc, x, y, column, largura) => {
	doc.fontSize(6).text(column, x, y, largura)
}

/* Gerar linhas */
generateTableRow = (doc, x, y, column, largura) => {
	for (var i = 0; i < column.length; i++) {
		generateTableColumn(doc, x[i], y[i], column[i], largura[i])
	}
}

/* Gerar linha de separação */
generateHr = (doc, x1, x2, y) => {
	doc
	.strokeColor("#696969")
	.lineWidth(0.7)
	.moveTo(x1, y)
	.lineTo(x2, y)
	.stroke();
}

/* Gerar Rodapé da Página */
generateFooter = (doc, alt) => {
	generateHr(doc, 30, 560, alt + 10);
	doc.fontSize(10)
	.text(
		"SigInnove - Sistema de Gestão.",
		50,
		alt + 15,
		{ align: "center", width: 500 }
	);
}
/* Formatar Data*/
formatDate = (date) => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hr = date.getHours();
	const min = date.getMinutes();
	const seg = date.getSeconds();

	return day + "/" + month + "/" + year + " - " + hr + ":" + min + ":" + seg ;
}
