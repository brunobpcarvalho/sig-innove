$('.add').click( function() {
	$('.editar').css("visibility","hidden");
	$('.salvar').css("visibility","visible");
})
$('.edit').click( function() {
	$('.editar').css("visibility","visible");
	$('.salvar').css("visibility","hidden");
})

$('#cnpj').mask('00.000.000/0000-00');


/* --------------  FORMULARIO DE PESSOAS --------------------------------------*/
$('#telefone').mask('(00) 0000-0000');
$('#celular').mask('(00) 00000-0000');
$('#cpf_cnpj').mask('000.000.000-00');

function Fisica(){
	$('#Fisica').css("visibility","visible");
	$('#Juridica').css("visibility","hidden");
	$('.dataNas').css("visibility", "visible");
}

function Juridica(){
	$('#Juridica').css("visibility","visible");
	$('#Fisica').css("visibility","hidden");
	$('.dataNas').css("visibility", "hidden");
}

$( "#tipo" ).change(function(){
	if(this.value === 'Juridica') {
		$('#cpf_cnpj').mask('00.000.000/0000-00');
		Juridica();
		$("#cpf_cnpj").val("");
	} else if(this.value === 'Fisica'){
		$('#cpf_cnpj').mask('000.000.000-00');
		Fisica();
		$("#cpf_cnpj").val("");
	}
});

$(document).on('blur', '#dataNascimento', function () {
	hoje = new Date;
	nascimento = new Date($("#dataNascimento").val());
	var diferencaAnos = hoje.getFullYear() - nascimento.getFullYear();
	if (new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) <
	new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()))
	diferencaAnos--;

	if(diferencaAnos < 16) {
		Swal.fire({
			icon: 'warning',
			title: 'Atenção',
			text: "A idade minima para cadastro é de 16 anos!",
		})
		$("#dataNascimento").val('')
	}
});

function validarFormPessoa(Valor){
	var nome = $('#nome').val();
	var cpf_cnpj = $('#cpf_cnpj').val();
	var dataNascimento = $('#dataNascimento').val();
	var tipo = $('#tipo').val();
	var erros = [];

	if(!nome || typeof nome == undefined || nome == null){erros.push("Nome");}
	if(!cpf_cnpj || typeof cpf_cnpj == undefined || cpf_cnpj == null){erros.push("CPF/CNPJ");}
	if(tipo === 'Fisica'){
		if(!dataNascimento || typeof dataNascimento == undefined || dataNascimento == null){erros.push("Data de Nascimento");}
	}

	if(erros.length > 0 && erros.length == 1){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "O campo " + erros + " não foi preenchido!",
		})
		return false;
	}else if(erros.length > 1){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "Os campos " + erros + " não foram preenchidos!",
		})
		return false;
	}
	$.ajax({
		method: "POST",
		url: "/pessoas/list-pessoas/validar",
		data: { cpf_cnpj: cpf_cnpj }
	})
	.done( function (res) {

		if(Valor == 'adicionar'){
			if(res === 'existe'){
				Swal.fire({
					icon: 'error',
					title: 'Erro ...',
					text: "Já existe uma pessoa cadastrada com esse CPF/CNPJ!",
				})
			}else{
				document.formPessoa.action = '/pessoas/list-pessoas/nova';
				document.formPessoa.submit();
			}
		} else if(Valor == "editar"){
			document.formPessoa.action = '/pessoas/list-pessoas/editar';
			document.formPessoa.submit();
		}

	});
}

$('#modalPessoa').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)

	if(button.data('tipo') === "Fisica"){
		Fisica();
	}else if(button.data('tipo') === "Juridica"){
		Juridica();
	}
	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#nome').val(button.data('nome'))
	modal.find('#tipo').val(button.data('tipo'))
	modal.find('#funcao').val(button.data('funcao'))
	modal.find('#cpf_cnpj').val(button.data('cpf_cnpj'))
	modal.find('#ie').val(button.data('ie'))
	modal.find('#razao_social').val(button.data('razao_social'))
	modal.find('#nome_mae').val(button.data('nome_mae'))
	modal.find('#dataNascimento').val(button.data('data-nascimento'))
	modal.find('#cep').val(button.data('cep'))
	modal.find('#rua').val(button.data('rua'))
	modal.find('#numero').val(button.data('numero'))
	modal.find('#bairro').val(button.data('bairro'))
	modal.find('#cidade').val(button.data('cidade'))
	modal.find('#uf').val(button.data('uf'))
	modal.find('#complemento').val(button.data('complemento'))
	modal.find('#telefone').val(button.data('telefone'))
	modal.find('#celualar').val(button.data('celular'))
	modal.find('#email').val(button.data('email'))
	modal.find('#ativo').val(button.data('ativo'))
})

