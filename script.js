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

// Função para exibir as perguntas e respostas no documento
function displayQuestionsAndAnswers(data) {
    var faqContainer = document.createElement('div');
    faqContainer.id = 'faq-container';

    var respostas = {}; // Armazenar as respostas em um objeto

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var pergunta = key;
            var resposta = data[key];

            var perguntaElement = document.createElement('h2');
            perguntaElement.classList.add('pergunta');
            perguntaElement.textContent = pergunta;

            // Adiciona um evento de clique para mostrar/ocultar a resposta
            perguntaElement.addEventListener('click', function() {
                toggleAnswer(this.nextElementSibling);
            });

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
            var tituloElement = document.createElement('h3');
            tituloElement.classList.add('TituloResposta');
            tituloElement.textContent = '(' + pergunta + ')'; // Adiciona parênteses ao redor do texto da pergunta

            respostaElement.insertBefore(tituloElement, respostaElement.firstChild); // Adicione o título acima da resposta

            // Adiciona o botão "Fechar" na resposta
            var fecharElement = document.createElement('span');
            fecharElement.classList.add('fechar');
            fecharElement.innerHTML = '<i class="fas fa-times"></i>'; // Ícone de fechar
            fecharElement.onclick = function() {
                closeAllAnswers(respostas);
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

            respostas[pergunta] = respostaElement; // Armazena a resposta no objeto com a pergunta como chave

            faqContainer.appendChild(perguntaElement);
            faqContainer.appendChild(respostaElement);

            // Adicione uma quebra de página após cada resposta
            var quebraDePagina = document.createElement('div');
            quebraDePagina.classList.add('quebra-de-pagina');
            faqContainer.appendChild(quebraDePagina);
        }
    }

    document.body.appendChild(faqContainer);
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

// Função para fechar todas as respostas
function closeAllAnswers(respostas) {
    for (var key in respostas) {
        respostas[key].style.display = 'none';
    }
}

// Função para filtrar perguntas com base na pesquisa
function filtrarPerguntas(textoPesquisa) {
    var perguntas = document.querySelectorAll('.pergunta'); // Seleciona todas as perguntas

    perguntas.forEach(function(pergunta) {
        var perguntaTexto = pergunta.textContent.toLowerCase(); // Obtém o texto da pergunta em letras minúsculas

        // Verifica se o texto da pergunta contém o texto da pesquisa
        if (perguntaTexto.includes(textoPesquisa.toLowerCase())) {
            pergunta.style.display = 'block'; // Mostra a pergunta se corresponder à pesquisa
        } else {
            pergunta.style.display = 'none'; // Oculta a pergunta se não corresponder à pesquisa
        }
    });
}

// Seletor para o campo de pesquisa
var campoPesquisa = document.getElementById('filtro-perguntas');

// Evento de digitação no campo de pesquisa
campoPesquisa.addEventListener('input', function() {
    var textoPesquisa = campoPesquisa.value.toLowerCase(); // Obtém o texto digitado em letras minúsculas
    filtrarPerguntas(textoPesquisa); // Chama a função de filtro de perguntas
});

// Chamar a função para carregar as perguntas e respostas ao carregar a página
window.onload = loadQuestionsAndAnswers;