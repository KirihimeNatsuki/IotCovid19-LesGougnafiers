const express = require('express')
const app = express()
const path = require('path')
const Client = require('ibmiotf')
const https = require('https')
const dotenv = require('dotenv')


app.use(express.static(path.join(__dirname, 'public')));
dotenv.config()
const port = process.env.PORT || 3000
const org = process.env.org
const deviceType = process.env.devicetype
const apiKey = process.env.apiKey
const apiToken = process.env.tokenApi

//Config application

var appClientConfig = {
    "org": org,
    "id": "monappli",
    "auth-key": apiKey,
    "auth-token": apiToken,
    "type" : "shared"
};

app.listen(port, function(req, res) {
    console.log(`server listening on ${port}`)
})


// Partie client

var deviceClientConfig = {
    "org": org,
    "id": "dtc3",
    "type": deviceType,
    "auth-method": "token",
    "auth-token": "citrouillerouge"
};

var deviceClient = new Client.IotfDevice(deviceClientConfig);
deviceClient.log.setLevel('trace');

deviceClient.connect();

deviceClient.on("connect", function () {
    console.log("--- Je suis connecté");
    var myQosLevel=0
    deviceClient.publish("telemetry","json",'{ "temp" : 37, "fc" : 65 }');
    deviceClient.publish("status","json",'{ "etat" : "ok" }');
});




var appClient = new Client.IotfApplication(appClientConfig);
appClient.log.setLevel('debug');
appClient.connect();

appClient.on("connect", function () {
    console.log("Connecté au broker IBM");
    appClient.subscribeToDeviceEvents("DTC_test","dtcdtcdtc3","status");
    var myData={'temp' : 37, 'fc' : 60};
    myData = JSON.stringify(myData);
    appClient.publishDeviceEvent("DTC_test","avemoi", "telemetry", "json", myData);
});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
    console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
});

appClient.on("error", function (err) {
    console.log("Error : "+err);
});


// Créer un nouveau device/terminal


const data = JSON.stringify({
    "deviceId": "DTC_coucou",
    "authToken": "citrouillerouge",
    "deviceInfo": {
        "serialNumber": "string",
        "manufacturer": "string",
        "model": "string",
        "deviceClass": "string",
        "description": "string",
        "fwVersion": "string",
        "hwVersion": "string",
        "descriptiveLocation": "string"
    },
    "location": {
        "longitude": 0,
        "latitude": 0,
        "elevation": 0,
        "accuracy": 0,
        "measuredDateTime": "2020-06-11T08:03:25.423Z"
    },
    "metadata": {}
})

const options = {
    hostname: org + '.internetofthings.ibmcloud.com',
    port: 443,
    path: '/api/v0002/device/types/DTC_test/devices',
    method: 'POST',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + new Buffer(apiKey + ':' + apiToken).toString('base64')
    }
}

const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
    res.on('data', (d) => {
        process.stdout.write(d)
    })
})

req.on('error', (error) => {
    console.error(error)
})

req.write(data)
req.end()