/* --------------  FORMULARIO DE USUARIOS --------------------------------------*/

function validarFormUsuario(){
	var usuario = $('#usuario').val();

	if(!usuario || typeof usuario == undefined || usuario == null){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "O campo usuario não foi preenchido!",
		})
		return false;
	}

	var tabela = document.body.querySelectorAll("#tabelaUsuarios td:nth-child(1)");
	for(var x = 0; x < tabela.length; x++){
		if(usuario === tabela[x].textContent.trim().toLowerCase()){
			var usuarioResult = tabela[x].textContent.trim().toLowerCase();
			break;
		}
	}
	if(usuarioResult){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "Já existe um funcionario cadastrado(a) com este Usuario",
		})
		return false;
	}
	document.formUsuario.action = '/usuarios/create';
	document.formUsuario.submit();
}

/* --------------  FORMULARIO DE CATEGORIAS --------------------------------------*/

function validarFormCategoria(Valor){
	var nome = $("#nome").val();
	var erros = [];

	if(!nome || typeof nome == undefined || nome == null){erros.push("Nome");}

	if(erros.length > 0){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "Preencha o Nome da Categoria!",
		})
		return false;
	}

	$.ajax({
		method: "POST",
		url: "/produtos/list-categorias/validar",
		data: { nome: nome }
	})
	.done( function (res) {
		if(res === 'existe'){
			Swal.fire({
				icon: 'error',
				title: 'Erro ...',
				text: "Já existe uma Categoria registrada com esse nome!",
			})
		}else {
			if(Valor == 'adicionar'){
				document.formCategoria.action = '/produtos/list-categorias/nova';
				document.formCategoria.submit();
			} else if(Valor == "editar"){
				document.formCategoria.action = '/produtos/list-categorias/editar';
				document.formCategoria.submit();
			}
		}
	});
}

$('#modalCategoria').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)

	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#nome').val(button.data('nome'))
	modal.find('#ativo').val(button.data('ativo'))
})

/* --------------  FORMULARIO DE MODELO --------------------------------------*/
$(document).on(validarFormModelo = function (Valor) {
	var descricao = $("#descricao").val();
	var erros = [];

	if(!descricao || typeof descricao == undefined || descricao == null){erros.push("Nome");}

	if(erros.length > 0){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "O campo " + erros + " não foi preenchido!",
		})
		return false;
	}


	$.ajax({
		method: "POST",
		url: "/produtos/list-modelos/validar",
		data: { descricao: descricao }
	})
	.done( function (res) {
		if(res === 'existe'){
			Swal.fire({
				icon: 'error',
				title: 'Erro ...',
				text: "Já existe um Modelo registrado com essa Descrição!",
			})
		}else {
			if(Valor == 'adicionar'){
				document.formModelo.action = '/produtos/list-modelos/nova';
				document.formModelo.submit();
			} else if(Valor == "editar"){
				document.formModelo.action = '/produtos/list-modelos/editar';
				document.formModelo.submit();
			}
		}
	});
})

$('#modalModelo').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)

	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#descricao').val(button.data('descricao'))
	modal.find('#ativo').val(button.data('ativo'))
})

/* --------------  FORMULARIO DE FABRICANTE -----------------------------------*/

function validarFormFabricante(Valor){
	var nome = $('#nome').val();
	var erros = [];

	if(!nome || typeof nome == undefined || nome == null){erros.push("Nome");}

	if(erros.length > 0){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "Preencha a descricao do Modelo!",
		})
		return false;
	}

	$.ajax({
		method: "POST",
		url: "/produtos/list-fabricantes/validar",
		data: { nome: nome }
	})
	.done( function (res) {
		if(res === 'existe'){
			Swal.fire({
				icon: 'error',
				title: 'Erro ...',
				text: "Já existe um Fabricante registrado com esse nome!",
			})
		}else {
			if(Valor == 'adicionar'){
				document.formFabricante.action = '/produtos/list-fabricantes/nova';
				document.formFabricante.submit();
			} else if(Valor == "editar"){
				document.formFabricante.action = '/produtos/list-fabricantes/editar';
				document.formFabricante.submit();
			}
		}
	});
}

