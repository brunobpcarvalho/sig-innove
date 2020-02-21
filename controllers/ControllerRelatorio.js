var db = require("../config/conexao")
const Produto = require("../models/Produto")
const Empresa = require("../models/Empresa")

const PDFDocument = require("pdfkit")

exports.LucroPorProduto = (req, res) => {
	db.query('SELECT "id", "descricao", "valorUnitario", "valorCusto", ("valorUnitario" - "valorCusto") AS "lucratividade" FROM "produtos" ORDER BY "lucratividade" DESC', { type: db.QueryTypes.SELECT})
	.then(lucratividade => {
		res.render("relatorios/relatorio-lucro-produto", {lucratividade: lucratividade});
	}).catch((erro) => {
		req.flash("msg_erro", "Não foi possivel gerar relatorio")
		res.redirect("/index")
	})
}

exports.GerarPdfLucroProduto = (req, res) => {
	Empresa.findByPk(1).then(empresa => {
		db.query('SELECT "id", "descricao", "valorUnitario", "valorCusto", ("valorUnitario" - "valorCusto") AS "lucro" FROM "produtos" ORDER BY "lucro" DESC', { type: db.QueryTypes.SELECT})
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

			generateHeader(doc, empresa);
			generateCustomerInformation(doc);
			generateInvoiceTable(doc, lucratividade);
			res.setHeader(
				"Content-disposition",
				'filename="LucroPorProduto.pdf"'
			)
			doc.pipe(res)
			doc.end()
		}).catch(erro => {
			console.log("1" + erro);
			req.flash("error_msg", "Erro ao buscar produtos!")
			res.redirect("/produtos/relatorio-lucratividade")
		})
	}).catch(erro => {
		console.log("2" + erro);
		req.flash("error_msg", "Erro ao buscar dados da Empresa!")
		res.redirect("/produtos/relatorio-lucratividade")
	})
}

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

function generateCustomerInformation(doc) {
	var data = new Date();
	doc
	.fillColor("#000000")
	.fontSize(10)
	.font("Helvetica")
	.text("RELATORIO EMITIDO EM - " + formatDate(data), 200, 125, { align: "right" });

	doc
	.fontSize(10)
	.text("RELATORIO DE LUCRO POR PRODUTO", 50, 125)
	.moveDown();

	generateHr(doc, 30, 560, 143);
}

function generateInvoiceTable(doc, lucratividade) {
	let i;
	const invoiceTableTop = 158;
	var sub_total = 0.0;

	doc.font("Helvetica-Bold");
	generateTableRow(
		doc,
		invoiceTableTop,
		"Código",
		"Descrição",
		"Valor Unitário",
		"Valor de Custo",
		"Lucro"
		);
	generateHr(doc, 45, 545, invoiceTableTop + 12);
	doc.font("Helvetica");
	var top = 158;
	var contador = 0;
	var position;
	for (i = 0; i < lucratividade.length; i++) {
		if (position == 758) {
			doc.addPage()
			top = 8
			contador = 0;
		}
		position = top + (contador + 1) * 15;

		generateTableRow(
			doc,
			position,
			lucratividade[i].id,
			lucratividade[i].descricao,
			lucratividade[i].valorUnitario,
			lucratividade[i].valorCusto,
			lucratividade[i].lucro
			);
		generateHr(doc, 45, 545, position + 10);
		contador ++;
	}
	const footerPosition = position + (contador + 3) * 2;

	generateFooter(doc, footerPosition);
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

function generateTableRow(doc, y, codigo, descricao, valorUnitario, valorCusto,	lucro) {
	doc
	.fontSize(7)
	.text(codigo, 50, y)
	.text(descricao, 85, y)
	.text(valorUnitario, 275, y, { width: 90, align: "right" })
	.text(valorCusto, 335, y, { width: 90, align: "right" })
	.text(lucro, 395, y, { width: 90, align: "right" });
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
