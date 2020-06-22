/**
    Liste des dépendances
*/

const express = require('express')
const path = require('path')
const client = require('ibmiotf')
const https = require('https')
const dotenv = require('dotenv')

/**
    Configuration de base de toute l'application
*/

const app = express()

app.use(express.static(path.join(__dirname, 'public')));
dotenv.config()
const port = process.env.PORT || 3000
const org = process.env.org
const deviceType = process.env.devicetype
const apiKey = process.env.apiKey
const apiToken = process.env.apiToken
const date_actuelle = new Date()

/**
    Config application
*/

const appClientConfig = {
    org: org,
    id: "monappli",
    "auth-key": apiKey,
    "auth-token": apiToken,
    type : "shared"
};


// Créer un nouveau device/terminal

app.post('/create/:deviceId', function (req, res) {
    const data = JSON.stringify({
        deviceId: document.getElementById("device_id").value,
        authToken: newToken(),
        deviceInfo: {
            serialNumber: "string",
            manufacturer: "string",
            model: "string",
            deviceClass: "string",
            description: "string",
            fwVersion: "string",
            hwVersion: "string",
            descriptiveLocation: "string"
        },
        location: {
            longitude: 0,
            latitude: 0,
            elevation: 0,
            accuracy: 0,
            measuredDateTime: date_actuelle.getFullYear() + '-' + ('0' + date_actuelle.getMonth() + 1).slice(-2) + '-' + ('0' + date_actuelle.getDate()).slice(-2) + ':' + ('0' + date_actuelle.getHours()).slice(-2) + ':' + ('0' + date_actuelle.getMinutes()).slice(-2)
        },
        metadata: {}
    })

    const options = {
        hostname: org + '.internetofthings.ibmcloud.com',
        port: 443,
        path: '/api/v0002/device/types/DTC_test/devices',
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + new Buffer(apiKey + ':' + apiToken).toString('base64')
        }
    }

    const request = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    request.on('error', (error) => {
        console.error(error)
    })

    request.write(data)
    request.end()
})

/**
     Création d'un nouveau token
*/
function newToken () {
    let res = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?@'
    const charactersLength = characters.length
    for (let i = 0; i < 20; i++) {
        res += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return res
}

/**
    Serveur
*/
app.listen(port, function(req, res) {
    console.log(`server listening on ${port}`)
    console.log(new Buffer(apiKey + ':' + apiToken).toString('base64'))
})

