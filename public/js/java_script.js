$('.add').click( function() {
	$('.editar').css("visibility","hidden");
	$('.salvar').css("visibility","visible");
})
$('.edit').click( function() {
	$('.editar').css("visibility","visible");
	$('.salvar').css("visibility","hidden");
})
$('.money').mask("###0.00", {reverse: true});
$('#cnpj').mask('00.000.000/0000-00');
$('#telefone').mask('(00) 0000-0000');
$('#celular').mask('(00) 00000-0000');
$('#cpf_cnpj').mask('000.000.000-00');

/* --------------  FORMULARIO DE PESSOAS --------------------------------------*/

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

$(document).on('blur', '#data_nascimento', function () {
	hoje = new Date;
	nascimento = new Date($("#data_nascimento").val());
	var diferencaAnos = hoje.getFullYear() - nascimento.getFullYear();
	if (new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) <
	new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()))
	diferencaAnos--;

	if(diferencaAnos < 16) {
		sweetAlert('warning', 'Atenção...', "A idade minima para cadastro é de 16 anos!")
		$("#data_nascimento").val('')
	}
});

function validarFormPessoa(valor){
	var formPessoa = $("#formPessoa");
	var nome = $('#nome').val();
	var cpf_cnpj = $('#cpf_cnpj').val();
	var data_nascimento = $('#data_nascimento').val();
	var tipo = $('#tipo').val();
	var erros = [];

	if(!nome || typeof nome == undefined || nome == null){erros.push(" Nome");}
	if(!cpf_cnpj || typeof cpf_cnpj == undefined || cpf_cnpj == null){erros.push(" CPF/CNPJ");}
	if(tipo === 'Fisica'){
		if(!data_nascimento || typeof data_nascimento == undefined || data_nascimento == null){erros.push(" Data de Nascimento");}
	}

	if(erros.length > 0 ){
		sweetAlert('warning', 'Atenção...', "Preencha o(s) campo(s) a seguir:" + erros)
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
	var modal = $(this)
	var campos = ['id', 'nome', 'tipo', 'funcao', 'cpf_cnpj', 'ie', 'razao_social', 'nome_mae',
	'data_nascimento', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'uf', 'complemento',
	'telefone', 'celular', 'email', 'ativo']

	if(button.data('tipo') === "Fisica"){
		Fisica();
	}else if(button.data('tipo') === "Juridica"){
		Juridica();
	}

	passarDadosParaModal(modal, button, campos)
})

/* --------------  FORMULARIO DE USUARIOS --------------------------------------*/

function validarFormUsuario(){
	var usuario = $('#usuario').val();

	if(!usuario || typeof usuario == undefined || usuario == null){
		sweetAlert('warning', 'Atenção...', "O campo usuario não foi preenchido!")
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
		sweetAlert('warning', 'Atenção...', "Já existe um funcionario cadastrado(a) com este Usuario")
		return false;
	}
	document.formUsuario.action = '/usuarios/create';
	document.formUsuario.submit();
}

/* --------------  FORMULARIO DE MODELO --------------------------------------*/
$(document).on(validarFormModelo = function (valor) {
	var formModelo = $("#formModelo");
	var descricao = $("#descricao").val();

	if(!descricao || typeof descricao == undefined || descricao == null){
		sweetAlert('warning', 'Atenção...', "Preencha o(s) campo(s) a seguir: " + erros)
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
	var campos = ['id', 'descricao', 'ativo']
	passarDadosParaModal(modal, button, campos)
})

/* --------------  FORMULARIO DE FABRICANTE -----------------------------------*/

function validarFormFabricante(valor){
	var formFabricante = $("#formFabricante");
	var nome = $('#nome').val();

	if(!nome || typeof nome == undefined || nome == null){
		sweetAlert('warning', 'Atenção...', "Preencha a descrição do Modelo")
		return false;
	}

	verificaSeExiste(
		"/produtos/list-fabricantes/validar",
		nome,
		"Já existe um Fabricante registrado com esse nome!",
		formFabricante,
		'/produtos/list-fabricantes/editar',
		'/produtos/list-fabricantes/nova',
		valor
	);
}

$('#modalFabricante').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var modal = $(this)
	var campos = ['id', 'nome', 'ativo']
	passarDadosParaModal(modal, button, campos)
})

/* --------------  FORMULARIO DE PRODUTO -----------------------------------*/

