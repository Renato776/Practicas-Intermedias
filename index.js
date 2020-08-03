const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const docs = require('./GoogleDocs/docs');
const spreadsheets = require('./GoogleSpreadsheets/spreadsheets');
const SCOPES = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets'
];
// Visit https://developers.google.com/identity/protocols/oauth2/scopes for a full list of possible scopes.
const TOKEN_PATH = 'credentials/token.json';

fs.readFile('credentials/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const raw_credentials = JSON.parse(content);
    authorize(raw_credentials).then(credentials=>{
        docs.authenticate(credentials);
        spreadsheets.authenticate(credentials);
        Main();
    });
});
function authorize(credentials) {
    return new Promise((resolve, reject) => {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                getNewToken(oAuth2Client).then(t=>resolve(t));
            }else{
                oAuth2Client.setCredentials(JSON.parse(token));
                resolve(oAuth2Client);
            }
        });
    })
}
function getNewToken(oAuth2Client) {
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

async function Main(){
    /*
    const test_docs = [
        '1MossjVGFlmq6kur6RV3DVCUfAIwxtThq0OqoWuFJUpA',
        '1A4jsyrG_IrNxzpZMJFf18wJCk_WLFLSNyFX22kF3dpU',
        '1Lub5pjxpAUgtbnt8Rm4iC3tQe3xAcwP3vOchHxf03bs'
    ];
    const titles = [];
    for (const test of test_docs) {
        titles.push(await docs.getDocTitle(test));
    }
    docs.append(test_docs[1],`Abstraction worked!!`).then(()=>{
        console.log('Append text operation successful!');
    });
    **/
    const table = new spreadsheets.table('name','score','age');
    await table.connect('https://docs.google.com/spreadsheets/d/1772D-LsrgvaB3zSmOXk087op2RNJQy9Cc4GpHcyER34/edit#gid=448958861');
    await table.fetch();
    table.rows[table.rows.length-1] = {name : 'An actual name', score : 100, age:24};
    await table.save();
    console.log(table.toSQL());
}


