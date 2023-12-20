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
    setTimeout(function () {
        copiarButton.innerHTML = '<i class="far fa-copy"></i>'; // Ícone de copiar
        copiarButton.classList.remove('copiado');
        copiarButton.style.color = '#ffffff'; // Reverte a cor para a cor padrão
    }, 1000); // Isso removerá a classe 'copiado' e reverterá o texto após 1 segundo (você pode ajustar o tempo conforme necessário)
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
                respostaElement.classList.add('animate-background'); // Adicione a classe animate-background

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
                fecharElement.onclick = function () {
                    closeAnswer(this.parentElement);
                    // Encontre a pergunta correspondente e remova a classe "clicada"
                    var perguntaClicada = this.parentElement.previousElementSibling;
                    perguntaClicada.classList.remove('clicada');
                    perguntaClicada.style.backgroundColor = ''; // Remove o fundo da pergunta fechada
                    perguntaClicada.style.color = '#ffffff'; // Reverte a cor da fonte da pergunta fechada
                };
                respostaElement.appendChild(fecharElement);

                // Adiciona o botão "Copiar" na resposta
                var copiarButton = document.createElement('button');
                copiarButton.classList.add('copiar');
                copiarButton.innerHTML = '<i class="far fa-copy"></i>'; // Ícone de copiar
                copiarButton.onclick = function () {
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
    perguntas.forEach(function (pergunta) {
        pergunta.addEventListener('click', function () {
            toggleAnswer(this.nextElementSibling);

            // Fecha todas as outras respostas e remove a classe "clicada" das outras perguntas
            perguntas.forEach(function (outraPergunta) {
                if (outraPergunta !== this) {
                    outraPergunta.classList.remove('clicada');
                    outraPergunta.style.backgroundColor = ''; // Remove o fundo das outras perguntas
                    outraPergunta.style.color = '#ffffff'; // Reverte a cor da fonte das outras perguntas
                }
            });

            this.classList.toggle('clicada'); // Adiciona ou remove a classe "clicada" na pergunta clicada
            this.style.backgroundColor = this.classList.contains('clicada') ? '#FFCA00' : ''; // Define o background da pergunta clicada
            this.style.color = this.classList.contains('clicada') ? '#000000' : '#ffffff'; // Muda a cor da fonte da pergunta clicada
        });
    });
}

// Função para alternar a exibição da resposta
function toggleAnswer(element) {
    var respostas = document.querySelectorAll('.resposta');

    respostas.forEach(function (resposta) {
        resposta.style.display = 'none';
        resposta.style.opacity = '1'; // Reverte a opacidade para 1 ao alternar a resposta
    });

    if (element.style.display === 'block') {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

// Função para fechar uma resposta com efeito de transparência
function closeAnswer(resposta) {
    var opacity = 1;
    var interval = setInterval(function () {

        resposta.style.opacity = opacity;
        opacity -= 0.1; // Reduz a opacidade em 0.1 a cada intervalo
        if (opacity <= 0) {
            clearInterval(interval); // Para o intervalo quando a opacidade chegar a 0
            resposta.style.display = 'none'; // Define a resposta como oculta
            var perguntas = document.querySelectorAll('.pergunta');
            perguntas.forEach(function (pergunta) {
                pergunta.style.backgroundColor = ''; // Remove o fundo da pergunta fechada
                pergunta.style.color = '#ffffff'; // Reverte a cor da fonte da pergunta fechada
            });
        }
    }, 50); // Intervalo de 50ms para a transição de opacidade (você pode ajustar conforme necessário)
}

// Seletor para o campo de pesquisa
var campoPesquisa = document.getElementById('filtro-perguntas');

// Evento de digitação no campo de pesquisa
campoPesquisa.addEventListener('input', function () {
    var textoPesquisa = campoPesquisa.value.toLowerCase(); // Obtém o texto digitado em letras minúsculas
    filtrarPerguntas(textoPesquisa); // Chama a função de filtro de perguntas
});

// Função para filtrar perguntas com base no texto de pesquisa
function filtrarPerguntas(textoPesquisa) {
    var perguntas = document.querySelectorAll('.pergunta');
    perguntas.forEach(function (pergunta) {
        var perguntaTexto = pergunta.textContent.toLowerCase();
        if (perguntaTexto.includes(textoPesquisa)) {
            pergunta.style.display = 'block'; // Mostra a pergunta se corresponder ao filtro
        } else {
            pergunta.style.display = 'none'; // Oculta a pergunta se não corresponder ao filtro
        }
    });
}

// Função para criar e adicionar o botão "Limpar" à caixa de pesquisa
function adicionarBotaoLimpar() {
    // Crie o botão "Limpar"
    var botaoLimpar = document.createElement('button');
    botaoLimpar.textContent = 'Limpar';
    
    // Adicione a classe CSS ao botão "Limpar"
    botaoLimpar.classList.add('botao-limpar');
    
    // Adicione um evento de clique ao botão para limpar o campo de pesquisa
    botaoLimpar.addEventListener('click', function () {
        campoPesquisa.value = ''; // Limpa o campo de pesquisa
        filtrarPerguntas(''); // Chama a função de filtro com uma string vazia para exibir todas as perguntas novamente
    });
    
    // Adicione o botão "Limpar" à caixa de pesquisa
    var campoPesquisa = document.getElementById('filtro-perguntas');
    campoPesquisa.parentNode.insertBefore(botaoLimpar, campoPesquisa.nextSibling);
}

// Chame a função para adicionar o botão "Limpar"
adicionarBotaoLimpar();


// Chamar a função para carregar as perguntas e respostas ao carregar a página
window.onload = loadQuestionsAndAnswers;