$('#modalFabricante').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)

	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#nome').val(button.data('nome'))
	modal.find('#ativo').val(button.data('ativo'))
})

/* --------------  FORMULARIO DE PRODUTO -----------------------------------*/
$('.money').mask("###0.00", {reverse: true});

function validarFormProduto(Valor){
	var descricao = formProduto.descricao.value.trim().toLowerCase();
	var fabricante = formProduto.fabricante.value;
	var modelo = formProduto.modelo.value;
	var categoria = formProduto.categoria.value;
	var valorUnitario = formProduto.valorUnitario.value;
	var valorCusto = formProduto.valorCusto.value;
	var prazoRepozicao = formProduto.prazoRepozicao.value;

	var erros = [];

	if(!descricao || typeof descricao == undefined || descricao == null){erros.push(" Descrição");}
	if(!fabricante || typeof fabricante == undefined || fabricante == null){erros.push(" Fabricante");}
	if(!modelo || typeof modelo == undefined || modelo == null){erros.push(" Modelo");}
	if(!categoria || typeof categoria == undefined || categoria == null){erros.push(" Categoria");}
	if(!valorUnitario || typeof valorUnitario == undefined || valorUnitario == null){erros.push(" Valor Unitario");}
	if(!valorCusto || typeof valorCusto == undefined || valorCusto == null){erros.push(" Valor de Custo");}
	if(!prazoRepozicao || typeof prazoRepozicao == undefined || prazoRepozicao == null){erros.push(" Prazo de Reposição");}

	if(erros.length > 0 && erros.length == 1){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "O campo " + erros + " não foi preenchido!",
		})
		return false;
	}else if(erros.length > 1){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "Os campos " + erros + " não foram preenchidos!",
		})
		return false;
	}
	var valueModelo = $('#modelo').val();
	var idModelo = $('#listaModelos [value="' + valueModelo + '"]').data('value')

	var valueFabricante = $('#fabricante').val();
	var idFabricante = $('#listaFabricantes [value="' + valueFabricante + '"]').data('value')

	var valueCategoria = $('#categoria').val();
	var idCategoria = $('#listaCategorias [value="' + valueCategoria + '"]').data('value')

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
				icon: 'error',
				title: 'Erro ...',
				text: "Já existe um Produto registrado com essa descrição!",
			})
			return false;
		}
		$('#fabricante').val(idFabricante);
		$('#modelo').val(idModelo);
		$('#categoria').val(idCategoria);
		document.formProduto.action = '/produtos/list-produtos/nova';
		document.formProduto.submit();
	}else if(Valor == "editar"){
		$('#fabricante').val(idFabricante);
		$('#modelo').val(idModelo);
		$('#categoria').val(idCategoria);
		document.formProduto.action = '/produtos/list-produtos/editar';
		document.formProduto.submit();
	}
}

$('#modalProduto').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)

	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#descricao').val(button.data('descricao'))
	modal.find('#quantidade').val(button.data('quantidade'))
	modal.find('#fabricante').val(button.data('fabricante'))
	modal.find('#modelo').val(button.data('modelo'))
	modal.find('#categoria').val(button.data('categoria'))
	modal.find('#valorUnitario').val(button.data('valor'))
	modal.find('#ativo').val(button.data('ativo'))
})

/* ----------------------------------- VENDA ------------------------------------------------------*/

