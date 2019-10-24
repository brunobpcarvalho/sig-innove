
$('.add').click( function() {
  $('.editar').css("visibility","hidden");
  $('.salvar').css("visibility","visible");
})
$('.edit').click( function() {
  $('.editar').css("visibility","visible");
  $('.salvar').css("visibility","hidden");
})


/* --------------  FORMULARIO DE PESSOAS --------------------------------------*/
$('#tel1').mask('(00) 0000-0000');
$('#tel2').mask('(00) 00000-0000');
$('#cpf_cnpj').mask('000.000.000-00');

$( "#tipo" ).change(function(){
  if(this.value === 'Juridica') {
    $('#cpf_cnpj').mask('00.000.000/0000-00');
    $('#Juridica').css("visibility","visible");
    $('#Fisica').css("visibility","hidden");
    $("#cpf_cnpj").val("");
  } else if(this.value === 'Fisica'){
    $('#cpf_cnpj').mask('000.000.000-00');
    $('#Fisica').css("visibility","visible");
    $('#Juridica').css("visibility","hidden");
    $("#cpf_cnpj").val("");
  }
});

function validarFormPessoa(Valor){
  var nome = formPessoa.nome.value.trim().toLowerCase();
  var cpf_cnpj = formPessoa.cpf_cnpj.value;
  var tipo = formPessoa.tipo.value;
  var erros = [];

  if(!nome || typeof nome == undefined || nome == null){
    erros.push("Nome");
  }

  if(!cpf_cnpj || typeof cpf_cnpj == undefined || cpf_cnpj == null){
    erros.push("CPF/CNPJ");
  }

  if(erros.length > 0 && erros.length == 1){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "O campo " + erros + " não foi preenchido!",
    })
    return false;
  }else if(erros.length > 1){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "Os campos " + erros + " não foram preenchidos!",
    })
    return false;
  }

  if(Valor == 'adicionar'){
    var tabela = document.body.querySelectorAll("#tabelaPessoas td:nth-child(2)");
    for(var x = 0; x < tabela.length; x++){
      if(cpf_cnpj === tabela[x].textContent.trim().toLowerCase()){
        var cpf_cnpjResult = tabela[x].textContent.trim().toLowerCase();
        break;
      }
    }
    if(cpf_cnpjResult){
      Swal.fire({
        type: 'error',
        title: 'Erro ...',
        text: "Já existe uma pessoa cadastrada com esse CPF/CNPJ",
      })
      return false;
    }
    document.formPessoa.action = '/pessoas/listPessoa/nova';
    document.formPessoa.submit();
  }else if(Valor == "editar"){
    document.formPessoa.action = '/pessoas/listPessoa/editar';
    document.formPessoa.submit();
  }
}

$('#modalPessoa').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var id = button.data('id')
  var nome = button.data('nome')
  var tipo = button.data('tipo')
  var funcao = button.data('funcao')
  var cpf_cnpj = button.data('cpf_cnpj')
  var ie = button.data('ie')
  var razao_social = button.data('razao_social')
  var nome_mae = button.data('nome_mae')
  var cep = button.data('cep')
  var rua = button.data('rua')
  var numero = button.data('numero')
  var bairro = button.data('bairro')
  var cidade = button.data('cidade')
  var uf = button.data('uf')
  var tel1 = button.data('tel1')
  var tel2 = button.data('tel2')
  var email = button.data('email')
  var ativo = button.data('ativo')

  if(tipo === "Fisica"){
    document.getElementById( 'Fisica' ).style.visibility = 'visible';
    document.getElementById( 'Juridica' ).style.visibility = 'hidden';
  }else if(tipo === "Juridica"){
    document.getElementById( 'Juridica' ).style.visibility = 'visible';
    document.getElementById( 'Fisica' ).style.visibility = 'hidden';
  }
  var modal = $(this)
  modal.find('#id').val(id)
  modal.find('#nome').val(nome)
  modal.find('#tipo').val(tipo)
  modal.find('#funcao').val(funcao)
  modal.find('#cpf_cnpj').val(cpf_cnpj)
  modal.find('#ie').val(ie)
  modal.find('#razao_social').val(razao_social)
  modal.find('#nome_mae').val(nome_mae)
  modal.find('#cep').val(cep)
  modal.find('#rua').val(rua)
  modal.find('#numero').val(numero)
  modal.find('#bairro').val(bairro)
  modal.find('#cidade').val(cidade)
  modal.find('#uf').val(uf)
  modal.find('#tel1').val(tel1)
  modal.find('#tel2').val(tel2)
  modal.find('#email').val(email)
  modal.find('#ativo').val(ativo)
})

/* --------------  FORMULARIO DE USUARIOS --------------------------------------*/

