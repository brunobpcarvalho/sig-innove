var db = require("../config/conexao")
const Pessoa = require("../models/Pessoa")
const Venda = require("../models/Venda")
const Empresa = require("../models/Empresa")
const PDFDocument = require("pdfkit")

exports.listAll = (req, res) => {
	Pessoa.findAll().then((dadosPessoa) => {
		const contextPessoa = {
			pessoas: dadosPessoa.map(dado => {
				return {
					id: dado.id,
					nome: dado.nome,
					tipo: dado.tipo,
					funcao: dado.funcao,
					cpf_cnpj: dado.cpf_cnpj,
					ie: dado.ie,
					razao_social: dado.razao_social,
					nome_mae: dado.nome_mae,
					dataNascimento: dado.dataNascimento,
					telefone: dado.telefone,
					celular: dado.celular,
					email: dado.email,
					ativo: dado.ativo,
					cep: dado.cep,
					rua: dado.rua,
					numero: dado.numero,
					bairro: dado.bairro,
					cidade: dado.cidade,
					uf: dado.uf,
					complemento: dado.complemento
				}
			})
		}

		res.render("pessoas/list-pessoas", {pessoas: contextPessoa.pessoas})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao buscar pessoas: " + erro)
		res.redirect("/index")
	})
}

exports.add = (req, res) => {
	var dataNascimento = req.body.dataNascimento;
	if(req.body.tipo === 'Juridica'){
		dataNascimento = null;
	}
	const pessoa = new Pessoa({
		nome: req.body.nome,
		tipo: req.body.tipo,
		funcao: req.body.funcao,
		cpf_cnpj: req.body.cpf_cnpj,
		ie: req.body.ie,
		razao_social: req.body.razao_social,
		nome_mae: req.body.nome_mae,
		dataNascimento: dataNascimento,
		telefone: req.body.telefone,
		celular: req.body.celular,
		email: req.body.email,
		ativo: req.body.ativo,
		cep: req.body.cep,
		rua: req.body.rua,
		numero: req.body.numero,
		bairro: req.body.bairro,
		cidade: req.body.cidade,
		uf: req.body.uf,
		complemento: req.body.complemento
	})
	pessoa.save().then(() => {
		req.flash("msg_sucesso", "Pessoa salva com sucesso!")
		res.redirect("/pessoas/list-pessoas")
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao salvar Pessoa" + erro)
		res.redirect("/pessoas/list-pessoas")
	})
}

exports.delete = (req, res) => {

	Venda.findAll({where: {pessoaId: req.body.id}}).then((pessoa) =>{
		if(pessoa.length < 1){
			Pessoa.destroy({where: {id: req.body.id}}).then(() => {
				req.flash("msg_sucesso", "Pessoa deletada com sucesso!")
				res.redirect("/pessoas/list-pessoas")
			}).catch((erro) => {
				req.flash("msg_erro", "Erro ao deletar Pessoa: " + erro)
				res.redirect("/pessoas/list-pessoas")
			})
		}else {
			req.flash("msg_erro", "Não é possivel excluir essa Pessoa, pois está vinculada a uma Venda!")
			res.redirect("/pessoas/list-pessoas")
		}
	}).catch((erro)=>{
		req.flash("msg_erro", "Não foi possivel encontrar o pessoa! " + erro)
		res.redirect("/pessoas/list-pessoas")
	})


}

exports.update = (req, res) => {
	var dataNascimento = req.body.dataNascimento;
	if(req.body.tipo === 'Juridica'){
		dataNascimento = null;
	}

	Pessoa.findByPk(id = req.body.id).then((pessoa) =>{
		pessoa.nome = req.body.nome,
		pessoa.tipo = req.body.tipo,
		pessoa.funcao = req.body.funcao,
		pessoa.cpf_cnpj = req.body.cpf_cnpj,
		pessoa.ie = req.body.ie,
		pessoa.razao_social = req.body.razao_social,
		pessoa.nome_mae = req.body.nome_mae,
		pessoa.dataNascimento = dataNascimento,
		pessoa.tel1 = req.body.tel1,
		pessoa.tel2 = req.body.tel2,
		pessoa.email = req.body.email,
		pessoa.ativo = req.body.ativo,
		pessoa.cep = req.body.cep,
		pessoa.rua = req.body.rua,
		pessoa.numero = req.body.numero,
		pessoa.bairro = req.body.bairro,
		pessoa.cidade = req.body.cidade,
		pessoa.uf = req.body.uf,
		pessoa.complemento = req.body.complemento

		pessoa.save().then(() => {
			req.flash("msg_sucesso", "Pessoa editada com sucesso!")
			res.redirect("/pessoas/list-pessoas")
		}).catch((erro) => {
			req.flash("msg_erro", "Erro ao salvar Pessoa: " + erro)
			res.redirect("/pessoas/list-pessoas")
		})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao editar Pessoa: " + erro)
		res.redirect("/pessoas/list-pessoas")
	})
}

