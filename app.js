const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 3000

app.post('/webhook', (req, res) => {
    const reply_token = req.body.events[0].replyToken
    const msg = req.body.events[0].message.text
    if (msg.indexOf("มื้อนี้กินอะไรดี") > -1) {
        let item = fs.readFileSync('foodlist.txt', 'utf8')
        item = item.split("\n");
        const num = Math.floor(Math.random() * item.length + 1)
        reply(msg, reply_token, item[num])
    }
    res.sendStatus(200)
})

app.get('/foodlist', (req, res) => {
    let item = fs.readFileSync('foodlist.txt', 'utf8')
    item = item.split("\n")
    const num = Math.floor(Math.random() * item.length + 1)
    res.send(item[num])
})

app.listen(port)

function reply(msg, reply_token, answer) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {jBxB4xf+WNeABeDbfXoAk+LM7oppwmrxJ5qaSUPGotCfukdg8TdWrRWsGY6CdpiOgPEdalX83ZZEQBsIjx2D00qbP+c23dsW+VZv4mK0v+P39+Rf/tG5k/yrj0Kla195N6NQlk9Fm1Cxz4MeUkSDigdB04t89/1O/w1cDnyilFU=}'
    }

    let data = []
    if (msg.indexOf("มื้อนี้กินอะไรดี") > -1) {
        data = [{
            "type": "flex",
            "altText": answer + "...",
            "contents": {
                "type": "bubble",
                "hero": {
                    "type": "image",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_2_restaurant.png",
                    "size": "full",
                    "aspectRatio": "20:13",
                    "aspectMode": "cover",
                    "action": {
                        "type": "uri",
                        "uri": "https://linecorp.com"
                    }
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "md",
                    "action": {
                        "type": "uri",
                        "uri": "https://linecorp.com"
                    },
                    "contents": [
                        {
                            "type": "text",
                            "text": "เมนูอาหารของคุณคือ",
                            "size": "xl",
                            "weight": "bold"
                        },
                        {
                            "type": "text",
                            "text": answer,
                            "wrap": true,
                            "color": "#aaaaaa",
                            "size": "sm"
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "md",
                    "contents": [
                        {
                            "type": "button",
                            "style": "primary",
                            "color": "#905c44",
                            "action": {
                                "type": "message",
                                "label": "ลองใหม่!",
                                "text": "มื้อนี้กินอะไรดี?"
                            }
                        },
                        {
                            "type": "button",
                            "style": "secondary",
                            "color": "#905c44",
                            "action": {
                                "type": "uri",
                                "label": "ค้นหาร้าน",
                                "uri": "https://www.google.co.th/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3"
                            }
                        }
                    ]
                }
            }
        }]
    }

    const options = {
        method: 'POST',
        headers: headers,
        data: {
            replyToken: reply_token,
            messages: data,
        },
        url: 'https://api.line.me/v2/bot/message/reply',
    }
    axios(options)
}