function addSaveUsuario(acao){
  if(acao === 'Alterando'){
    $('.editar').css("visibility","visible");
    $('.salvar').css("visibility","hidden");
    $('#divSenha').css("visibility","hidden");
  }else if(acao === 'Adicionando'){
    $('.editar').css("visibility","hidden");
    $('.salvar').css("visibility","visible");
    $('#divSenha').css("visibility","visible");
  }
}

function validarFormUsuario(Valor){
  var nome = formUsuario.nome.value.trim().toLowerCase();
  var usuario = formUsuario.usuario.value;
  var nivelAcesso = formUsuario.nivelAcesso.value;
  var erros = [];

  if(!nome || typeof nome == undefined || nome == null){
    erros.push("Nome");
  }
  if(!usuario || typeof usuario == undefined || usuario == null){
    erros.push("Usuario");
  }

  if(erros.length > 0 && erros.length == 1){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "O campo " + erros + " não foi preenchido!",
    })
    return false;
  }else if(erros.length > 1){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "Os campos " + erros + " não foram preenchidos!",
    })
    return false;
  }

  if(Valor == 'adicionar'){
    var tabela = document.body.querySelectorAll("#tabelaUsuarios td:nth-child(2)");
    for(var x = 0; x < tabela.length; x++){
      if(usuario === tabela[x].textContent.trim().toLowerCase()){
        var usuarioResult = tabela[x].textContent.trim().toLowerCase();
        break;
      }
    }
    if(usuarioResult){
      Swal.fire({
        type: 'error',
        title: 'Erro ...',
        text: "Já existe alguem cadastrado(a) com esse Usuario",
      })
      return false;
    }
    document.formUsuario.action = '/usuarios/listUsuario/nova';
    document.formUsuario.submit();
  }else if(Valor == "editar"){
    document.formUsuario.action = '/usuarios/listUsuario/editar';
    document.formUsuario.submit();
  }
}

$('#modalUsuario').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var id = button.data('id')
  var nome = button.data('nome')
  var usuario = button.data('usuario')
  var nivelAcesso = button.data('nivel')
  var ativo = button.data('ativo')

  var modal = $(this)
  modal.find('#id').val(id)
  modal.find('#nome').val(nome)
  modal.find('#usuario').val(usuario)
  modal.find('#nivelAcesso').val(nivelAcesso)
  modal.find('#ativo').val(ativo)
})

/* --------------  FORMULARIO DE CATEGORIAS --------------------------------------*/

function validarFormCategoria(Valor){
  var nome = formCategoria.nome.value.trim().toLowerCase();
  var erros = [];

  if(!nome || typeof nome == undefined || nome == null){
    erros.push("Nome");
  }

  if(erros.length > 0){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "Preencha o Nome da Categoria!",
    })
    return false;
  }

  if(Valor == 'adicionar'){
    var tabela = document.body.querySelectorAll("#tabelaCategorias td:nth-child(1)");
    for(var x = 0; x < tabela.length; x++){
      if(nome === tabela[x].textContent.trim().toLowerCase()){
        var nomeResult = tabela[x].textContent.trim().toLowerCase();
        break;
      }
    }
    if(nomeResult){
      Swal.fire({
        type: 'error',
        title: 'Erro ...',
        text: "Já existe uma Categoria registrada com esse Nome!",
      })
      return false;
    }
    document.formCategoria.action = '/produtos/listCategoria/nova';
    document.formCategoria.submit();
  }else if(Valor == "editar"){
    document.formCategoria.action = '/produtos/listCategoria/editar';
    document.formCategoria.submit();
  }
}

$('#modalCategoria').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var id = button.data('id')
  var nome = button.data('nome')
  var ativo = button.data('ativo')

  var modal = $(this)
  modal.find('#id').val(id)
  modal.find('#nome').val(nome)
  modal.find('#ativo').val(ativo)
})

/* --------------  FORMULARIO DE MODELO --------------------------------------*/

function validarFormModelo(Valor){
  var descricao = formModelo.descricao.value.trim().toLowerCase();
  var categoria = formModelo.categoria.value;
  var erros = [];

  if(!descricao || typeof descricao == undefined || descricao == null){
    erros.push("Nome");
  }
  if(!categoria || typeof categoria == undefined || categoria == null){
    erros.push("Categoria");
  }

  if(erros.length > 0 && erros.length == 1){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "O campo " + erros + " não foi preenchido!",
    })
    return false;
  }else if(erros.length > 1){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "Os campos " + erros + " não foram preenchidos!",
    })
    return false;
  }

  var value = $('#categoria').val();
  var id = $('#listaModelos [value="' + value + '"]').data('value')

  if(Valor == 'adicionar'){
    var tabela = document.body.querySelectorAll("#tabelaModelos td:nth-child(1)");
    for(var x = 0; x < tabela.length; x++){
      if(descricao === tabela[x].textContent.trim().toLowerCase()){
        var descricaoResult = tabela[x].textContent.trim().toLowerCase();
        break;
      }
    }
    if(descricaoResult){
      Swal.fire({
        type: 'error',
        title: 'Erro ...',
        text: "Já existe um Modelo registrado com essa Descrição!",
      })
      return false;
    }
    $('#categoria').val(id);
    document.formModelo.action = '/produtos/listModelo/nova';
    document.formModelo.submit();
  }else if(Valor == "editar"){
    $('#categoria').val(id);
    document.formModelo.action = '/produtos/listModelo/editar';
    document.formModelo.submit();
  }
}