$('#addParcelas').on('click', function(){
	var parcelas = $('#parcelas').val();
	var total = $('#total').val();

	var valorParcela = (total / parcelas).toFixed(2);

	for(var x = 0; x < parcelas; x++){
		var newRow = $('<tr>');
		var cols = "";
		cols += '<td>'
		+ '<select name="formaPagamento[]" class="formaPag form-control">'
		+ '<option value="Dinheiro"> Dinheiro </option>'
		+ '<option value="Cheque"> Cheque </option>'
		+ '<option value="CartaoC"> Cartão de Crédito </option>'
		+ '<option value="CartaoD"> Cartão de Débito </option>'
		+ '<option value="Boleto"> Boleto </option></select>'
		'</td>';

		cols += '<td>'
		+ '<input class="inputData form-control" type="date" name="dataParcela[]" value="">'
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
	//Remove o botão de excluir do primeiro item ao editar uma venda.
	$('.tdAcao button').first().css("visibility", "hidden");

	//Verifica se o Status é  igual a VENDA, e desabilita os inputs e botões.
	if($("#status").val() == 'VENDA'){
		var FormVenda = $("#formVenda");
		FormVenda.find("input").attr("disabled", true)
		FormVenda.find("select").attr("disabled", true)
		$(".desativado").attr("disabled", true)
	}

	//Não deixa o valor dos campos de quantidade ficarem menores que 0.
	$(document).on( 'focusout', '.quantidade', function(){
		if($(this).val() < 0){
			$(this).val('1');
		}
	});

	$('#dataVenda').val(new Date().DataAtual());
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
		var desconto = $('#desconto').val();

		for(var x = 0; x < tabela.length; x++){
			var val = parseFloat(tabela[x].value);

			total += val;
		}
		if(desconto > total){
			$('#desconto').val('0.00');
			Swal.fire({
				icon: 'warning',
				title: 'Atenção',
				text: "O valor do desconto é maior que o Total da Venda!",
			})
		}else {
			total -= desconto;
		}
		return total.toFixed(2);
	}

	var tdItens = $(".tdItens").html();
	var tdQuant = $(".tdQuant").html();
	var tdValor = $(".tdValor").html();
	var tdTotal = $(".tdTotal").html();

	$(document).on('click', '#addItem', function(){

		var newRow = $('<tr class="linha">');
		var cols = "";
		cols += '<td>' + tdItens + '</td>';
		cols += '<td>' + tdQuant + '</td>';
		cols += '<td>' + tdValor + '</td>';
		cols += '<td>' + tdTotal + '</td>';
		cols += '<td>' + '<button type="button" onclick="RemoveTableRow(this)" name="button" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>' + '</td>';

		newRow.append(cols);

		$("#tabelaItens").append(newRow);
		$("#tabelaItens .item").last().val('');
		$("#tabelaItens .valorUnitario").last().val('');
		$("#tabelaItens .subTotal").last().val('');
		$("#tabelaItens .quantidade").last().val(1);

	});

	$(document).on('change', '.item', function () {

		var prod = input[0].value;
		var valor = $('#listaProdutos [value="' + prod + '"]').data('valor')
		input[2].value = valor;

		input[3].value = SubTotal(input[2].value, input[1].value)
		$('#total').val(Total());

		$('.money').mask("###0.00", {reverse: true});
		return false;
	});

	RemoveTableRow = function (handler) {
		var tr = $(handler).closest('tr');
		tr.remove();
		$('#total').val(Total());
		return false;
	};

	$(document).on(SalvarVenda = function (opcao) {
		var TabelaItens = $("#tabelaItens");
		var formaPag = $('.formaPag').val();
		var inputProduto =  TabelaItens.find("td:nth-child(1) input");
		var inputQuantidade = TabelaItens.find("td:nth-child(2) input");

		var quantidade = [];
		var ids = [];

		var produto = inputProduto[0].value;
		var cliente = formVenda.cliente.value;
		var erros = [];

		if(!cliente || typeof cliente == undefined || cliente == null){erros.push("Cliente");}
		if(!produto || typeof produto == undefined || produto == null){erros.push("Produto");}
		if(!formaPag || typeof formaPag == undefined || formaPag == null){erros.push("Pagamento");}

		if(erros.length > 0 && erros.length == 1){
			Swal.fire({
				icon: 'error',
				title: 'Erro ...',
				text: "O campo " + erros + " não foi preenchido!",
			})
			return false;
		}else if(erros.length > 1){
			Swal.fire({
				icon: 'error',
				title: 'Erro ...',
				text: "Os campos " + erros + " não foram preenchidos!",
			})
			return false;
		}

		for (var i = 0; i < inputProduto.length; i++) {
			var prod = inputProduto[i].value;
			var id = $('#listaProdutos [value="' + prod + '"]').data('id')

			ids.push(id);

			var quantidadeEstoque = $('#listaProdutos [value="' + prod + '"]').data('quantidade')
			if(quantidadeEstoque < inputQuantidade[i].value){
				quantidade.push(" " + prod);
			}
		}

		if(quantidade.length > 0){
			Swal.fire({
				icon: 'warning',
				title: 'Atenção',
				text: "Produtos com estoque insuficiente:" + quantidade,
			})
			return false;
		}
		for(var i = 0; i < inputProduto.length; i++) {
			inputProduto[i].value = ids[i];
		}

		if(opcao == 'adicionar'){
			var value = $('#cliente').val();
			var id = $('#listaCliente [value="' + value + '"]').data('value')
			$('#cliente').val(id);

			document.formVenda.action = '/vendas/add-venda/nova';
			document.formVenda.submit();

		} else if(opcao == "editar"){
			document.formVenda.action = '/vendas/list-vendas/update';
			document.formVenda.submit();
		}
	});
});

