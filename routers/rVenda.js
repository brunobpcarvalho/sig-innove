const express = require("express");
const router = express.Router();
const Sequelize = require('sequelize')
var db = require("../config/conexao");
const Op = Sequelize.Op;
const Venda = require("../models/Venda");
const Usuario = require("../models/usuario");
const Pessoa = require("../models/pessoa");
const Produto = require("../models/produto");
const ItensVenda = require("../models/ItensVenda");
const {Admin} = require("../helpers/Admin")
/*----------------------------------------------------------------------------*/

router.get('/listVenda', Admin, (req, res) => {
  Venda.findAll({include: [{ model: Pessoa, as: 'pessoa' }, { model: Usuario, as: 'usuario' }]}).then((vendas) => {
    res.render("vendas/listVenda", {vendas: vendas});
  }).catch((erro) => {
    req.flash("msg_erro", "Erro: Não foi possível listar a pagina de Venda!")
    res.redirect("/index");
  });
});

router.get('/addVenda', Admin, (req, res) => {
  Pessoa.findAll({where: {[Op.and]: [{funcao: 'Cliente'}, {ativo: 'Ativo'}]}}).then((clientes) => {
    Produto.findAll({where: {ativo: 'Ativo'}}).then((produtos) => {
      res.render("vendas/addVenda", {produtos: produtos, clientes: clientes});
    }).catch((erro) => {
      req.flash("msg_erro", "Erro: Não foi possível listar os Produtos")
      res.redirect("/index");
    });
  }).catch((erro) => {
    req.flash("msg_erro", "Erro: Não foi possível listar os Clientes!")
    res.redirect("/index");
  });
});

router.post('/addVenda/nova', Admin, async (req, res) => {

  const venda = await Venda.create({ usuarioId, pessoaId, dataVenda, valorTotal, desconto, formaPagamento } = req.body);

  const itens = req.body.produtos;
  const quantidade = req.body.quantidade;
  const valorUnit = req.body.valorUnitario;
  const subTotal = req.body.subTotal;
  itens.pop();
  valorUnit.pop();
  subTotal.pop();
  quantidade.pop();
  for (var i = 0; i < itens.length; i++) {
    const itensVenda = new ItensVenda({
      quantidade: quantidade[i],
      valorUnitario: valorUnit[i],
      valorTotal: subTotal[i],
      desconto: req.body.desconto,
      vendaId: venda.id,
      produtoId: itens[i]
    });
    itensVenda.save().then(() => {
      req.flash("msg_sucesso", "Venda salva com sucesso!")
      res.redirect("/vendas/listVenda");
    }).catch((erro) => {
      req.flash("msg_erro", "Erro: Não foi possível salvar itens da venda!")
      res.redirect("/vendas/listVenda");
    });
  }
  
});

router.post('/listVenda/deletar', Admin, (req, res) => {
  ItensVenda.destroy({where: {vendaId: req.body.id}}).then(() => {
    Venda.destroy({where: {id: req.body.id}}).then(() => {
      req.flash("msg_sucesso", "Venda deletada com sucesso!")
      res.redirect("/vendas/listVenda");
    }).catch((erro) => {
      req.flash("msg_erro", "Erro: Houve um erro ao deletar a venda")
      res.redirect("/vendas/listVenda");
    });
  }).catch((erro) => {
    req.flash("msg_erro", "Erro: Houve um erro ao deletar os itens desta venda")
    res.redirect("/vendas/listVenda");
  });  
});

router.get("/listVenda/editar/:id",(req, res) => {
  Venda.findOne({where: {id: req.body.id}}).then((venda) =>{
      res.render("venda/editarVenda", {venda: venda})
  }).catch((erro) => {
    req.flash("error_msg", "Erro ao buscar ou listar essa venda");
    res.redirect("/vendas/listVenda");
  });
});

/*router.post("/categorias/edit",(req, res) => {
  Categoria.findOne({_id: req.body.id}).then((categoria) =>{
    categoria.nome = req.body.nome;
    categoria.slug = req.body.slug;

    categoria.save().then(() => {
      req.flash("success_msg", "Editado com sucesso");
      res.redirect("/admin/categorias");
    }).catch((erro) => {
      req.flash("error_msg", "ouve um erro");
      res.redirect("/admin/categorias");
    });
  }).catch((erro) => {
    req.flash("error_msg", "Erro ao editar");
    res.redirect("/admin/categorias");
  });
});*/


/*----------------------------------------------------------------------------*/
module.exports = router;
