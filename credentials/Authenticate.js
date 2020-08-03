const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const docs = require('../GoogleDocs/docs');
const spreadsheets = require('../GoogleSpreadsheets/spreadsheets').spreadsheets;
const AVAILABLE_SCOPES = {
    docs : 'https://www.googleapis.com/auth/documents',
    spreadsheets : 'https://www.googleapis.com/auth/spreadsheets'
};
// Visit https://developers.google.com/identity/protocols/oauth2/scopes for a full list of possible scopes.
const TOKEN_PATH = 'credentials/token.json';
const SCOPES = [];
const auth = {
    grant : function(){
        for (const scope of arguments) {
            if(!(scope in AVAILABLE_SCOPES))throw `Unresolved scope: ${scope}. Available scopes: ${Object.keys(AVAILABLE_SCOPES).join(', ')}`;
            SCOPES.push(AVAILABLE_SCOPES[scope]);
        }
        if(SCOPES.length===0){ //If no scope is specified all scopes are used.
            for (const scope in AVAILABLE_SCOPES) {
                SCOPES.push(AVAILABLE_SCOPES[scope]);
            }
        }
        return new Promise((resolve, reject) => {
            fs.readFile('credentials/credentials.json', (err, content) => {
                if (err) reject(`Error reading credentials file. Make sure you've enabled Google APIs & followed the instructions in Github's readme`);
                const raw_credentials = JSON.parse(content);
                auth.authorize(raw_credentials).then(credentials=>{
                    docs.authenticate(credentials);
                    spreadsheets.authenticate(credentials);
                    resolve({success:true});
                });
            });
        });
    },
    authorize : function (credentials) {
    return new Promise((resolve, reject) => {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                auth.getNewToken(oAuth2Client).then(t=>resolve(t));
            }else{
                oAuth2Client.setCredentials(JSON.parse(token));
                resolve(oAuth2Client);
            }
        });
    })
},
    getNewToken : function (oAuth2Client) {
    return new Promise((resolve, reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return reject('Error retrieving access token');
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                resolve(oAuth2Client);
            });
        });
    });
}
};
module.exports = auth;