$('#modalModelo').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var id = button.data('id')
  var descricao = button.data('descricao')
  var categoria = button.data('categoria')
  var ativo = button.data('ativo')

  var modal = $(this)
  modal.find('#id').val(id)
  modal.find('#descricao').val(descricao)
  modal.find('#categoria').val(categoria)
  modal.find('#ativo').val(ativo)
})

/* --------------  FORMULARIO DE FABRICANTE -----------------------------------*/

function validarFormFabricante(Valor){
  var nome = formFabricante.nome.value.trim().toLowerCase();
  var erros = [];

  if(!nome || typeof nome == undefined || nome == null){
    erros.push("Nome");
  }

  if(erros.length > 0){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "Preencha a descricao do Modelo!",
    })
    return false;
  }

  if(Valor == 'adicionar'){
    var tabela = document.body.querySelectorAll("#tabelaFabricantes td:nth-child(1)");
    for(var x = 0; x < tabela.length; x++){
      if(nome === tabela[x].textContent.trim().toLowerCase()){
        var nomeResult = tabela[x].textContent.trim().toLowerCase();
        break;
      }
    }
    if(nomeResult){
      Swal.fire({
        type: 'error',
        title: 'Erro ...',
        text: "Já existe um Fabricante registrado com esse nome!",
      })
      return false;
    }
    document.formFabricante.action = '/produtos/listFabricante/nova';
    document.formFabricante.submit();
  }else if(Valor == "editar"){
    document.formFabricante.action = '/produtos/listFabricante/editar';
    document.formFabricante.submit();
  }
}

$('#modalFabricante').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var id = button.data('id')
  var nome = button.data('nome')
  var ativo = button.data('ativo')

  var modal = $(this)
  modal.find('#id').val(id)
  modal.find('#nome').val(nome)
  modal.find('#ativo').val(ativo)
})

/* --------------  FORMULARIO DE PRODUTO -----------------------------------*/
$('.money').mask("###0.00", {reverse: true});

function validarFormProduto(Valor){
  var descricao = formProduto.descricao.value.trim().toLowerCase();
  var fabricante = formProduto.fabricante.value;
  var modelo = formProduto.modelo.value;
  var valorUnitario = formProduto.valorUnitario.value;
  var erros = [];

  if(!descricao || typeof descricao == undefined || descricao == null){erros.push("Descrição");}
  if(!fabricante || typeof fabricante == undefined || fabricante == null){erros.push("Fabricante");}
  if(!modelo || typeof modelo == undefined || modelo == null){erros.push("Modelo");}
  if(!valorUnitario || typeof valorUnitario == undefined || valorUnitario == null){erros.push("Valor Unitario");}

  if(erros.length > 0 && erros.length == 1){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "O campo " + erros + " não foi preenchido!",
    })
    return false;
  }else if(erros.length > 1){
    Swal.fire({
      type: 'error',
      title: 'Erro ...',
      text: "Os campos " + erros + " não foram preenchidos!",
    })
    return false;
  }
  var valueModelo = $('#modelo').val();
  var idModelo = $('#listaModelos [value="' + valueModelo + '"]').data('value')

  var valueFabricante = $('#fabricante').val();
  var idFabricante = $('#listaFabricantes [value="' + valueFabricante + '"]').data('value')

  if(Valor == 'adicionar'){
    var tabela = document.body.querySelectorAll("#tabelaProdutos td:nth-child(1)");
    for(var x = 0; x < tabela.length; x++){
      if(descricao === tabela[x].textContent.trim().toLowerCase()){
        var descricaoResult = tabela[x].textContent.trim().toLowerCase();
        break;
      }
    }
    if(descricaoResult){
      Swal.fire({
        type: 'error',
        title: 'Erro ...',
        text: "Já existe um Produto registrado com essa descrição!",
      })
      return false;
    }
    $('#fabricante').val(idFabricante);
    $('#modelo').val(idModelo);
    document.formProduto.action = '/produtos/listProduto/nova';
    document.formProduto.submit();
  }else if(Valor == "editar"){
    $('#fabricante').val(idFabricante);
    $('#modelo').val(idModelo);
    document.formProduto.action = '/produtos/listProduto/editar';
    document.formProduto.submit();
  }
}