$(document).on(GerarFinan = function(id){
	Swal.fire({
		title: 'Deseja gerar financeiro?',
		text: "",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Sim!'
	}).then((result) => {
		if (result.value) {
			location.href = '/vendas/list-vendas/gerar-financeiro/' + id;
		}
	})
});

$(document).on(EstornarVenda = function(id){
	Swal.fire({
		title: 'Deseja realmente estornar esta venda?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Sim, estornar!'
	}).then((result) => {
		if (result.value) {
			location.href = '/vendas/list-vendas/estornar-venda/' + id;
		}
	})
});

$(document).on(AprovarVenda = function(id){
	Swal.fire({
		title: 'Deseja realmente aprovar esta venda?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Sim, aprovar!'
	}).then((result) => {
		if (result.value) {
			location.href = '/vendas/list-vendas/aprovar-venda/' + id;
		}
	})
});

/* --------------  FORMULARIO DE RECEBIMENTO --------------------------------------*/
$('#pagoTrue').css("visibility","hidden");

$( "#pago" ).change(function(){
	if(this.value === 'true') {
		CalcValorPago();
		$("#descontoRecPag").val('0.00')
		$('#pagoTrue').css("visibility","visible");
	} else if(this.value === 'false'){
		$('#pagoTrue').css("visibility","hidden");
	}
});
$("#valor").change(()=> {
	CalcValorPago();
})

$("#descontoRecPag").change(()=> {
	CalcValorPago();
	var input = $("#descontoRecPag")
	if(!input.val() || typeof input.val() == undefined || input.val() == null){
		input.val(0.00)
	}
})
function CalcValorPago(){
	var valor = $("#valor").val()
	var desconto = $("#descontoRecPag").val()
	var valorPago = (valor - desconto).toFixed(2);
	$("#valorPago").val(valorPago)
}

$(document).on(validarFormRecebimento = function(opcao){
	var cliente = $('#cliente').val();
	var dataVencimento = $('#dataVencimento').val();
	var dataCompetencia = $('#dataCompetencia').val();
	var pago = $('#pago').val();
	var valor = $('#valor').val();
	var erros = [];
	console.log(pago)

	if(!cliente || typeof cliente == undefined || cliente == null){erros.push(" Pagador")}
	if(!dataVencimento || typeof dataVencimento == undefined || dataVencimento == null){erros.push(" Data de Vencimento")}
	if(!dataCompetencia || typeof dataCompetencia == undefined || dataCompetencia == null){erros.push(" Data de Competencia")}
	if(!valor || typeof valor == undefined || valor == null || valor == 0){erros.push(" Valor")}

	if(pago === "true"){
		var dataPagamento = $("#dataPagamento").val()
		if(!dataPagamento || typeof dataPagamento == undefined || dataPagamento == null){
			erros.push(" Data de Pagamento")
		}
	}

	if(erros.length > 0 && erros.length == 1){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "O campo " + erros + " não foi preenchido!",
		})
		return false;
	}else if(erros.length > 1){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "Os campos " + erros + " não foram preenchidos!",
		})
		return false;
	}

	var id = $('#listaCliente [value="' + cliente + '"]').data('value')
	$('#cliente').val(id);

	if(opcao === 'adicionar'){
		document.formRecebimento.action = '/contas-receber/store';
		document.formRecebimento.submit();
	}else if(opcao === 'editar'){
		document.formRecebimento.action = '/contas-receber/update';
		document.formRecebimento.submit();
	}
})

