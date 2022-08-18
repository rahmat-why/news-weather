import { Client } from 'linkedin-private-api';
import { showJobTag } from './JobsLetterController.js'
import request from 'request';

export const etlWeather = async(req, res) => {
    try {
        var options = {
            'method': 'GET',
            'url': 'https://api.openweathermap.org/data/2.5/weather?q=Bogor&appid='+process.env.OPENWEATHERMAP_KEY,
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });

        return 1
    } catch (error) {
        console.log(error);
    }
}