$('#modalProduto').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var id = button.data('id')
  var descricao = button.data('descricao')
  var unidadeMedida = button.data('unidade')
  var fabricante = button.data('fabricante')
  var modelo = button.data('modelo')
  var valorUnitario = button.data('valor')
  var ativo = button.data('ativo')

  var modal = $(this)
  modal.find('#id').val(id)
  modal.find('#descricao').val(descricao)
  modal.find('#unidadeMedida').val(unidadeMedida)
  modal.find('#fabricante').val(fabricante)
  modal.find('#modelo').val(modelo)
  modal.find('#valorUnitario').val(valorUnitario)
  modal.find('#ativo').val(ativo)
})
/* -----------------------------------------------------------------------------------------------------*/
$('#addParcelas').on('click', function(){
  var parcelas = $('#parcelas').val();
  var total = $('#total').val();

  var valorParcela = (total / parcelas).toFixed(2);

  for(var x = 0; x < parcelas; x++){
    var newRow = $('<tr>');
    var cols = "";
    cols += '<td>'
    + '<select name="formaPagamentoParcela[]" class="form-control">'
    + '<option value="Dinheiro"> Dinheiro </option>'
    + '<option value="Cheque"> Cheque </option>'
    + '<option value="CartaoC"> Cartão de Crédito </option>'
    + '<option value="CartaoD"> Cartão de Débito </option>'
    + '<option value="Boleto"> Boleto </option></select>'
    '</td>';

    cols += '<td>'
    + '<input class="inputData form-control" type="date" name="dataCompraParcela[]" value="">'
    + '</td>';

    cols += '<td>'
    + '<input class="money form-control" type="text" name="valorParcela[]" value="'+ valorParcela +'">'
    + '</td>';

    cols += '<td>' + '<button type="button" onclick="RemoveTableRow(this)" name="button" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>' + '</td>';

    newRow.append(cols);

    $("#tabelaParcelas").append(newRow);
    $('.inputData').val(new Date().DataAtual());
  }
  
});
$(document).ready(function(){
  $('.inputData').val(new Date().DataAtual());

  var input;

  $(document).on('blur', '#desconto', function(){
    $('#total').val(Total());
  });

  $(document).on('click', '.linha', function(){
    input = this.getElementsByTagName("INPUT");
  });

  $(document).on('blur', '.valorUnitario', function(){
    input[3].value = SubTotal(this.value, input[1].value)
    $('#total').val(Total());
  });

  $(document).on('change', '.quantidade', function(){
    input[3].value = SubTotal(input[2].value, this.value)
    $('#total').val(Total());
  });

  function SubTotal(vlrUnit, quant){
    return (vlrUnit * quant).toFixed(2);
  }
  function Total(){
    var tabela = document.body.querySelectorAll("#tabelaItens td:nth-child(4) input");

    var total = 0.0;
    for(var x = 0; x < tabela.length; x++){
      var val = parseFloat(tabela[x].value);

      total += val;
    }
    total -= $('#desconto').val();
    return total.toFixed(2);
  }

  $(document).on('change', '.item', function () {

    var prod = input[0].value;
    var valor = $('#listaProdutos [value="' + prod + '"]').data('valor')
    input[2].value = valor;

    input[3].value = SubTotal(input[2].value, input[1].value)
    $('#total').val(Total());

    var tdItens = $("#tdItens").html();
    var tdQuant = $("#tdQuant").html();
    var tdValor = $("#tdValor").html();
    var tdTotal = $("#tdTotal").html();
    var newRow = $('<tr class="linha">');
    var cols = "";
    cols += '<td>' + tdItens + '</td>';
    cols += '<td>' + tdQuant + '</td>';
    cols += '<td>' + tdValor + '</td>';
    cols += '<td>' + tdTotal + '</td>';
    cols += '<td>' + '<button type="button" onclick="RemoveTableRow(this)" name="button" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>' + '</td>';

    newRow.append(cols);

    $("#tabelaItens").append(newRow);
    $('.money').mask("###0.00", {reverse: true});
    return false;
  });

  RemoveTableRow = function (handler) {
    var tr = $(handler).closest('tr');
    tr.remove();        
    $('#total').val(Total());
    return false;
  };

  $('#salvarVenda').on('click', function(){
    var input = document.body.querySelectorAll("#tabelaItens td:nth-child(1) input");
    console.log(input);
    for (var i = 0; i < input.length; i++) {

      var prod = input[i].value;
      var valor = $('#listaProdutos [value="' + prod + '"]').data('id')

      input[i].value = valor;
    }
    var value = $('#cliente').val();
    var id = $('#listaCliente [value="' + value + '"]').data('value')
    $('#cliente').val(id);

    document.formVenda.action = '/vendas/addVenda/nova';
    document.formVenda.submit();
  });
});