function validarFormProduto(valor){
	var formProduto = $("#formProduto");
	var descricao = $("#descricao").val();
	var nomeFabricante = $("#nome_fabricante").val();
	var descricaoModelo = $("#descricao_modelo").val();
	var valorUnitario = $("#valor_unitario").val();
	var valorCusto = $("#valor_custo").val();
	var prazoReposicao = $("#prazo_reposicao").val();
	var erros = [];

	if(!descricao || typeof descricao == undefined || descricao == null){erros.push(" Descrição");}
	if(!nomeFabricante || typeof nomeFabricante == undefined || nomeFabricante == null){erros.push(" Fabricante");}
	if(!descricaoModelo || typeof descricaoModelo == undefined || descricaoModelo == null){erros.push(" Modelo");}
	if(!valorUnitario || typeof valorUnitario == undefined || valorUnitario == null){erros.push(" Valor Unitario");}
	if(!valorCusto || typeof valorCusto == undefined || valorCusto == null){erros.push(" Valor de Custo");}
	if(!prazoReposicao || typeof prazoReposicao == undefined || prazoReposicao == null){erros.push(" Prazo de Reposição");}

	if(erros.length > 0){
		sweetAlert('warning', 'Atenção...', "Preencha o(s) campo(s) a seguir: " + erros)
		return false;
	}

	var idModelo = $('#listaModelos [value="' + descricaoModelo + '"]').data('value')
	var idFabricante = $('#listaFabricantes [value="' + nomeFabricante + '"]').data('value')

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
	var campos = ['id', 'descricao', 'quantidade', 'nome_fabricante', 'descricao_modelo',
	'genero', 'valor_unitario', 'valor_custo', 'prazo_reposicao', 'ativo']
	passarDadosParaModal(modal, button, campos)
})

/* ----------------------------------- VENDA ------------------------------------------------------*/

