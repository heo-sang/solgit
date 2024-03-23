var express = require('express');
var cors = require('cors');

require("dotenv").config({ path: __dirname + "/.env" });
const axios = require('axios');
var bodyParser = require('body-parser');
const { response } = require('express');

const CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID
// const CLIENT_SECRET = process.env.REACT_APP_GITHUB_CLIENT_SECRET
var app = express();

app.use(cors());
app.use(bodyParser.json());

//디바이스플로우
app.get('/getUserCode', async function (req, res) {

    const resi = await axios("https://github.com/login/device/code?client_id=" + CLIENT_ID, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    });
    res.send(resi.data);
});


//디바이스플로우엑세스토큰
app.get('/getDeviceAccessToken', async function (req, res) {
    const params = "?client_id=" + CLIENT_ID + "&device_code=" + req.query.code + "&grant_type=urn:ietf:params:oauth:grant-type:device_code";


    const resi = await axios("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    });
    res.send(resi.data);
});




// code being passed from the frontend
// app.get('/getAccessToken', async function (req, res) {
//     const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

//     const resi = await axios("https://github.com/login/oauth/access_token" + params, {
//         method: "POST",
//         headers: {
//             "Accept": "application/json"
//         }
//     });
//     res.send(resi.data);
// });





//getUserData
//access token is going to be passed in as an authorization header

app.get('/getUserData', async function (req, res) {
    req.get("Authorization"); //Bearer ACCESSTOKEN
    const userData = await axios("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": req.get("Authorization") //Bearer ACCESSTOKEN
        }
    });

    res.send(userData.data);
})

app.listen(4000, function () {
    console.log("CORS server running on port 4000");
})