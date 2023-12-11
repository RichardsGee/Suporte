// Função para copiar o conteúdo da resposta (excluindo o título)
function copiarResposta(respostaElement, copiarButton) {
    // Clona o elemento de resposta para manter o estilo
    var respostaClone = respostaElement.cloneNode(true);

    // Remove o título da resposta do clone
    var tituloResposta = respostaClone.querySelector('.TituloResposta');
    if (tituloResposta) {
        tituloResposta.remove();
    }

    // Aplica estilos ao clone
    respostaClone.style.display = 'block';
    respostaClone.style.position = 'static';

    // Cria um novo elemento temporário para copiar o texto formatado
    var tempTextArea = document.createElement('textarea');
    tempTextArea.value = respostaClone.textContent;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand('copy');

    document.body.removeChild(tempTextArea);

    // Altera o texto do botão para "Copiado ✔️"
    copiarButton.innerHTML = '<i class="far fa-check-circle"></i>'; // Ícone de verificação

    // Adicione uma classe CSS para aplicar o efeito no ícone de copiar
    copiarButton.classList.add('copiado');

    // Configure um temporizador para remover a classe e reverter o texto após um período de tempo
    setTimeout(function() {
        copiarButton.innerHTML = '<i class="far fa-copy"></i>'; // Ícone de copiar
        copiarButton.classList.remove('copiado');
        copiarButton.style.color = '#333'; // Reverte a cor para a cor padrão
    }, 1000); // Isso removerá a classe 'copiado' e reverterá o texto após 1 segundo (você pode ajustar o tempo conforme necessário)

    // Mude a cor do ícone temporariamente
    copiarButton.style.color = '#FFCA00'; // Cor verde (você pode ajustar a cor conforme desejado)
}

// Função para carregar as perguntas e respostas do arquivo JSON
function loadQuestionsAndAnswers() {
    fetch('faq-data.json')
        .then(response => response.json())
        .then(data => {
            displayQuestionsAndAnswers(data);
        })
        .catch(error => console.error('Erro ao carregar os dados: ', error));
}

// Função para exibir as perguntas e respostas no documento com títulos de módulo
function displayQuestionsAndAnswers(data) {
    var faqContainer = document.createElement('div');
    faqContainer.id = 'faq-container';

    for (var moduleTitle in data) {
        if (data.hasOwnProperty(moduleTitle)) {
            var moduleData = data[moduleTitle];

            var moduleTitleElement = document.createElement('h2');
            moduleTitleElement.textContent = moduleTitle;
            faqContainer.appendChild(moduleTitleElement);

            for (var i = 0; i < moduleData.length; i++) {
                var pergunta = moduleData[i].pergunta;
                var resposta = moduleData[i].resposta;

                var perguntaElement = document.createElement('h3');
                perguntaElement.classList.add('pergunta');
                perguntaElement.textContent = pergunta;

                var respostaElement = document.createElement('div');
                respostaElement.classList.add('resposta');

                // Use a tag <div> para envolver o texto e aplicar um estilo específico
                var textoContainer = document.createElement('div');
                textoContainer.classList.add('texto-container');

                // Converta o texto da resposta em texto simples
                var textoSimples = document.createElement('p');
                textoSimples.innerHTML = resposta;

                textoContainer.appendChild(textoSimples);
                respostaElement.appendChild(textoContainer);

                // Cria e define o título da resposta com parênteses ao redor do conteúdo da pergunta clicada
                var tituloElement = document.createElement('h4');
                tituloElement.classList.add('TituloResposta');
                tituloElement.textContent = '(' + pergunta + ')'; // Adiciona parênteses ao redor do texto da pergunta

                respostaElement.insertBefore(tituloElement, respostaElement.firstChild); // Adicione o título acima da resposta

                // Adiciona o botão "Fechar" na resposta
                var fecharElement = document.createElement('span');
                fecharElement.classList.add('fechar');
                fecharElement.innerHTML = '<i class="fas fa-times"></i>'; // Ícone de fechar
                fecharElement.onclick = function() {
                    closeAnswer(this.parentElement);
                };
                respostaElement.appendChild(fecharElement);

                // Adiciona o botão "Copiar" na resposta
                var copiarButton = document.createElement('button');
                copiarButton.classList.add('copiar');
                copiarButton.innerHTML = '<i class="far fa-copy"></i>'; // Ícone de copiar
                copiarButton.onclick = function() {
                    copiarResposta(this.parentElement, this);
                };
                respostaElement.appendChild(copiarButton);

                // Adiciona o texto "Copiado ✔️" após o botão "Copiar" (inicialmente oculto)
                var copiadoTexto = document.createElement('span');
                copiadoTexto.classList.add('copiado-texto');

                respostaElement.appendChild(copiadoTexto);

                faqContainer.appendChild(perguntaElement);
                faqContainer.appendChild(respostaElement);

                // Adicione uma quebra de página após cada resposta
                var quebraDePagina = document.createElement('div');
                quebraDePagina.classList.add('quebra-de-pagina');
                faqContainer.appendChild(quebraDePagina);
            }
        }
    }

    document.body.appendChild(faqContainer);

    // Evento de clique para mostrar/ocultar a resposta ao clicar na pergunta
    var perguntas = document.querySelectorAll('.pergunta');
    perguntas.forEach(function(pergunta) {
        pergunta.addEventListener('click', function() {
            toggleAnswer(this.nextElementSibling);
        });
    });
}

// Função para alternar a exibição da resposta
function toggleAnswer(element) {
    var respostas = document.querySelectorAll('.resposta');

    respostas.forEach(function(resposta) {
        resposta.style.display = 'none';
    });

    if (element.style.display === 'block') {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

// Função para fechar uma resposta específica
function closeAnswer(resposta) {
    resposta.style.display = 'none';
}

// Seletor para o campo de pesquisa
var campoPesquisa = document.getElementById('filtro-perguntas');

// Evento de digitação no campo de pesquisa
campoPesquisa.addEventListener('input', function() {
    var textoPesquisa = campoPesquisa.value.toLowerCase(); // Obtém o texto digitado em letras minúsculas
    filtrarPerguntas(textoPesquisa); // Chama a função de filtro de perguntas
});

// Função para filtrar perguntas com base no texto de pesquisa
function filtrarPerguntas(textoPesquisa) {
    var perguntas = document.querySelectorAll('.pergunta');
    perguntas.forEach(function(pergunta) {
        var perguntaTexto = pergunta.textContent.toLowerCase();
        var resposta = pergunta.nextElementSibling;
        if (perguntaTexto.includes(textoPesquisa)) {
            pergunta.style.display = 'block';
            resposta.style.display = 'none';
        } else {
            pergunta.style.display = 'none';
        }
    });
}

// Chamar a função para carregar as perguntas e respostas ao carregar a página
window.onload = loadQuestionsAndAnswers;
