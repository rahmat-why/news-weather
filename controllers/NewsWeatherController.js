import response from './../response.js'
import { Kota, Provinsi, Pulau, Message, NextState } from "../models/newsWeatherModel.js";
import { sendMessage } from './WhatsappController.js'

export const showKota = async(req, res) => {
    try {
        const show_kota = await Kota.findAll({
            where: {
                provinsi_id: req.params.provinsi_id
            }
        });
        res.json(show_kota);
    } catch (error) {
        console.log(error);
    }
}

export const showProvinsi = async(req, res) => {
    try {
        const show_kota = await Provinsi.findAll({
            where: {
                pulau_id: req.params.pulau_id
            }
        });
        res.json(show_kota);
    } catch (error) {
        console.log(error);
    }
}

export const showPulau = async(req, res) => {
    try {
        const show_kota = await Pulau.findAll({

        });
        res.json(show_kota);
    } catch (error) {
        console.log(error);
    }
}

export const showNextState = async(state_id) => {
    try {
        var next_states = await NextState.findAll({
            where: {
                current_state: state_id
            }
        });

        return next_states[0]
    } catch (error) {
        console.log(error);
    }
}

export const showMessage = async(message_id) => {
    var messages = await Message.findOne({
        where: {
            message_id: message_id
        }
    });

    return JSON.parse(messages.content)
}

export const executeMessage = async(message_id, telp) => {
    let show_message = await showMessage(message_id)
    for(let i in show_message) {
        var content_text = show_message[i].content_text
        await sendMessage(telp, content_text)
    }

    return 1
}