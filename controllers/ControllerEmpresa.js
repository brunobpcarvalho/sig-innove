var db = require("../config/conexao")
const Empresa = require("../models/Empresa")
const fs = require("fs");
const path = require("path")
const { promisify } = require("util")

exports.index = (req, res) => {
  Empresa.findAll().then(dados => {
    const context = {
      dadosEmpresa: dados.map(dado => {
        return {
          id: dado.id,
          name: dado.name,
          size: dado.size,
          key: dado.key,
          nomeFantasia: dado.nomeFantasia,
          razaoSocial: dado.razaoSocial,
          cnpj: dado.cnpj,
          ie: dado.ie,
          telefone: dado.telefone,
          email: dado.email,
          cep: dado.cep,
          rua: dado.rua,
          numero: dado.numero,
          bairro: dado.bairro,
          cidade: dado.cidade,
          uf: dado.uf,
          complemento: req.body.complemento
        }
      })
    }
    res.render("empresa/index", {dadosEmpresa: context.dadosEmpresa})
  }).catch((erro) => {
    req.flash("msg_erro", "Erro: "+ erro)
    res.redirect("/empresa/index")
  })

}

exports.store = (req, res) => {
  Empresa.create({
    name: req.file.originalname,
    size: req.file.size,
    key: req.file.filename,
    nomeFantasia: req.body.nomeFantasia,
    razaoSocial: req.body.razaoSocial,
    cnpj: req.body.cnpj,
    ie: req.body.ie,
    telefone: req.body.telefone,
    email: req.body.email,
    cep: req.body.cep,
    rua: req.body.rua,
    numero: req.body.numero,
    bairro: req.body.bairro,
    cidade: req.body.cidade,
    uf: req.body.uf,
    complemento: req.body.complemento

  }).then(() => {
    req.flash("msg_sucesso", "Dados salvo com sucesso!")
    res.redirect("/empresa/index")
  }).catch((erro) => {
    req.flash("msg_erro", "Erro: "+ erro)
    res.redirect("/empresa/index")
  })
}

exports.update = (req, res) => {
  Empresa.findByPk(req.body.id).then((empresa) =>{
    var name = req.body.nome
    var size = req.body.size
    var key = req.body.key

    if(req.file != undefined){
      promisify(fs.unlink)( path.resolve(__dirname, "..", "public", "uploads", req.body.key)).catch(erro => {
        req.flash("msg_erro", "Não foi possível excluir a imagem!" + erro)
        res.redirect("/empresa/index")
      })
      name = req.file.originalname
      size = req.file.size
      key = req.file.filename
    }
    empresa.name = name,
    empresa.size = size,
    empresa.key = key,
    empresa.nomeFantasia = req.body.nomeFantasia,
    empresa.razaoSocial = req.body.razaoSocial,
    empresa.cnpj = req.body.cnpj,
    empresa.ie = req.body.ie,
    empresa.telefone = req.body.telefone,
    empresa.email = req.body.email,
    empresa.cep = req.body.cep,
    empresa.rua = req.body.rua,
    empresa.numero = req.body.numero,
    empresa.bairro = req.body.bairro,
    empresa.cidade = req.body.cidade,
    empresa.uf = req.body.uf,
    empresa.complemento = req.body.complemento

    empresa.save().then(() => {
      req.flash("msg_sucesso", "Dados salvo com sucesso!")
      res.redirect("/empresa/index")
    }).catch((erro) => {
      req.flash("msg_erro", "Não foi possível salvar os dados!" + erro)
      res.redirect("/empresa/index")
    })
  }).catch((erro) => {
    req.flash("msg_erro", "Não foi possível salvar os dados!" + erro)
    res.redirect("/empresa/index")
  })
}