$('#modalRecebimento').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var pago = button.data('pago')

	if(pago == true){
		$('#pagoTrue').css("visibility","visible");
		pago = "true"
	}else if(button.data('pago') == false){
		$('#pagoTrue').css("visibility","hidden");
		pago = "false"
	}

	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#cliente').val(button.data('cliente'))
	modal.find('#formaPagamento').val(button.data('forma-pagamento'))
	modal.find('#valor').val(button.data('valor'))
	modal.find('#valorPago').val(button.data('valor-pago'))
	modal.find('#descontoRecPag').val(button.data('desconto'))
	modal.find('#dataCompetencia').val(button.data('data-competencia'))
	modal.find('#dataVencimento').val(button.data('data-vencimento'))
	modal.find('#dataPagamento').val(button.data('data-pagamento'))
	modal.find('#pago').val(pago)
})

$(document).on(validarFormPagamento = function(opcao){
	var fornecedor = $('#fornecedor').val();
	var dataVencimento = $('#dataVencimento').val();
	var dataCompetencia = $('#dataCompetencia').val();
	var pago = $('#pago').val();
	var valor = $('#valor').val();
	var erros = [];

	if(!fornecedor || typeof fornecedor == undefined || fornecedor == null){erros.push(" Pagador")}
	if(!dataVencimento || typeof dataVencimento == undefined || dataVencimento == null){erros.push(" Data de Vencimento")}
	if(!dataCompetencia || typeof dataCompetencia == undefined || dataCompetencia == null){erros.push(" Data de Competencia")}
	if(!valor || typeof valor == undefined || valor == null || valor == 0){erros.push(" Valor")}

	if(pago === "true"){
		var dataPagamento = $("#dataPagamento").val()
		if(!dataPagamento || typeof dataPagamento == undefined || dataPagamento == null){
			erros.push(" Data de Pagamento")
		}
	}

	if(erros.length > 0 && erros.length == 1){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "O campo " + erros + " não foi preenchido!",
		})
		return false;
	}else if(erros.length > 1){
		Swal.fire({
			icon: 'error',
			title: 'Erro ...',
			text: "Os campos " + erros + " não foram preenchidos!",
		})
		return false;
	}

	var id = $('#listaFornecedor [value="' + fornecedor + '"]').data('value')
	$('#fornecedor').val(id);

	if(opcao === 'adicionar'){
		document.formPagamento.action = '/contas-pagar/store';
		document.formPagamento.submit();
	}else if(opcao === 'editar'){
		document.formPagamento.action = '/contas-pagar/update';
		document.formPagamento.submit();
	}
})

$('#modalPagamento').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var pago = button.data('pago')

	if(pago == true){
		$('#pagoTrue').css("visibility","visible");
		pago = "true"
	}else if(button.data('pago') == false){
		$('#pagoTrue').css("visibility","hidden");
		pago = "false"
	}

	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#fornecedor').val(button.data('fornecedor'))
	modal.find('#formaPagamento').val(button.data('forma-pagamento'))
	modal.find('#valor').val(button.data('valor'))
	modal.find('#valorPago').val(button.data('valor-pago'))
	modal.find('#descontoRecPag').val(button.data('desconto'))
	modal.find('#dataCompetencia').val(button.data('data-competencia'))
	modal.find('#dataVencimento').val(button.data('data-vencimento'))
	modal.find('#dataPagamento').val(button.data('data-pagamento'))
	modal.find('#pago').val(pago)
})

/* -------------------------  Dados Empresariais -------------------------*/

$(function(){
	$("#logo").css("visibility","hidden");
	$("#logo").change(function(){
		const file = $(this)[0].files[0]
		const fileReader = new FileReader()
		fileReader.onloadend = function(){
			$("#imgLogo").attr('src', fileReader.result)
		}
		fileReader.readAsDataURL(file)
	})
})
