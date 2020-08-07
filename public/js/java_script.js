$('.add').click( function() {
	$('.editar').css("visibility","hidden");
	$('.salvar').css("visibility","visible");
})
$('.edit').click( function() {
	$('.editar').css("visibility","visible");
	$('.salvar').css("visibility","hidden");
})

$('#cnpj').mask('00.000.000/0000-00');


$('.situacao').addClass('btn-danger');

$(document).on('change', '.situacao', function(){
	if(this.value == 'PAGO'){
		$(this).removeClass('btn-danger').addClass('btn-success');
	} else {
		$(this).removeClass('btn-success').addClass('btn-danger');
	}
})

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

function validarFormPessoa(valor){
	var formPessoa = $("#formPessoa");
	var nome = $('#nome').val();
	var cpf_cnpj = $('#cpf_cnpj').val();
	var dataNascimento = $('#dataNascimento').val();
	var tipo = $('#tipo').val();
	var erros = [];

	if(!nome || typeof nome == undefined || nome == null){erros.push(" Nome");}
	if(!cpf_cnpj || typeof cpf_cnpj == undefined || cpf_cnpj == null){erros.push(" CPF/CNPJ");}
	if(tipo === 'Fisica'){
		if(!dataNascimento || typeof dataNascimento == undefined || dataNascimento == null){erros.push(" Data de Nascimento");}
	}

	if(erros.length > 0 ){
		Swal.fire({
			icon: 'warning',
			title: 'Atenção!',
			text: "Preencha o(s) campo(s) a seguir:" + erros,
		})
		return false;
	}

	verificaSeExiste(
		"/pessoas/list-pessoas/validar",
		cpf_cnpj,
		"Já existe uma pessoa cadastrada com esse CPF/CNPJ!",
		formPessoa,
		'/pessoas/list-pessoas/editar',
		'/pessoas/list-pessoas/nova',
		valor
	);
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

/* --------------  FORMULARIO DE MODELO --------------------------------------*/
$(document).on(validarFormModelo = function (valor) {
	var formModelo = $("#formModelo");
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

	verificaSeExiste(
		"/produtos/list-modelos/validar",
		descricao,
		"Já existe um Modelo registrado com essa Descrição!",
		formModelo,
		'/produtos/list-modelos/editar',
		'/produtos/list-modelos/nova',
		valor
	);
})

$('#modalModelo').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#descricao').val(button.data('descricao'))
	modal.find('#ativo').val(button.data('ativo'))
})

/* --------------  FORMULARIO DE FABRICANTE -----------------------------------*/

function validarFormFabricante(valor){
	var formFabricante = $("#formFabricante");
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

	verificaSeExiste(
		"/produtos/list-fabricantes/validar",
		nome,
		"Já existe um Fabricante registrado com esse nome!",
		formFabricante,
		'/produtos/list-fabricante/editar',
		'/produtos/list-fabricante/nova',
		valor
	);
}

$('#modalFabricante').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#nome').val(button.data('nome'))
	modal.find('#ativo').val(button.data('ativo'))
})

/* --------------  FORMULARIO DE PRODUTO -----------------------------------*/
$('.money').mask("#,##0.00", {reverse: true});

function validarFormProduto(valor){
	var formProduto = $("#formProduto");
	var descricao = $("#descricao").val();
	var nomeFabricante = $("#nomeFabricante").val();
	var descricaoModelo = $("#descricaoModelo").val();
	var valorUnitario = $("#valorUnitario").val();
	var valorCusto = $("#valorCusto").val();
	var prazoReposicao = $("#prazoReposicao").val();
	var erros = [];

	if(!descricao || typeof descricao == undefined || descricao == null){erros.push(" Descrição");}
	if(!nomeFabricante || typeof nomeFabricante == undefined || nomeFabricante == null){erros.push(" Fabricante");}
	if(!descricaoModelo || typeof descricaoModelo == undefined || descricaoModelo == null){erros.push(" Modelo");}
	if(!valorUnitario || typeof valorUnitario == undefined || valorUnitario == null){erros.push(" Valor Unitario");}
	if(!valorCusto || typeof valorCusto == undefined || valorCusto == null){erros.push(" Valor de Custo");}
	if(!prazoReposicao || typeof prazoReposicao == undefined || prazoReposicao == null){erros.push(" Prazo de Reposição");}

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
	var valueModelo = $('#descricaoModelo').val();
	var idModelo = $('#listaModelos [value="' + valueModelo + '"]').data('value')

	var valueFabricante = $('#nomeFabricante').val();
	var idFabricante = $('#listaFabricantes [value="' + valueFabricante + '"]').data('value')


	//Tem que achar uma solução para o dataList, pois da erro ao encontrar registro que ja existe


	$('#fabricante').val(idFabricante);
	$('#modelo').val(idModelo);
	verificaSeExiste(
		"/produtos/list-produtos/validar",
		descricao,
		"Já existe um Produto registrado com essa descrição!",
		formProduto,
		'/produtos/list-produtos/editar',
		'/produtos/list-produtos/nova',
		valor
	);
}

