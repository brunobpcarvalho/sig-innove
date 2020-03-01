var db = require("../config/conexao")
const Produto = require("../models/Produto")
const Empresa = require("../models/Empresa")

const PDFDocument = require("pdfkit")
const Querys = {
	lucratividade: 'SELECT "id",' +
	'"descricao", ' +
	'"valorUnitario", ' +
	'"valorCusto", ' +
	'("valorUnitario" - "valorCusto") AS "lucratividade" ' +
	'FROM "produtos" ' +
	'ORDER BY "lucratividade" DESC',

	estoqueDeSeguranca:
	`SELECT P."descricao",
	P."id",
	P."quantidade",
	P."prazoReposicao",
	COALESCE(
		SUM(iv."quantidade"),
		0) AS "quantVendida",
	COALESCE(
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
	) AS "estoqueDeSeguranca"
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
			console.log('estoqueDeSeguranca', estoqueDeSeguranca);
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
				"QTDE. VENDIDA",
				"ESTOQUE DE SEGURANÇA"
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
			generateTableTop(doc, x, columns, largura)

			for (let i = 0; i < estoqueDeSeguranca.length; i++) {
				if (y == 758) {
					doc.addPage()
					top = 8
					contador = 0;
				}
				y = top + (contador + 1) * 17;
				const estoqueDeSegurancaColumns = [
					estoqueDeSeguranca[i].id,
					estoqueDeSeguranca[i].descricao,
					estoqueDeSeguranca[i].quantidade,
					estoqueDeSeguranca[i].quantVendida,
					estoqueDeSeguranca[i].estoqueDeSeguranca
				]
				generateTableRow( doc, x, y, estoqueDeSegurancaColumns, largura );
				generateHr(doc, 45, 545, y + 10);
				contador ++;
			}
			const footerPosition = y + (contador + 3) * 2;

			generateFooter(doc, footerPosition);

			res.setHeader("Content-disposition", 'filename="EstoqueDeSeguranca.pdf"')
			doc.pipe(res)
			doc.end()
		}).catch(erro => {
			console.log("1" + erro);
			req.flash("error_msg", "Erro ao buscar produtos!")
			res.redirect("/relatorios/estoque-de-seguranca")
		})
	}).catch(erro => {
		console.log("2" + erro);
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
				"LUCRO"
			]
			const largura = [
				{ width: 30, align: "center" },
				'',
				{ width: 90, align: "center" },
				{ width: 90, align: "center" },
				{ width: 100, align: "center" }
			]
			generateHeader(doc, empresa);
			generateCustomerInformation(doc, "RELATORIO DE LUCRO POR PRODUTO");

			const x = [50, 90, 245, 325, 425]
			var top = 158;
			var contador = 0;
			var y;
			generateTableTop(doc, x, columns, largura)

			for (let i = 0; i < lucratividade.length; i++) {
				if (y == 758) {
					doc.addPage()
					top = 8
					contador = 0;
				}
				y = top + (contador + 1) * 17;
				const lucratividadeColumns = [
					lucratividade[i].id,
					lucratividade[i].descricao,
					lucratividade[i].valorUnitario,
					lucratividade[i].valorCusto,
					lucratividade[i].lucratividade
				]
				generateTableRow( doc, x, y, lucratividadeColumns, largura );
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

generateCustomerInformation = (doc, descricao) => {
	var data = new Date();
	doc
	.fillColor("#000000")
	.fontSize(10)
	.font("Helvetica")
	.text("RELATORIO EMITIDO EM - " + formatDate(data), 200, 125, { align: "right" });
	doc
	.fontSize(10)
	.text(descricao, 50, 125)
	.moveDown();
	generateHr(doc, 30, 560, 143);
}

/* Gerar corpo com os dados */

generateTableTop = (doc, x, column, largura) => {
	const y = 158;
	doc.font("Helvetica-Bold");
	generateTableRow( doc, x, y, column, largura );
	generateHr(doc, 45, 545, y + 12);
	doc.font("Helvetica");
}

/* Gerar Colunas */
generateTableColumn = (doc, x, y, column, largura) => {
	doc.fontSize(7).text(column, x, y, largura)
}

/* Gerar linhas */
generateTableRow = (doc, x, y, column, largura) => {
	for (var i = 0; i < column.length; i++) {
		generateTableColumn(doc, x[i], y, column[i], largura[i])
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
