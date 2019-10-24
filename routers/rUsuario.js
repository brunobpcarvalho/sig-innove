const express = require("express");
const router = express.Router();
var db = require("../config/conexao");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/listUsuario', Admin, (req, res) => {
  Usuario.findAll().then((usuarios) => { // sort serve para ordenar pela data
    res.render("usuarios/listUsuario", {usuarios: usuarios});
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post('/listUsuario/nova', Admin, (req, res) => {
  const novoUsuario = new Usuario({
    nome: req.body.nome,
    usuario: req.body.usuario,
    senha: req.body.senha,
    nivelAcesso: req.body.nivelAcesso,
    dataInclusao: req.body.dataInclusao,
    ativo: req.body.ativo
  });

  bcrypt.genSalt(10, (erro, salt) => {
    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
      if(erro){
        req.flash("msg_erro", "Houve um erro ao salva no genSalt");
        res.redirect("/");
      }
      novoUsuario.senha = hash;
      novoUsuario.save().then(() => {
        res.redirect("/usuarios/listUsuario");
      }).catch((erro) => {
        res.redirect("/index");
      });
    });
  });
});

router.post('/listUsuario/deletar', Admin, (req, res) => {
  Usuario.destroy({ where: {id: req.body.id}}).then(() => {
    res.redirect("/usuarios/listUsuario");
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post("/listUsuario/editar", Admin, (req, res) => {
  Usuario.findOne({ where: {id: req.body.id}}).then((usuario) =>{
    usuario.nome = req.body.nome,
    usuario.usuario = req.body.usuario,
    usuario.nivelAcesso = req.body.nivelAcesso,
    usuario.dataInclusao = req.body.dataInclusao,
    usuario.ativo = req.body.ativo

    usuario.save().then(() => {
      setTimeout(function() {
        res.redirect("/usuarios/listUsuario");
      }, 700);
    }).catch((erro) => {
      console.log("Erro: " + erro)
      res.redirect("/index");
    });
  }).catch((erro) => {
    console.log("Erro: " + erro)
    res.redirect("/index");
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/",
    failureFlash: true
  })(req, res, next)
});

router.get("/logout", (req,res) => {
  req.logout();
  req.flash("error", "Voce foi deslogado do Sistema!");
  res.redirect("/");
});

/*----------------------------------------------------------------------------*/
module.exports = router;
