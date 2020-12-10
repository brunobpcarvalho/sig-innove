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

$(document).on('show.bs.modal', '#modalProduto', function (event) {
	var button = $(event.relatedTarget)
	var modal = $(this)
	var acao = button.data('acao')
	var id = button.data('id')
	if(acao === 'adicionar'){
		$('#tabelaDeHistorico tbody tr').remove()
	} else {
		$.ajax({
			dataType: 'json',
			url: '/compras/historico/' + id,
			success: function(data){
				console.log('data', data);
				if(data.length < 1){
					console.log('entrou');
					$('#tabelaDeHistorico tbody tr').remove()
					return false
				}
				$('#tabelaDeHistorico tbody tr').remove()
				for(var i=0; data.length > i; i++){
					var dataFormatada = new Date(data[i].compra.dataCompra)
					dataFormatada = dataFormatada.toLocaleDateString('pt-BR');
					$('#tabelaDeHistorico tbody').append(
						'<tr>' +
						'<td>' + data[i].compra.id  + '</td>' +
						'<td>' + data[i].compra.pessoa.nome +'</td>' +
						'<td>' + dataFormatada + '</td>' +
						'<td> R$' + data[i].valorUnitario + '</td>' +
						'</tr>'
					)
				}
			}
		});
	}
	var campos = ['id', 'descricao', 'quantidade', 'nome_fabricante', 'descricao_modelo',
	'genero', 'valor_unitario', 'valor_custo', 'prazo_reposicao', 'ativo']
	passarDadosParaModal(modal, button, campos)
})

/* ----------------------------------- VENDA ------------------------------------------------------*/

function calcularTotal(){
	var subTotal = $('#tabelaItens').find("td:nth-child(4) input")
	var desconto = $('#desconto').val()
	var total = 0

	for (var i = 0; i < subTotal.length; i++) {
		total += parseFloat(subTotal[i].value)
	}

	if(desconto > total){
		$('#desconto').val('0.00');
		sweetAlert('warning', 'Atenção...', "O valor do desconto é maior que o Total da Venda!")
	} else {
		total -= desconto;
	}
	return total.toFixed(2);
}

function SubTotal(vlrUnit, quant){
	return (vlrUnit * quant).toFixed(2);
}

$(document).ready(function(){
	var tdItens = $(".tdItens").html();
	var tdQuant = $(".tdQuant").html();
	var tdValor = $(".tdValor").html();
	var tdTotal = $(".tdTotal").html();

	$(document).on('click', '#addItem', function(){
		var newRow = $('<tr class="linha">');
		var cols = "";
		cols += '<td class="tdItens">' + tdItens + '</td>';
		cols += '<td class="tdQuant">' + tdQuant + '</td>';
		cols += '<td class="tdValor">' + tdValor + '</td>';
		cols += '<td class="tdTotal">' + tdTotal + '</td>';
		cols += '<td>' + '<button type="button" onclick="RemoveTableRow(this)" name="button" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>' + '</td>';

		newRow.append(cols);

		$("#tabelaItens").append(newRow);
		$("#tabelaItens .item").last().val('');
		$("#tabelaItens .valorUnitario").last().val('');
		$("#tabelaItens .subTotal").last().val('');
		$("#tabelaItens .quantidade").last().val(1);

	});

	$(document).on('change', '.item', function () {
		var quantidade = $(this).closest('tr').find(".tdQuant input").val()
		var inputValorUnitario = $(this).closest('tr').find(".tdValor input")
		var subTotal = $(this).closest('tr').find(".tdTotal input")
		var produto = $(this).val()


		var valorUnitario = $('#listaProdutos [value="' + produto + '"]').data('valor')
		inputValorUnitario.val(valorUnitario)
		subTotal.val(SubTotal(valorUnitario, quantidade))

		$('#total').val(calcularTotal());
		$('.money').mask("###0.00", {reverse: true});
		return false;
	});

	$( "#desconto" ).change(function(){
		$('#total').val(calcularTotal());
	});

	$(document).on('change', '.valorUnitario', function(){
		var valorUnitario = $(this).val()
		var quantidade = $(this).closest('tr').find(".tdQuant input").val()
		var valorTotal = $(this).closest('tr').find(".tdTotal input")

		valorTotal.value = SubTotal(valorUnitario, quantidade)
		$('#total').val(calcularTotal());
	});

	$(document).on('change', '.quantidade', function(){
		var quantidade = $(this).val()
		var valorUnitario = $(this).closest('tr').find(".tdValor input").val()
		var subTotal = $(this).closest('tr').find(".tdTotal input")

		if(quantidade < 1){
			$(this).val(1)
			quantidade = 1
		}

		subTotal.val(SubTotal(valorUnitario, quantidade))
		$('#total').val(calcularTotal());
	});

	$(document).on(SalvarVenda = function (opcao) {
		var TabelaItens = $("#tabelaItens")
		var inputProduto =  TabelaItens.find("td:nth-child(1) input")
		var inputQuantidade = TabelaItens.find("td:nth-child(2) input")

		var quantidade = []
		var ids = []

		var produto = inputProduto[0].value;
		var cliente = $("#cliente").val()
		var erros = [];

		if(!cliente || typeof cliente == undefined || cliente == null){erros.push("Cliente")}
		if(!produto || typeof produto == undefined || produto == null){erros.push("Produto")}

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

		} else {
			document.formVenda.action = '/vendas/list-vendas/update';
			document.formVenda.submit();
		}
	});
});

