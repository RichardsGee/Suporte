// URL do endpoint no servidor Node-RED
const serverEndpointUrl = 'http://194.163.134.51:1880/endpoint/buscar'; // Certifique-se de usar o endereço correto aqui

// Credenciais de autenticação
const username = 'richard'; // Substitua com seu nome de usuário
const password = 'SuaSenhaAqui'; // Substitua com sua senha

// Verifica se a página atual é 'resultado.html' antes de iniciar a solicitação HTTP
if (window.location.pathname.endsWith('/resultado.html')) {
    // Obtém o valor da consulta a partir da URL
    const urlParams = new URLSearchParams(window.location.search);
    const consulta = urlParams.get('consulta');

    // Cria um cabeçalho de autenticação para a solicitação HTTP
    const headers = new Headers({
        'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    // Configura as opções da solicitação HTTP
    const requestOptions = {
        method: 'GET', // ou 'POST' se for o caso
        headers: headers
    };

    // Realiza a solicitação HTTP com autenticação básica
    fetch(serverEndpointUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Resposta do servidor:', data);

            // Você pode tratar os dados recebidos aqui e realizar ações com base na resposta
        })
        .catch(error => {
            console.error('Erro na solicitação HTTP:', error);
        });
}
