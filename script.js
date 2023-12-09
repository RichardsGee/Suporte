// script.js

// Função para carregar as perguntas e respostas do arquivo JSON
function loadQuestionsAndAnswers() {
    // Fazer uma requisição para o arquivo de dados (faq-data.json)
    fetch('faq-data.json')
        .then(response => response.json())
        .then(data => {
            // Chamar a função para exibir as perguntas e respostas
            displayQuestionsAndAnswers(data);
        })
        .catch(error => console.error('Erro ao carregar os dados: ', error));
}

// Função para exibir as perguntas e respostas no documento
function displayQuestionsAndAnswers(data) {
    // Local onde as respostas serão exibidas
    var respostaDiv = document.getElementById('resposta');

    // Limpar o conteúdo anterior, se houver
    respostaDiv.innerHTML = '';

    // Iterar pelo JSON e exibir as perguntas e respostas
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var pergunta = key;
            var resposta = data[key];

            // Criar elementos HTML para a pergunta e a resposta
            var perguntaElement = document.createElement('h2');
            perguntaElement.textContent = pergunta;

            var respostaElement = document.createElement('p');
            respostaElement.textContent = resposta;

            // Adicionar a pergunta e a resposta à div de resposta
            respostaDiv.appendChild(perguntaElement);
            respostaDiv.appendChild(respostaElement);
        }
    }
}

// Chamar a função para carregar as perguntas e respostas ao carregar a página
window.onload = loadQuestionsAndAnswers;
