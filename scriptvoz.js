// Seletor para o botão de ativação por voz
var botaoVoz = document.getElementById('botao-voz');

// Seletor para o campo de pesquisa
var campoPesquisa = document.getElementById('filtro-perguntas');

// Seletor para exibir o texto reconhecido
var textoReconhecidoElement = document.getElementById('texto-reconhecido');

// Verifica se o navegador suporta a API Web Speech
if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // Define para false para encerrar a gravação após uma única fala
    recognition.lang = 'pt-BR'; // Define o idioma para português do Brasil

    // Evento de início da gravação de voz
    recognition.onstart = function () {
        console.log('Iniciando gravação de voz...');
        campoPesquisa.placeholder = 'Fale agora...';
    };

    // Evento de encerramento da gravação de voz
    recognition.onend = function () {
        console.log('Encerrando gravação de voz...');
        campoPesquisa.placeholder = 'Pesquisar...';
    };

    // Evento de resultado da fala
    recognition.onresult = function (event) {
        var resultado = event.results[0][0].transcript.trim(); // Remove espaços em branco
        resultado = resultado.replace(/[.?]/g, ''); // Remove pontos e interrogações
        campoPesquisa.value = resultado;
        campoPesquisa.dispatchEvent(new Event('input')); // Dispara o evento de input manualmente
        textoReconhecidoElement.textContent = 'Texto reconhecido: ' + resultado;
    };

    // Evento de clique no botão de ativação por voz
    botaoVoz.addEventListener('click', function () {
        recognition.start(); // Inicia a gravação de voz ao clicar no botão
    });
} else {
    console.log('Navegador não suporta a API Web Speech.');
    botaoVoz.style.display = 'none'; // Oculta o botão de ativação por voz se a API não for suportada
}
