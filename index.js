const SlackBot = require('slackbots');
const axios = require('axios');



const bot = new SlackBot({
    token: 'xoxb-716556317062-703030051346-MqRpsJYOfX4XxwCOg4hzoWI4',
    name: 'jokebot'
});


//Começando a manipular o bot
bot.on('start', () => {
    const params = {
        icon_emoji: ':smiley:'
    }
})

//lidando com erros
bot.on('error', (err) => console.log(err));

//Lidando com as mensagens
//se mencionar o bot no slack vou conseguir pegar um objeto que vai contar informações sobre a mensagem que foi escrita , basta dar um console.log(data)
// DATA AQUI
// { type: 'message',
//   subtype: 'bot_message',
//   text: 'Digite @jokebot seguindo de um \'oi\' para o bot falar ctg',
//   suppress_notification: false,
//   username: 'jokebot',
//   icons:
//    { emoji: ':smiley:',
//      image_64:
//       'https://a.slack-edge.com/37d58/img/emoji_2017_12_06/apple/1f603.png' },
//   bot_id: 'BM2HBLK3Q',
//   team: 'TM2GC9B1U',
//   user_team: 'TM2GC9B1U',
//   source_team: 'TM2GC9B1U',
//   channel: 'CLP0BJQRH',
//   event_ts: '1565179502.000100',
//   ts: '1565179502.000100' }
bot.on('message', (data) => {
    var resposta = false;
    if (data.type !== 'message') {
        return;
    }

    // console.log('DATA')
    // console.log(data)

    let infoChannel = {
        method: 'GET',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: `token=xoxp-716556317062-713936428100-716294888039-12c59f2dd81ff4027e6ad69cd4a086ec&channel=${data.channel}`,
        url: 'https://slack.com/api/channels.info'
    };

    // console.log("INFO CHANNEL AQUI")
    // console.log(infoChannel)
    axios(`https://slack.com/api/channels.info?token=xoxp-716556317062-713936428100-716294888039-12c59f2dd81ff4027e6ad69cd4a086ec&channel=${data.channel}`).then(res => {
        // console.log("HOJE SIM: ", res)
    }).catch(err => {
        // console.log("HOJE NAO!: ", err)
    })

    // console.log("data aqui antes de mandar pro banco")
    // console.log(data.user)
    if (data.inviter) {
        return;
    }else{
        
        // console.log('ENTREI AQUI DENTRO ONDE TA O AXIOS')
        if(data.user === 'ULP0W1HA6'){
            resposta = false;
        }else{
            resposta = true;
        }
        console.log("IS BOT AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
        console.log(resposta)
        const arrayMsg = data.text.split('@')
        axios.post('http://localhost:3000/api/v1/SlackBot',{slk_in_usuid: data.user, slk_st_msg: data.text, slk_st_canal: data.channel, slk_bo_resposta: resposta}).then(res=>{
            console.log('OLHA A PEDRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
            console.log(res)
        })
        .catch(erro=> {
            console.log("deu erro ao inserir no banco: ", erro)
        })
    }
    
    handleMessage(data);
});

//Função para responder oque for vir de data
function handleMessage(data) {
    let message = data.text
    if (message.includes(' chucknorris')) {
        chuckJoke();
    } else if (message.includes(' yomama')) {
        yoMamaJoke();
    } else if (message.includes(' close')) {
        close(data);
    } else if (message.includes(' help')) {
        runHelp();
    }
}

// else if(message.includes(' oi')){

// }

//Função da qual vai contar piada do chuckNorris
function chuckJoke() {
    axios.get('http://api.icndb.com/jokes/random')
        .then(res => {
            const joke = res.data.value.joke;

            const params = {
                icon_emoji: ':open_mouth:'
            };

            bot.postMessage(
                'DLP1ASWRZ',
                `Um fato sobre Chuck Norris:  ${joke}`,
                'ULZTJCL2Y',
                params
            )

        })
}

function close(data) {
    let channel = data.channel;

    let infoChannelClose = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: `token=xoxp-716556317062-713936428100-716294888039-12c59f2dd81ff4027e6ad69cd4a086ec&channel=${channel}`,
        url: 'https://slack.com/api/channels.leave'
    };

    axios(infoChannelClose)

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