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
