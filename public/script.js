/**
    Liste des dépendances
*/
const client = require('ibmiotf')
const buffer = require('buffer/').Buffer
const param = JSON.parse(data)

/**
    Configuration globale
*/

const org = param.org
const deviceType = param.devicetype
const apiKey = param.apiKey
const apiToken = param.apiToken
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

const appClient = new client.IotfApplication(appClientConfig);
appClient.log.setLevel('debug');
appClient.connect();

appClient.on("connect", function () {
    console.log("Connecté au broker IBM");
    appClient.subscribeToDeviceEvents(deviceType, window.device_id,"sante");
});


/**
 Fonctions de l'appli
 */

function getDeviceForConnect () {
    window.device_id = prompt('Entrer un ID Client !')
    return window.device_id
}

function publish () {
    const myQosLevel=0
    const myDatasante = { etat: document.getElementById('etat').value }
    const myDatatemp = {  temp: document.getElementById('temp').value }
    deviceClient.publish("telemetry","json", myDatatemp);
    deviceClient.publish("sante","json", myDatasante);
}

function subscribe () {
    const nomDevice = document.getElementById('nomDevice').value
    try {
        appClient.subscribeToDeviceEvents(deviceType, nomDevice, 'sante')
    } catch(error) {
        console.warn(error);
    }
}


appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
    console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);

});




appClient.on("error", function (err) {
    console.log("Error : "+err);
});


window.onload = getDeviceForConnect()
document.getElementById('publish').addEventListener('click', publish)
document.getElementById('subscribe').addEventListener('click', subscribe)








/*
/**
    Config client
*/
/*

const deviceClientConfig = {
    "org": org,
    "id": window.device_id,
    "type": deviceType,
    "auth-method": "token",
    "auth-token": "citrouille"
};

const deviceClient = new client.IotfDevice(deviceClientConfig);
deviceClient.log.setLevel('trace');
deviceClient.connect();

deviceClient.on("connect", function () {
    console.log("--- Je suis connecté");
    const myQosLevel=0
});



    var myData={'temp' : 37, 'fc' : 60};
    myData = JSON.stringify(myData);
    appClient.publishDeviceEvent("DTC_test","avemoi", "telemetry", "json", myData);
 */