$(document).ready(function(){
	//Remove o botão de excluir do primeiro item ao editar uma venda.
	$('.tdAcao button').first().css("visibility", "hidden");

	//Verifica se o Status é  igual a VENDA, e desabilita os inputs e botões.
	if($("#status").val() == 'VENDA'){
		var formVenda = $("#formVenda");
		formVenda.find("input").attr("disabled", true)
		formVenda.find("select").attr("disabled", true)
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
			sweetAlert('warning', 'Atenção...', "O valor do desconto é maior que o Total da Venda!")
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

	$(document).on(SalvarVenda = function (opcao) {
		var TabelaItens = $("#tabelaItens");
		var inputProduto =  TabelaItens.find("td:nth-child(1) input");
		var inputQuantidade = TabelaItens.find("td:nth-child(2) input");

		var quantidade = [];
		var ids = [];

		var produto = inputProduto[0].value;
		var cliente = $("#cliente").val();
		var erros = [];

		if(!cliente || typeof cliente == undefined || cliente == null){erros.push("Cliente");}
		if(!produto || typeof produto == undefined || produto == null){erros.push("Produto");}

		if(erros.length > 0){
			sweetAlert('warning', 'Atenção...', "Preencha o(s) campo(s) a seguir: " + erros)
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
			sweetAlert('warning', 'Atenção...', "Produto não cadastrado!" + produtoNaoExistente)
			return false;
		}

		if(quantidade.length > 0){
			sweetAlert('warning', 'Atenção...', "Produtos com estoque insuficiente:" + quantidade)
			return false;
		}

		for(var i = 0; i < inputProduto.length; i++) {
			inputProduto[i].value = ids[i];
		}

		if(opcao == 'adicionar'){
			var value = $('#cliente').val();
			var id = $('#listaCliente [value="' + value + '"]').data('value')

			if(id == undefined){
				sweetAlert('warning', 'Atenção...', "Cliente não cadastrado!")
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

$('#modalGerarFinanceiro').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var quantidadeDeParcelas = button.data('quantidade_de_parcelas')
	var valorTotal = button.data('valor_total')
	var modal = $(this)
	var campos = ['venda', 'cliente', 'data_de_competencia', 'quantidade_de_parcelas', 'valor_total']

	adicionarParcelas(quantidadeDeParcelas, valorTotal)
	passarDadosParaModal(modal, button, campos)
})

$(document).on(gerarFinanceiro = function(){
	var tabelaDeParcelas = $("#tabelaDeParcelas")
	var dataDeVencimento = tabelaDeParcelas.find("td:nth-child(4) input")
	var erros = []
	for (var i = 0; i < dataDeVencimento.length; i++) {
		if(!dataDeVencimento[i].value || typeof dataDeVencimento[i].value == undefined || dataDeVencimento[i].value == null){erros.push(i);}
	}
	if(erros.length > 0){
		sweetAlert('warning', 'Atenção...', "Preencha todos os campos de Data de Vencimento!")
		return false;
	}

	document.formGerarFinanceiro.action = '/vendas/list-vendas/gerar-financeiro';
	document.formGerarFinanceiro.submit();
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

$(document).on(validarFormRecebimento = function(opcao){
	var valorParcelas = $("#tabelaDeParcelas").find("td:nth-child(3) input")
	var dataDeVencimentos = $("#tabelaDeParcelas").find("td:nth-child(4) input")

	var cliente = $('#cliente').val()
	var dataCompetencia = $('#dataCompetencia').val()
	var valorTotal = $('#valorTotal').val()
	var quantidadeDeParcelas = $('#quantidadeDeParcelas').val()
	var erros = []

	for (var i = 0; i < valorParcelas.length; i++) {
		if(!valorParcelas[i].value || typeof valorParcelas[i].value == undefined || valorParcelas[i].value == null){erros.push(" Valor da Parcela");}
		if(!dataDeVencimentos[i].value || typeof dataDeVencimentos[i].value == undefined || dataDeVencimentos[i].value == null){erros.push(" Data de Vencimento");}
	}

	if(!cliente || typeof cliente == undefined || cliente == null){erros.push(" Pagador")}
	if(!dataCompetencia || typeof dataCompetencia == undefined || dataCompetencia == null){erros.push(" Data de Competencia")}
	if(!valorTotal || typeof valorTotal == undefined || valorTotal == null || valorTotal == 0){erros.push(" Valor Total")}
	if(!quantidadeDeParcelas || typeof quantidadeDeParcelas == undefined || quantidadeDeParcelas == null || quantidadeDeParcelas == 0){erros.push(" Quantidade de Parcelas")}

	if(erros.length > 0){
		sweetAlert('warning', 'Atenção...', "Preencha o(s) campo(s) a seguir: " + erros)
		return false;
	}

	if(opcao === 'adicionar'){
		var id = $('#listaCliente [value="' + cliente + '"]').data('value')
		$('#cliente').val(id)

		document.formRecebimento.action = '/contas-receber/store'
		document.formRecebimento.submit()
	}else if(opcao === 'editar'){
		document.formRecebimento.action = '/contas-receber/update'
		document.formRecebimento.submit()
	}
})


function adicionarParcelas(qtdeParcelas, valorTotal) {
	var tdFormaPagamento = $("#tdFormaPagamento").html()
	var tdDataVencimento = $("#tdDataVencimento").html()
	var tdValorPago = $("#tdValorPago").html()
	var tdDataPagamento = $("#tdDataPagamento").html()
	var tdDesconto = $("#tdDesconto").html()
	var tdStatus = $("#tdStatus").html()

	var valorParcela = (valorTotal / qtdeParcelas).toFixed(2)
	$("#tabelaDeParcelas tbody tr").remove()

	for (var i = 0; i < qtdeParcelas; i++) {
		var newRow = $('<tr id="trParcelas">')
		var cols = ""
		cols += '<td id="tdParcela"> <input type="hidden" name="parcela[]" value="'+ (i+1) +'"> <span>'+ (i+1) +'° </span></td>'
		cols += '<td id="tdFormaPagamento">' + tdFormaPagamento + '</td>'
		cols += '<td id="tdValorParcela"><input class="money form-control" type="text" name="valorDaParcela[]" value="'+ valorParcela +'" size="8"></td>'
		cols += '<td id="tdDataVencimento">' + tdDataVencimento + '</td>'
		cols += '<td id="tdValorPago">' + tdValorPago + '</td>'
		cols += '<td id="tdDataPagamento">' + tdDataPagamento + '</td>'
		cols += '<td id="tdDesconto">' + tdDesconto + '</td>'
		cols += '<td id="tdStatus">' + tdStatus + '</td>'

		newRow.append(cols);

		$("#tabelaDeParcelas").append(newRow)
		$('#tabelaDeParcelas .inputData').val(new Date().DataAtual())
		$('#tabelaDeParcelas .money').mask("###0.00", {reverse: true});
	}
}

$('.status').on('change', function(){
	var dataDePagamento = $(this).closest('tr').find("#tdDataPagamento input")

	if($(this).val() == 'false'){
		dataDePagamento.val('')
	} else {
		if(!dataDePagamento.val() || typeof dataDePagamento.val() == undefined || dataDePagamento.val() == null){
			sweetAlert('warning', 'Atenção...', "Preencha o campo de Data De Pagamento!")
			$(this).val('false')
		}
	}
})

$('#quantidadeDeParcelas').on('change', function(){
	var parcelas = $(this).val()
	var valorTotal = $('#valorTotal').val()

	if(!valorTotal || typeof valorTotal == undefined || valorTotal == null || valorTotal == 0){
		sweetAlert('warning', 'Atenção...', "Preencha o campo de Valor Total!")
		return false;
	}

	adicionarParcelas(parcelas, valorTotal)
})

/*----------------------------------------------------------------------------*/

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

	if(erros.length > 0){
		sweetAlert('warning', 'Atenção...', "Preencha o(s) campo(s) a seguir: " + erros)
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
function passarDadosParaModal(modal, button, campos){
	for (var i = 0; i < campos.length; i++) {
		modal.find('#' + campos[i]).val(button.data('' + campos[i]))
	}
}

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

function sweetAlert(icon, title, text){
	Swal.fire({
		icon: icon,
		title: title,
		text: text,
	})
}

function RemoveTableRow(handler) {
	var tr = $(handler).closest('tr');
	tr.remove();
	$('#total').val(Total());
	return false;
};