exports.validar = (req, res) => {
	Pessoa.findAll({where: {cpf_cnpj: req.body.cpf_cnpj}}).then((pessoa) => {
		if(pessoa.length > 0){
			res.send('existe')
		}
		res.send('nao')
	}).catch((erro) => {
		req.flash("msg_erro", "Houve um erro ao validar!")
		res.redirect("/pessoas/list-pessoas")
	})
}

exports.relatorio = (req, res) => {
	Empresa.findByPk(1).then(empresa => {
		Pessoa.findAll({ order: [ ['id', 'ASC']]}, {attributes: ['id', 'nome', 'cpf_cnpj', 'tipo', 'funcao', 'ativo']}).then(pessoas => {
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
			generateInvoiceTable(doc, pessoas);
			res.setHeader(
				"Content-disposition",
				'filename="Relatorio-Pessoas.pdf"'
				)
			doc.pipe(res)
			doc.end()
		}).catch(erro => {
			req.flash("error_msg", "Erro ao buscar itens da venda!")
			res.redirect("/pessoas/list-pessoas")
		})
	}).catch(erro => {
		req.flash("error_msg", "Erro ao buscar dados da venda!")
		res.redirect("/pessoas/list-pessoas")
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

function generateCustomerInformation(doc) {
	var data = new Date();
	doc
	.fillColor("#000000")
	.fontSize(10)
	.font("Helvetica")
	.text("RELATORIO EMITIDO EM - " + formatDate(data), 200, 125, { align: "right" });

	doc
	.fontSize(10)
	.text("RELATORIO DE PESSOAS", 50, 125)
	.moveDown();

	generateHr(doc, 30, 560, 143);
}

function generateInvoiceTable(doc, pessoas) {
	let i;
	const invoiceTableTop = 158;
	var sub_total = 0.0;

	doc.font("Helvetica-Bold");
	generateTableRow(
		doc,
		invoiceTableTop,
		"Código",
		"Nome",
		"CPF/CNPJ",
		"Tipo",
		"Função",
		"Ativo"
		);
	generateHr(doc, 45, 545, invoiceTableTop + 12);
	doc.font("Helvetica");
	var top = 158;
	var contador = 0;
	var position;
	for (i = 0; i < pessoas.length; i++) {
		if (position == 758) {
			doc.addPage()
			top = 8
			contador = 0;
		}
		position = top + (contador + 1) * 15;

		generateTableRow(
			doc,
			position,
			pessoas[i].id,
			pessoas[i].nome,
			pessoas[i].cpf_cnpj,
			pessoas[i].tipo,
			pessoas[i].funcao,
			pessoas[i].ativo
			);
		generateHr(doc, 45, 545, position + 10);
		contador ++;
	}
	const footerPosition = position + (contador + 1) * 2;

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

function generateTableRow(doc, y, codigo, nome, cpf_cnpj, tipo,	funcao, ativo) {
	doc
	.fontSize(7)
	.text(codigo, 50, y)
	.text(nome, 85, y)
	.text(cpf_cnpj, 275, y, { width: 90, align: "right" })
	.text(tipo, 335, y, { width: 90, align: "right" })
	.text(funcao, 395, y, { width: 90, align: "right" })
	.text(ativo, 0, y, { align: "right" });
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
	const hr = date.getHours() - 1; 
	const min = date.getMinutes();
	const seg = date.getSeconds();

	return day + "/" + month + "/" + year + " - " + hr + ":" + min + ":" + seg ;
}