$(document).on(SalvarCompra = function (opcao) {
	var TabelaItens = $("#tabelaItens")
	var inputProduto =  TabelaItens.find("td:nth-child(1) input")

	var quantidade = []
	var ids = []

	var produto = inputProduto[0].value;
	var fornecedor = $("#fornecedor").val()
	var erros = [];

	if(!fornecedor || typeof fornecedor == undefined || fornecedor == null){erros.push("Fornecedor")}
	if(!produto || typeof produto == undefined || produto == null){erros.push("Produto")}

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
	}

	if(produtoNaoExistente.length > 0){
		sweetAlert('warning', 'Atenção...', "Produto não cadastrado!" + produtoNaoExistente)
		return false;
	}

	for(var i = 0; i < inputProduto.length; i++) {
		inputProduto[i].value = ids[i];
	}

	if(opcao == 'adicionar'){
		var value = $('#fornecedor').val();
		var id = $('#listaFornecedor [value="' + value + '"]').data('value')

		if(id == undefined){
			sweetAlert('warning', 'Atenção...', "Fornecedor não cadastrado!")
			return false;
		}
		$('#fornecedor').val(id);

		document.formCompra.action = '/compras/create';
		document.formCompra.submit();

	} else {
		document.formCompra.action = '/compras/update';
		document.formCompra.submit();
	}
});

$(document).ready(function(){
	let obj = {
		id: '',
		pessoa: '',
		pessoaId: '',
		data_de_competencia: '',
		quantidade_de_parcelas: '',
		valor_total: ''
	}

	$(document).on(verificarCaixa = function(id, pessoa, pessoaId, data_de_competencia, quantidade_de_parcelas, valor_total){
		obj.id = id
		obj.pessoa = pessoa
		obj.pessoaId = pessoaId
		obj.data_de_competencia = data_de_competencia
		obj.quantidade_de_parcelas = quantidade_de_parcelas
		obj.valor_total = valor_total

		$.ajax({
			method: "GET",
			url: '/caixa/verifica-caixa-aberto',
			success: function(data){
				if(data === true){
					$('#modalGerarFinanceiro').modal('show')
				} else {
					sweetAlert('warning', 'Atenção...', "É necessário abrir o caixa para gerar o financeiro!")
				}
			}
		});
	});

	$('#modalGerarFinanceiro').on('show.bs.modal', function (event) {

		var quantidadeDeParcelas = obj.quantidade_de_parcelas
		var valorTotal = obj.valor_total
		var modal = $(this)
		adicionarParcelas(quantidadeDeParcelas, valorTotal)

		modal.find('#id').val(obj.id)
		modal.find('#pessoa').val(obj.pessoa)
		modal.find('#pessoaId').val(obj.pessoaId)
		modal.find('#data_de_competencia').val(obj.data_de_competencia)
		modal.find('#quantidade_de_parcelas').val(obj.quantidade_de_parcelas)
		modal.find('#valor_total').val(obj.valor_total)
	})

	$(document).on(gerarFinanceiro = function(tipo){
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
		if (tipo === 'venda') {
			document.formGerarFinanceiro.action = '/vendas/list-vendas/gerar-financeiro';
		} else {
			document.formGerarFinanceiro.action = '/compras/gerar-financeiro';
		}
		document.formGerarFinanceiro.submit();
	});
});

