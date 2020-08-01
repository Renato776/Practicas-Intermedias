const {google} = require('googleapis');
const basics = {
    getDocTitle : function(auth,docID){
        const docs = google.docs({version: 'v1', auth});
        return new Promise((resolve, reject) => {
            docs.documents.get({documentId: docID}, (err, res) => {
                if (err) reject('The API returned an error: ' + err);
                resolve(res.data.title);
            });
        });
    },
    append : function(auth,docID,text){
        const docs = google.docs({version: 'v1', auth});
        return new Promise((resolve, reject) => {
            docs.documents.batchUpdate(
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
module.exports = basics;

