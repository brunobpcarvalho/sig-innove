//Necessita do bootstrap e jquery
//forca da senha
$(function (){
    $('#senha').keyup(function (e){
        var senha = $(this).val();
        if(senha == ''){
            $('#senhaBarra').hide();
        }else{
            var fSenha = forcaSenha(senha);
            var texto = "";
            $('#senhaForca').css('width', fSenha+'%');
            $('#senhaForca').removeClass();
            $('#senhaForca').addClass('progress-bar');
            if(fSenha <= 40){
                texto = 'Fraca';
                $('#senhaForca').addClass('progress-bar-danger');
            }

            if(fSenha > 40 && fSenha <= 70){
                texto = 'Media';
            }

            if(fSenha > 70 && fSenha <= 90){
                texto = 'Boa';
                $('#senhaForca').addClass('progress-bar-success');
            }

            if(fSenha > 90){
                texto = 'Muito boa';
                $('#senhaForca').addClass('progress-bar-success');
            }

            $('#senhaForca').text(texto);

            $('#senhaBarra').show();
        }
    });
});

function forcaSenha(senha){
    var forca = 0;

    var regLetrasMa     = /[A-Z]/;
    var regLetrasMi     = /[a-z]/;
    var regNumero       = /[0-9]/;
    var regEspecial     = /[!@#$%&*?]/;

    var tam         = false;
    var tamM        = false;
    var letrasMa    = false;
    var letrasMi    = false;
    var numero      = false;
    var especial    = false;

    //    console.clear();
    //    console.log('senha: '+senha);

    if(senha.length >= 6) tam = true;
    if(senha.length >= 10) tamM = true;
    if(regLetrasMa.exec(senha)) letrasMa = true;
    if(regLetrasMi.exec(senha)) letrasMi = true;
    if(regNumero.exec(senha)) numero = true;
    if(regEspecial.exec(senha)) especial = true;

    if(tam) forca += 10;
    if(tamM) forca += 10;
    if(letrasMa) forca += 10;
    if(letrasMi) forca += 10;
    if(letrasMa && letrasMi) forca += 20;
    if(numero) forca += 20;
    if(especial) forca += 20;

    //    console.log('força: '+forca);

    return forca;
}
