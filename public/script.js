/**
 * DEPENDANCES
 */
const client = require('ibmiotf');
const config = JSON.parse(data);

/**
 * CONFIG VARIABLES GLOBALES
 */
const org = config.org;
const deviceType = config.deviceType;
const apiKey = config.apiKey;
const tokenApi = config.tokenApi;
window.device = {};

/**
 * CONFIG APPLI
 */
let appClientConfig = {
    "org": org,
    "id": "myapp",
    "auth-key": apiKey,
    "auth-token": tokenApi,
    "type" : "shared"
};

let appClient = new client.IotfApplication(appClientConfig);
appClient.log.setLevel('debug');
appClient.connect();

/**
 * FONCTIONS
 */

function getDeviceId() {
    window.device.id = prompt("Enter a unique ID of at least 8 characters containing only letters and numbers (Warning : it will be displayed on the dashboard!):");
    if (deviceIdRegEx.test(window.device.id) === true) {
        console.log("Connecting with device id: " + window.device.id);
        createDevice();
    } else {
        window.alert("Device ID must be atleast 8 characters in length, and contain only letters and numbers.");
        getDeviceId();
    }
}

function createDevice() {
    let xhr = new XMLHttpRequest();
    let url = document.location.href + "create/" + window.device.id;
    console.log("url : " + url);
    xhr.open("POST", url, true);

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let temp = JSON.parse(xhr.responseText);
            window.device.authToken = temp.authToken;
            window.device.clientId = temp.clientId;
        }
    }
    xhr.send();
}

function addDevice() {
    let nomContact = document.getElementById("nomContact").value;
    appClient.subscribeToDeviceEvents(deviceType, nomContact, "id");
}

/**
 * CODE PRINCIPAL
 */
appClient.on("connect", function () {
    console.log("Connecté au broker IBM");
    appClient.subscribeToDeviceEvents(deviceType, window.device.id,"id");
});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
    console.log("Device Event from : "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
    let data = JSON.parse(payload);
    let tRow = document.createElement("tr");
    let nomContact = document.createElement("td");
    let etatContact = document.createElement("td");
    nomContact.innerHTML = data.deviceId;
    etatContact.innerHTML = data.etat;
    tRow.appendChild(nomContact);
    tRow.appendChild(etatContact)
    document.getElementById('contacts').appendChild(tRow);
});

appClient.on("error", function (err) {
    console.log("Error : "+err);
});


document.getElementById("ajouter").addEventListener("click", addDevice);