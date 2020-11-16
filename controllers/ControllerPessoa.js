var db = require("../config/conexao")
const Pessoa = require("../models/Pessoa")
const Venda = require("../models/Venda")
const Compra = require("../models/Compra")
const ContasPagar = require("../models/ContasPagar")
const ContasReceber = require("../models/ContasReceber")
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

exports.delete = async (req, res) => {
	const vendas = await Venda.findAll({where: {pessoaId: req.body.id}})
	const compras = await Compra.findAll({where: {pessoaId: req.body.id}})
	const recebimentos = await ContasReceber.findAll({where: {pessoaId: req.body.id}})
	const pagamentos = await ContasPagar.findAll({where: {pessoaId: req.body.id}})

	Pessoa.findByPk(req.body.id).then((pessoa) => {
		if(vendas.length < 1 && compras.length < 1 && recebimentos.length < 1 && pagamentos.length < 1){
			pessoa.destroy();
			req.flash("msg_sucesso", "Pessoa deletada com sucesso!")
			res.redirect("/pessoas/list-pessoas")
		}else {
			req.flash("msg_erro", "Não é possivel excluir essa Pessoa, pois está vinculada a um registro!")
			res.redirect("/pessoas/list-pessoas")
		}
	}).catch((erro) => {
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
	Pessoa.findAll({where: {cpf_cnpj: req.body.campo}}).then((pessoa) => {
		if(pessoa.length > 0){
			res.send(true)
		} else {
			res.send(false)
		}
	}).catch((erro) => {
		req.flash("msg_erro", "Houve um erro ao validar!")
		res.redirect("/pessoas/list-pessoas")
	})
}

exports.filter = (req, res) => {
	const { filterTipo, filterFuncao, filterCidade, filterUf, filterAtivo } = req.body
	let sql = 'select * from "pessoas" where 1 = 1';
	let filters = []
	let values = {
		tipo: '',
		funcao: '',
		cidade: '',
		uf: '',
		ativo: ''
	}

	if (filterTipo !== '') {
		sql += ` AND "tipo" = '` + filterTipo + `'` ;
		filters.push('Tipo')
		values.tipo = filterTipo
	}
	if (filterFuncao !== '') {
		sql += ` AND "funcao" = '` + filterFuncao + `'` ;
		filters.push('Função')
		values.funcao = filterFuncao
	}
	if (filterCidade !== '') {
		sql += ` AND "cidade" ~* '` + filterCidade + `'` ;
		filters.push('Cidade')
		values.cidade = filterCidade
	}
	if (filterUf !== '') {
		sql += ` AND "uf" = '` + filterUf + `'` ;
		filters.push('UF')
		values.uf = filterUf
	}
	if (filterAtivo !== '') {
		sql += ` AND "ativo" = '` + filterAtivo + `'` ;
		filters.push('Ativo')
		values.ativo = filterAtivo
	}
	db.query(sql, { type: db.QueryTypes.SELECT}).then(pessoas => {
		console.log('pessoas', pessoas);
		res.render("pessoas/list-pessoas", {pessoas: pessoas, filters: filters, values: values})
	}).catch((erro) => {
		req.flash("msg_erro", "Erro ao buscar pessoas: " + erro)
		res.redirect("/index")
	})
}
