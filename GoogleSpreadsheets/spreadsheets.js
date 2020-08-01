const {google} = require('googleapis');
const spreadsheets = {
    sheets : undefined,
    authenticate : function(credentials){
        this.sheets = google.sheets({version: 'v4', auth : credentials});
    },
    overview : function(spreadsheetID){
        return new Promise((resolve, reject) => {
            this.sheets.spreadsheets.get({
                spreadsheetId: spreadsheetID,
                "includeGridData": false
            }, (err, res) => {
                if (err)
                {
                    if(err['code']===403)return reject('Caller does not have permission.');
                    else return reject(`An error occurred. Error code: ${err['code']}
                    Message : ${err['message']}`);
                }
                resolve(res.data);
            });
        });
    }
};
module.exports = spreadsheets;