$('#modalProduto').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)

	var modal = $(this)
	modal.find('#id').val(button.data('id'))
	modal.find('#descricao').val(button.data('descricao'))
	modal.find('#quantidade').val(button.data('quantidade'))
	modal.find('#nomeFabricante').val(button.data('nomefabricante'))
	modal.find('#descricaoModelo').val(button.data('descricaomodelo'))
	modal.find('#genero').val(button.data('genero'))
	modal.find('#valorUnitario').val(button.data('valor'))
	modal.find('#valorCusto').val(button.data('valorcusto'))
	modal.find('#prazoReposicao').val(button.data('prazo'))
	modal.find('#ativo').val(button.data('ativo'))
})

/* ----------------------------------- VENDA ------------------------------------------------------*/

/*$('#addParcelas').on('click', function(){
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
});*/

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
		var inputProduto =  TabelaItens.find("td:nth-child(1) input");
		var inputQuantidade = TabelaItens.find("td:nth-child(2) input");

		var quantidade = [];
		var ids = [];

		var produto = inputProduto[0].value;
		var cliente = formVenda.cliente.value;
		var erros = [];

		if(!cliente || typeof cliente == undefined || cliente == null){erros.push("Cliente");}
		if(!produto || typeof produto == undefined || produto == null){erros.push("Produto");}

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
		var produtoNaoExistente = [];
		for (var i = 0; i < inputProduto.length; i++) {
			var prod = inputProduto[i].value;
			var id = $('#listaProdutos [value="' + prod + '"]').data('id')

			if(id == undefined){
				produtoNaoExistente.push(" " + prod);
			}

			ids.push(id);

			var quantidadeEstoque = $('#listaProdutos [value="' + prod + '"]').data('quantidade')
			if(quantidadeEstoque < inputQuantidade[i].value){
				quantidade.push(" " + prod);
			}
		}

		if(produtoNaoExistente.length > 0){
			Swal.fire({
				icon: 'warning',
				title: 'Atenção',
				text: "Produto não cadastrado!" + produtoNaoExistente,
			})
			return false;
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

			if(id == undefined){
				Swal.fire({
					icon: 'warning',
					title: 'Atenção',
					text: "Cliente não cadastrado!",
				})
				return false;
			}
			$('#cliente').val(id);

			document.formVenda.action = '/vendas/add-venda/nova';
			document.formVenda.submit();

		} else if(opcao == "editar"){
			document.formVenda.action = '/vendas/list-vendas/update';
			document.formVenda.submit();
		}
	});
});

var tdParcela = $("#tdParcela").html();
var tdFormaPagamentp = $("#tdFormaPagamentp").html();
var tdValorParcela = $("#tdValorParcela").html();
var tdDataVencimento = $("#tdDataVencimento").html();
var tdValorPago = $("#tdValorPago").html();
var tdDataPagamento = $("#tdDataPagamento").html();
var tdDesconto = $("#tdDesconto").html();
var tdSituacao = $("#tdSituacao").html();

$('#modalGerarFinanceiro').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var parcelas = button.data('parcelas')
	var valorTotal = button.data('valortotal')
	var valorParcela = (valorTotal / parcelas).toFixed(2)
	$("#tabelaDeParcelas tbody tr").remove();

	for (var i = 0; i < parcelas; i++) {
		var newRow = $('<tr id="trParcelas">');
		var cols = "";
		cols += '<td id="tdParcela"> <input type="hidden" name="parcela[]"> <span>'+ (i+1) +'° </span></td>';
		cols += '<td>' + tdFormaPagamentp + '</td>';
		cols += '<td id="tdValorParcela"><input class="money form-control" type="text" name="valorParcela[]" value="'+ valorParcela +'" size="8"></td>';
		cols += '<td>' + tdDataVencimento + '</td>';
		cols += '<td>' + tdValorPago + '</td>';
		cols += '<td>' + tdDataPagamento + '</td>';
		cols += '<td>' + tdDesconto + '</td>';
		cols += '<td>' + tdSituacao + '</td>';

		newRow.append(cols);

		$("#tabelaDeParcelas").append(newRow);
	}

	var modal = $(this)
	modal.find('#vendaId').val(button.data('venda'))
	modal.find('#cliente').val(button.data('cliente'))
	modal.find('#dataCompetencia').val(button.data('datavenda'))
	modal.find('#parcelas').val(parcelas)
	modal.find('#valorTotal').val(valorTotal)
})



$(document).on(gerarFinanceiro = function(){

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

/*---------------------------------------------------------------------------*/

$( ".deletar" ).click(function(){
	Swal.fire({
		title: 'Deseja realmente deletar este registro?',
		text: 'Esta ação não poderá ser desfeita!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Sim, deletar!'
	}).then((result) => {
		if (result.value) {
			this.submit();
		}
	})
});

$(document).on(verificaSeExiste = function(url, campo, msg, formulario, actionEditar, actionAdd, valor){
	$.ajax({
		method: "POST",
		url: url,
		data: {campo: campo}
	})
	.done( function (res) {
		if(valor == 'adicionar'){
			if(res === true){
				Swal.fire({
					icon: 'error',
					title: 'Erro ...',
					text: msg,
				})
			}else{
				formulario.attr('action','' + actionAdd);
				formulario.submit();
			}
		} else if(valor == "editar"){
			formulario.attr('action','' + actionEditar);
			formulario.submit();
		}
	});
})
