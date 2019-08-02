const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
    token: 'Your Token, u can found it in, api.slack.com > OAuth Tokens & Redirect URLs > Bot User OAuth Access Token',
    name: 'jokebot'
});

//Começando a manipular o bot
bot.on('start', () => {
    const params = {
        icon_emoji: ':smiley:'
    }

    bot.postMessageToChannel('geral', `Carlus Albert conta varias piadinhas, digite '@jokebot' seguido de 'help' para saber mais! `, params);
})

//lidando com erros
bot.on('error', (err) => console.log(err));

//Lidando com as mensagens
//se mencionar o bot no slack vou conseguir pegar um objeto que vai contar informações sobre e inclusive a mensagem que foi escrita , basta dar um console.log(data)
bot.on('message', (data) => {
    if (data.type !== 'message') {
        return;
    }

    handleMessage(data.text);
});


//Função para responder oque for vir de data
function handleMessage(message) {
    if (message.includes(' chucknorris')) {
        chuckJoke();
    } else if (message.includes(' yomama')) {
        yoMamaJoke();
    } else if (message.includes(' random')) {
        randomJoke();
    } else if (message.includes(' help')) {
        runHelp();
    }
}

//Função da qual vai contar piada do chuckNorris
function chuckJoke() {
    axios.get('http://api.icndb.com/jokes/random')
        .then(res => {
            const joke = res.data.value.joke;

            const params = {
                icon_emoji: ':open_mouth:'
            };

            bot.postMessageToChannel(
                'geral',
                `Um fato sobre Chuck Norris:  ${joke}`,
                params
            )

        })
}

//Função da qual vai contar piada da sua mae
function yoMamaJoke() {
    axios.get('https://api.yomomma.info')
        .then(res => {
            const joke = res.data.joke;

            const params = {
                icon_emoji: ':smiling_imp:'
            };

            bot.postMessageToChannel(
                'geral',
                `Um fato sobre sua mãe:  ${joke}`,
                params
            )

        })
}


//Função da qual vai contar piada aleatoria
function randomJoke() {
    const rand = Math.floor(Math.random() * 2) + 1;

    if (rand === 1) {
        chuckJoke();
    } else {
        yoMamaJoke();
    }
}

//Função para mostrar textos de ajuda
function runHelp() {
    const params = {
        icon_emoji: ':question:'
    }

    bot.postMessageToChannel(
        'geral',
        `Digite @jokebot acompanhado de uma das três opções existentes, 'chucknorris' para receber um fato sobre Chuck Norris 'yomama' para receber um fato sobre sua mãe ou 'random' para receber um fato aleatorio`,
        params
    )
   
}