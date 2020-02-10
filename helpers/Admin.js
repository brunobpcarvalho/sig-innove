module.exports = {
  Admin: function(req, res, next){
    if(req.isAuthenticated()){
      if(req.user.nivelAcesso == 'Administrador'){
        return next();
      }else{
        req.flash("msg_erro", "Voce deve ter permissão de Administrador para acessar essa Página");
        res.redirect("/index");
      }
    }else{
      req.flash("error", "Faça login para acessar essa página!");
      res.redirect("/");
    }
  }
}
