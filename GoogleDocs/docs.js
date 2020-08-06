const {google} = require('googleapis');
const docs = {
    credentials : undefined,
    docs : undefined,
    getDriver : function(){
        return this.docs;
    },
    authenticate : function(credentials){
        this.docs = google.docs({version: 'v1', auth : credentials});
    },
    getDocTitle : function(docID){
        return new Promise((resolve, reject) => {
            this.docs.documents.get({documentId: docID}, (err, res) => {
                if (err) reject('The API returned an error: ' + err);
                resolve(res.data.title);
            });
        });
    },
    append : function(docID,text){
        return new Promise((resolve, reject) => {
            this.docs.documents.batchUpdate(
                {
                    "documentId": docID,
                    "resource":{
                        "requests": [
                            {
                                "insertText": {
                                    "text": text+'\n',
                                    "endOfSegmentLocation": {
                                        "segmentId": ""
                                    }
                                }
                            }
                        ]
                    }
                }, (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    resolve(res);
                });
        });
    }
};
module.exports = docs;

