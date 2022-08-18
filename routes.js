import { Router } from 'express'
import response from './response.js'
import * as controller from './controllers/NewsWeatherController.js'

const router = Router()

router.get('/show-kota/:provinsi_id', controller.showKota)
router.get('/show-provinsi/:pulau_id', controller.showProvinsi)
router.get('/show-pulau', controller.showPulau)

router.all('*', (req, res) => {
    response(res, 404, false, 'The requested url cannot be found.')
})

export default router