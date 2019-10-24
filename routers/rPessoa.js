const express = require("express");
const router = express.Router();
var db = require("../config/conexao");
const Pessoa = require("../models/pessoa");
const Endereco = require("../models/endereco");
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/listPessoa', Admin, (req, res) => {
  Pessoa.findAll({include: [{ model: Endereco, as: 'endereco' }]}).then((pessoas) => {
    res.render("pessoas/listPessoa", {pessoas: pessoas,});
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post('/listPessoa/nova', Admin, async (req, res) => {

  const enderecoPessoa = await Endereco.create({ cep, rua, numero, bairro, cidade, uf } = req.body);
  console.log(enderecoPessoa.id);
  const pessoa = new Pessoa({
    nome: req.body.nome,
    tipo: req.body.tipo,
    funcao: req.body.funcao,
    cpf_cnpj: req.body.cpf_cnpj,
    ie: req.body.ie,
    razao_social: req.body.razao_social,
    nome_mae: req.body.nome_mae,
    tel1: req.body.tel1,
    tel2: req.body.tel2,
    email: req.body.email,
    ativo: req.body.ativo,
    enderecoId: enderecoPessoa.id
  });
  await pessoa.save().then(() => {
    res.redirect("/pessoas/listPessoa");
  }).catch((erro) => {
    req.flash("msg_erro", "Erro ao salvar Pessoa" + erro);
    res.redirect("/pessoas/listPessoa");
  });
});

router.post('/listPessoa/deletar', Admin, (req, res) => {
  Pessoa.destroy({where: {id: req.body.id}}).then(() => {
    res.redirect("/pessoas/listPessoa");
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post("/listPessoa/editar", Admin, (req, res) => {
  Pessoa.findByPk(id = req.body.id).then((pessoa) =>{
    pessoa.nome = req.body.nome,
    pessoa.tipo = req.body.tipo,
    pessoa.funcao = req.body.funcao,
    pessoa.cpf_cnpj = req.body.cpf_cnpj,
    pessoa.ie = req.body.ie,
    pessoa.razao_social = req.body.razao_social,
    pessoa.nome_mae = req.body.nome_mae,
    pessoa.tel1 = req.body.tel1,
    pessoa.tel2 = req.body.tel2,
    pessoa.email = req.body.email,
    pessoa.ativo = req.body.ativo

    Endereco.findByPk(id = pessoa.enderecoId).then((endereco) =>{
      endereco.cep = req.body.cep,
      endereco.rua = req.body.rua,
      endereco.numero = req.body.numero,
      endereco.bairro = req.body.bairro,
      endereco.cidade = req.body.cidade,
      endereco.uf = req.body.uf

      endereco.save().then(() => {

      }).catch((erro) => {
        res.redirect("/index");
      });
    }).catch((erro) => {
      res.redirect("/index");
    });
    pessoa.save().then(() => {
      res.redirect("/pessoas/listPessoa");
    }).catch((erro) => {
      console.log("Erro: " + erro)
      res.redirect("/index");
    });
  }).catch((erro) => {
    console.log(": " + erro)
    res.redirect("/index");
  });
});

/*----------------------------------------------------------------------------*/
module.exports = router;
