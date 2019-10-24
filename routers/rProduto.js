const express = require("express");
const router = express.Router();
const db = require('../config/conexao')
const Categoria = require("../models/Categoria");
const Fabricante = require("../models/Fabricante");
const Modelo = require("../models/Modelo");
const Produto = require("../models/Produto");
const {User} = require("../helpers/User")

/*----------------------------- CATEGORIA -----------------------------------*/

router.get('/listCategoria', User, (req, res) => {
  Categoria.findAll().then((categorias) => { // sort serve para ordenar pela data
    res.render("produtos/listCategoria", {categorias: categorias});
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post('/listCategoria/nova', User, (req, res) => {
    Categoria.create({
      nome: req.body.nome,
      ativo: req.body.ativo
    }).then(() => {
      res.redirect("/produtos/listCategoria");
    }).catch((erro) => {
      res.redirect("/index");
    });
});

router.post('/listCategoria/deletar', User, (req, res) => {
  Modelo.findAll({where: {categoriaId: req.body.id}}).then((modelo) =>{
    if(modelo.length == 0){
      Categoria.destroy({where: {id: req.body.id}}).then(() => {
        req.flash("msg_sucesso", "Categoria deletada com sucesso!")
        res.redirect("/produtos/listCategoria");
      }).catch((erro) => {
        res.redirect("/index");
      });
    }else {
      console.log(modelo);
      req.flash("msg_erro", "Não é possivel excluir essa categoria, pois esta sendo utilizada em um Modelo!")
      res.redirect("/produtos/listCategoria");
    }
  }).catch((erro)=>{
    res.redirect("/produtos/listCategoria");
  })
});

router.post("/listCategoria/editar", User, (req, res) => {
  Categoria.findByPk(id = req.body.id).then((categoria) =>{
    categoria.nome = req.body.nome,
    categoria.ativo = req.body.ativo

    categoria.save().then(() => {
      res.redirect("/produtos/listCategoria");
    }).catch((erro) => {
      res.redirect("/index");
    });
  }).catch((erro) => {
    res.redirect("/index");
  });
});

/*----------------------------- MODELO -----------------------------------*/

router.get('/listModelo', User, (req, res) => {
  Modelo.findAll({include: [{ model: Categoria, as: 'categoria' }]}).then((modelos) => {
    Categoria.findAll({where: {ativo: 'Ativo'}}).then((categorias) => {
      res.render("produtos/listModelo", {modelos: modelos, categorias: categorias});
    }).catch((erro) => {
      res.redirect("/index");
    });
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post('/listModelo/nova', User, (req, res) => {
  const novoModelo = new Modelo({
    descricao: req.body.descricao,
    ativo: req.body.ativo,
    categoriaId: req.body.categoria
  });
  novoModelo.save().then(() => {
    res.redirect("/produtos/listModelo");
  }).catch((erro) => {
    console.log(erro);
    req.flash("msg_erro", "Erro ao salvar")
    res.redirect("/index");
  });
});

router.post('/listModelo/deletar', User, (req, res) => {
  Produto.findAll({where: {modeloId: req.body.id}}).then((modelo) =>{
    if(modelo.length == 0){
      Modelo.destroy({where: {id: req.body.id}}).then(() => {
        req.flash("msg_sucesso", "Modelo deletado com sucesso!")
        res.redirect("/produtos/listModelo");
      }).catch((erro) => {
        req.flash("msg_erro", "Erro: " + erro)
        res.redirect("/index");
      });
    }else {
      req.flash("msg_erro", "Não é possivel excluir esse Modelo, pois esta sendo utilizado em um Produto!")
      res.redirect("/produtos/listModelo");
    }
  }).catch((erro)=>{
    req.flash("msg_erro", "Erro: " + erro)
    res.redirect("/produtos/listModelo");
  });
});

router.post("/listModelo/editar", User, (req, res) => {
  Modelo.findByPk(id = req.body.id).then((modelo) =>{
    modelo.descricao = req.body.descricao,
    modelo.categoriaId = req.body.categoria,
    modelo.ativo = req.body.ativo

    modelo.save().then(() => {
      res.redirect("/produtos/listModelo");
    }).catch((erro) => {
      console.log("Erro: " + erro)
      res.redirect("/index");
    });
  }).catch((erro) => {
    console.log("Erro: " + erro)
    res.redirect("/index");
  });
});

/*----------------------------- FABRICANTE -----------------------------------*/

router.get('/listFabricante', User, (req, res) => {
  Fabricante.findAll().then((fabricantes) => { // sort serve para ordenar pela data
    res.render("produtos/listFabricante", {fabricantes: fabricantes});
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post('/listFabricante/nova', User, (req, res) => {
  Fabricante.create({
    nome: req.body.nome,
    ativo: req.body.ativo
  }).then(() => {
    res.redirect("/produtos/listFabricante");
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post('/listFabricante/deletar', User, (req, res) => {
  Produto.findAll({where: {fabricanteId: req.body.id}}).then((fabricante) =>{
    if(fabricante.length < 1){
      Fabricante.destroy({where: {id: req.body.id}}).then(() => {
        req.flash("msg_sucesso", "Fabricante deletado com sucesso!")
        res.redirect("/produtos/listFabricante");
      }).catch((erro) => {
        res.redirect("/index");
      });
    }else {
      req.flash("msg_erro", "Não é possivel excluir esse Fabricante, pois esta sendo utilizado em um Produto!")
      res.redirect("/produtos/listFabricante");
    }
  }).catch((erro)=>{
    console.log(erro);
    res.redirect("/produtos/listFabricante");
  });
});

router.post("/listFabricante/editar", User, (req, res) => {
  Fabricante.findByPk(id = req.body.id).then((fabricante) =>{
    fabricante.nome = req.body.nome,
    fabricante.ativo = req.body.ativo

    fabricante.save().then(() => {
      res.redirect("/produtos/listFabricante");
    }).catch((erro) => {
      req.flash("msg_erro", "Erro: " + erro)
      res.redirect("/produtos/listFabricante");
    });
  }).catch((erro) => {
    req.flash("msg_sucesso", "Erro: " + erro)
    res.redirect("/produtos/listFabricante");
  });
});

/*----------------------------- PRODUTO -----------------------------------*/

router.get('/listProduto', User, (req, res) => {
  Produto.findAll({include: [{ model: Fabricante, as: 'fabricante' }, { model: Modelo, as: 'modelo' }]}).then((produtos) => {
    Modelo.findAll({where: {ativo: 'Ativo'}}).then((modelos) => {
      Fabricante.findAll({where: {ativo: 'Ativo'}}).then((fabricantes) => {
        res.render("produtos/listProduto", {produtos: produtos, fabricantes: fabricantes, modelos: modelos});
      }).catch((erro) => {
        req.flash("msg_erro", "Erro fabricante: " + erro)
        res.redirect("/index");
      });
    }).catch((erro) => {
      req.flash("msg_erro", "Erro modelo: " + erro)
      res.redirect("/index");
    });
  }).catch((erro) => {
    req.flash("msg_erro", "Erro Produto: " + erro)
    res.redirect("/index");
  });
});

router.post('/listProduto/nova', User, (req, res) => {
  const novoProduto = new Produto({
    descricao: req.body.descricao,
    unidadeMedida: req.body.unidadeMedida,
    fabricanteId: req.body.fabricante,
    modeloId: req.body.modelo,
    valorUnitario: req.body.valorUnitario,
    ativo: req.body.ativo
  });
  novoProduto.save().then(() => {
    res.redirect("/produtos/listProduto");
  }).catch((erro) => {
    req.flash("msg_erro", "Erro: " + erro)
    res.redirect("/produtos/listProduto");
  });
});

router.post('/listProduto/deletar', User, (req, res) => {
  Produto.destroy({where: {id: req.body.id}}).then(() => {
    req.flash("msg_sucesso", "Produto deletado com sucesso!")
    res.redirect("/produtos/listProduto");
  }).catch((erro) => {
    res.redirect("/index");
  });
});

router.post("/listProduto/editar", User, (req, res) => {
  Produto.findByPk(id = req.body.id).then((produto) =>{
    produto.descricao = req.body.descricao,
    produto.unidadeMedida = req.body.unidadeMedida,
    produto.fabricanteId = req.body.fabricante,
    produto.modeloId = req.body.modelo,
    produto.valorUnitario = req.body.valorUnitario,
    produto.ativo = req.body.ativo

    produto.save().then(() => {
      res.redirect("/produtos/listProduto");
    }).catch((erro) => {
      req.flash("msg_sucesso", "Erro: " + erro)
      res.redirect("/produtos/listProduto");
    });
  }).catch((erro) => {
    req.flash("msg_sucesso", "Erro: " + erro)
    res.redirect("/produtos/listProduto");
  });
});

/*----------------------------------------------------------------------------*/
module.exports = router;