$(document).on(estornar = function(tipo, url){
	Swal.fire({
		title: 'Deseja realmente estornar esta ' + tipo + ' ?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Sim, estornar!'
	}).then((result) => {
		if (result.value) {
			location.href = url;
		}
	})
});

/* --------------  FORMULARIO DE RECEBIMENTO --------------------------------------*/

$(document).on(validarFormRecebimentoPagamento = function(opcao, tipo){
	var valorParcelas = $("#tabelaDeParcelas").find("td:nth-child(3) input")
	var dataDeVencimentos = $("#tabelaDeParcelas").find("td:nth-child(4) input")
	var valorPago = $("#tabelaDeParcelas").find("td:nth-child(5) input")
	var status = $("#tabelaDeParcelas").find("td:nth-child(8) select")


	var pessoa = $('#pessoa').val()
	var dataCompetencia = $('#dataCompetencia').val()
	var valorTotal = $('#valorTotal').val()
	var quantidadeDeParcelas = $('#quantidadeDeParcelas').val()
	var erros = []

	for (var i = 0; i < valorParcelas.length; i++) {
		if(!valorParcelas[i].value || typeof valorParcelas[i].value == undefined || valorParcelas[i].value == null){erros.push(" Valor da Parcela");}
		if(!dataDeVencimentos[i].value || typeof dataDeVencimentos[i].value == undefined || dataDeVencimentos[i].value == null){erros.push(" Data de Vencimento");}

		if(status[i].value == 'true'){
			if(!valorPago[i].value || typeof valorPago[i].value == undefined || valorPago[i].value == null || valorPago[i].value == 0.00){erros.push(" Valor Pago");}
		}
	}

	if(!pessoa || typeof pessoa == undefined || pessoa == null){erros.push(" Pagador/Recebedor")}
	if(!dataCompetencia || typeof dataCompetencia == undefined || dataCompetencia == null){erros.push(" Data de Competencia")}
	if(!valorTotal || typeof valorTotal == undefined || valorTotal == null || valorTotal == 0){erros.push(" Valor Total")}
	if(!quantidadeDeParcelas || typeof quantidadeDeParcelas == undefined || quantidadeDeParcelas == null || quantidadeDeParcelas == 0){erros.push(" Quantidade de Parcelas")}

	if(erros.length > 0){
		sweetAlert('warning', 'Atenção...', "Preencha o(s) campo(s) a seguir: " + erros)
		return false;
	}

	if(opcao === 'adicionar'){
		var id = $('#listaPessoa [value="' + pessoa + '"]').data('value')
		$('#pessoa').val(id)
		if(tipo === 'recebimento'){
			document.formRecebimento.action = '/contas-receber/create'
			document.formRecebimento.submit()
		} else {
			document.formPagamento.action = '/contas-pagar/create';
			document.formPagamento.submit();
		}
	} else {
		if(tipo === 'recebimento'){
			document.formRecebimento.action = '/contas-receber/update'
			document.formRecebimento.submit()
		} else {
			document.formPagamento.action = '/contas-pagar/update';
			document.formPagamento.submit();
		}
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

$(document).on(abrirModal = function(){
	$.ajax({
		method: "GET",
		url: '/caixa/verifica-caixa-aberto',
		success: function(data){
			if(data === true){
				sweetAlert('warning', 'Atenção...', "É necessário fechar o caixa anterior antes de abrir um novo caixa!")
			} else {
				$('#modalAbrirCaixa').modal('show');
			}
		}
	});
});

$('#modalAbrirCaixa').on('show.bs.modal', function (event) {
	var modal = $(this)

	modal.find('#dataAbertura').val(new Date().DataHoraAtual())
})

$(document).on(abrirCaixa = function(){
	var troco = $("#troco").val()

	if(!troco || typeof troco == undefined || troco == null){
		sweetAlert('warning', 'Atenção...', "Preencha o campo de Troco!")
		return false;
	}

	document.formAbrirCaixa.action = '/caixa/create';
	document.formAbrirCaixa.submit();
});

$('#modalFecharCaixa').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var modal = $(this)

	var id = $('#id').val()
	var entradas = button.data('totale')
	var troco = button.data('troco')
	var saidas = button.data('totals')
	var totalEntradas = (parseFloat(entradas) + parseFloat(troco)).toFixed(2)
	var saldo = button.data('saldo')

	$.ajax({
		method: "GET",
		url: '/caixa/movimentos-caixa/' + id,
		success: function(movCaixa){
			console.log('movCaixa', movCaixa);
			modal.find('#dinheiro').val(movCaixa.dinheiro)
			modal.find('#cartao').val(movCaixa.cartao)
			modal.find('#reforco').val(movCaixa.reforco)
			modal.find('#pagamentos').val(movCaixa.pagamentos)
			modal.find('#retiradas').val(movCaixa.retiradas)
		}
	});

	modal.find('#dataFechamento').val(new Date().DataHoraAtual())
	modal.find('#saldoFinaldoSistema').val(saldo)
	modal.find('#totalSaidas').val(saidas)
	modal.find('#totalEntradas').val(totalEntradas)
})

$(document).on(fecharCaixa = function(){
	var saldoFinaldoCaixa = $("#saldoFinaldoCaixa").val()
	var saldo = $('#saldoFinaldoSistema').val()
	var observacao = $('#observacao').val()
	console.log('observacao', observacao);

	if(saldoFinaldoCaixa < saldo){
		if(!observacao || typeof observacao == undefined || observacao == null || observacao == ''){
			sweetAlert('warning', 'Atenção...', "Preencha o campo de observações informando o motivo da diferença de valores!")
			return false;
		}
	}

	if(!saldoFinaldoCaixa || typeof saldoFinaldoCaixa == undefined || saldoFinaldoCaixa == null){
		sweetAlert('warning', 'Atenção...', "Preencha o campo de Saldo em Caixa!")
		return false;
	}
	Swal.fire({
		title: 'Deseja realmente fechar o caixa?',
		text: 'Esta ação não poderá ser desfeita!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Sim, fechar!'
	}).then((result) => {
		if (result.value) {
			document.formFecharCaixa.action = '/caixa/fechar-caixa';
			document.formFecharCaixa.submit();
		}
	})
});

$('#modalAdicionarDinheiro').on('show.bs.modal', function (event) {
	var modal = $(this)

	modal.find('#horaDaMovimentacao').val(new Date().DataHoraAtual())
})
$(document).on(adicionarDinheiro = function(){
	var valor = $("#formAdicionarDinheiro #valor").val()

	if(!valor || typeof valor == undefined || valor == null){
		sweetAlert('warning', 'Atenção...', "Preencha o campo de Valor!")
		return false;
	}
	document.formAdicionarDinheiro.action = '/caixa/adicionar-retirar-dinheiro';
	document.formAdicionarDinheiro.submit();
});

$('#modalRetirarDinheiro').on('show.bs.modal', function (event) {
	var modal = $(this)

	modal.find('#horaDaMovimentacao').val(new Date().DataHoraAtual())
})
$(document).on(retirarDinheiro = function(){
	var valor = $("#formRetirarDinheiro #valor").val()

	if(!valor || typeof valor == undefined || valor == null){
		sweetAlert('warning', 'Atenção...', "Preencha o campo de Valor!")
		return false;
	}
	document.formRetirarDinheiro.action = '/caixa/adicionar-retirar-dinheiro';
	document.formRetirarDinheiro.submit();
});



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
				sweetAlert('warning', 'Atenção', msg)
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
	$('#total').val(calcularTotal());
	return false;
};

$(document).on(verificaCaixaAberto = function(){
	$.ajax({
		method: "GET",
		url: '/caixa/verifica-caixa-aberto',
		success: function(data){
			if(data === true){
				$('#modalRecebimento').modal('show');
				$('#modalPagamentos').modal('show');
			} else {
				sweetAlert('warning', 'Atenção...', "É necessário abrir o caixa!")
			}
		}
	});
});
