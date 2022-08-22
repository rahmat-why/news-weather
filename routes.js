import { Router } from 'express'
import response from './response.js'
import * as controller from './controllers/NewsWeatherController.js'
import * as controller2 from './controllers/EtlWeatherController.js'

const router = Router()

router.post('/etl-weather', controller2.etlWeather)

router.all('*', (req, res) => {
    response(res, 404, false, 'The requested url cannot be found.')
})

export default router