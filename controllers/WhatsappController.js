import response from './../response.js'
import request from 'request';

export const sendMessage = async(receiver, content_text) => {
    var options = {
        'method': 'POST',
        'url': 'https://lab.itsbuah.com/chats/send',
        'headers': {
            'angel-key': 'ECOM.c9dc7e39c892544e815',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "receiver": receiver,
            "message": content_text
        })

        };
        request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });

    return 1
}

export const webhook = async(req, res) => {
    
}