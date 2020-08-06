const {google} = require('googleapis');
const DEFAULT_SHEET_NAME = "Practicas Intermedias - Grupo1";
const spreadsheets = {
    table : function(){
        this.fetchedAll = false;
        this.header_less = true;
        this.map = {};
        this.rows = [];
        this.old = [];
        this.keys = [];
        this.spreadsheet = '';
        this.sheet = '';
        this.CHUNK = 500;
        for (const arg of arguments) {
            if(typeof arg == "string")this.keys.push({primaryKey:arg,header:arg});
            else this.keys.push(arg);
            for (const [j, sett] of this.keys.entries()) {
                this.map[sett.primaryKey] = j;
            }
        }
        this.connect = async function (spreadsheet, sheet){
            this.spreadsheet = spreadsheets.extractID(spreadsheet);
            this.sheet = sheet;
            const raw_header = await spreadsheets.getData({spreadsheet:this.spreadsheet,sheet:sheet},this.keys.length,1,1);
            if(!raw_header.success)throw `An error occurred fetching spreadsheet: ${this.spreadsheet}.
            ${raw_header.message}`;
            const header = raw_header.data[0];
            if(!header)return this.header_less = true;
            for (const [j, k] of header.entries()) {
                for (const Sett of this.keys) {
                    if(k.trim().replace(/\s+/g,'_').toLowerCase()==Sett.primaryKey.toLowerCase()){
                        this.map[Sett.primaryKey] = [j];
                        break;
                    }
                }
            }
            this.header_less = Object.keys(this.map).length === 0; // If no key was found is header-less. If at least one key was found it is considered the header.
            if(!this.header_less){
                let a = [];
                let u = {};
                for (const g in this.map) {
                    u[this.map[g]] = true;
                }
                for(let l = 0; l<this.keys.length; l++){
                    if(!u[l])a.push(l);
                }
                for (const Sett of this.keys) {
                    if(!(Sett.primaryKey in this.map)){
                        this.map[Sett.primaryKey] = a[0];
                        a.shift();
                    }
                }
            }
        }
        this.fetch = async function(limit,offset){
            if(limit && offset){
                if(offset===0)offset=1;
                const raw_data = await spreadsheets.getData({spreadsheet:this.spreadsheet,sheet:this.sheet},this.keys.length,offset,offset + limit - 1);
                if(!raw_data.success)throw `An error occurred while fetching data. limit:${limit},offset:${offset}, Error:\n${raw_data.message}`;
                const rows =  [];
                for (const e of raw_data.data) {
                    const ren = {};
                    for (const Sett of this.keys) {
                        const index = this.map[Sett.primaryKey];
                        ren[Sett.primaryKey] = e[index]?e[index].toString().trim()==''?null:e[index].toString().trim():null;
                    }
                    rows.push(ren);
                }
                this.fetchedAll = rows.length !== this.CHUNK;
                return rows;
            }else{
                this.fetchedAll = false;
                let i = this.header_less?1:2;
                while(!this.fetchedAll){
                    this.rows = [];
                    const data = await this.fetch(this.CHUNK,i);
                    this.rows = this.rows.concat(data);
                    this.old = this.rows.slice();
                    this.old = this.old.map(r=>{
                        let ren = {};
                        for (const k in r) {
                            ren[k] = r[k];
                        }
                        return ren;
                    });
                    this.fetchedAll = data.length !== this.CHUNK;
                    i += this.CHUNK;
                }
            }
        }
        this.toSQL = function (rows){
            const header = this.keys.map(k=>k.primaryKey);
            if(!rows)rows = this.rows;
            rows = rows.map(row=>{
                const values = [];
                for (const key in row) {
                    values.push(row[key]?`'${row[key].toString().trim().replace("'","''")}'`:'null');
                }
                return `(${values.join(',')})`;
            });
            return `select v.${header.join(',v.')}\n from (values ${rows.join(',\n')})\n v(${header.join(',')})`;
        }
        this.save = function(){
            let ValuesToUpdate = [];
            if(this.old.length===0 && this.header_less) {
                const h = new Array(this.keys.length);
                for (const k in this.map) {
                    h[this.map[k]] = k;
                }
                ValuesToUpdate.push(h);
            }
            for(let i = 0; i<this.rows.length;i++){
                const old = this.old.length > i ? this.old[i] : null;
                const v = new Array(this.keys.length);
                const jm = this.rows[i];
                if(old){
                    for (const cell in jm) {
                        v[this.map[cell]]=jm[cell] == old[cell]?null:jm[cell];
                    }
                }else{
                    for (const cell in jm) {
                        v[this.map[cell]]=jm[cell];
                    }
                }
                ValuesToUpdate.push(v);
            }
            const sheet = this.sheet?"'"+this.sheet+"'!":'';
            const range = `${sheet}A${this.header_less?1:2}`;
            return new Promise((resolve, reject) => {
                spreadsheets.sheets.spreadsheets.values.update({
                    spreadsheetId: this.spreadsheet,
                    range: range,
                    includeValuesInResponse: false,
                    responseDateTimeRenderOption: "FORMATTED_STRING",
                    valueInputOption: "USER_ENTERED",
                    resource : {
                        "range": range,
                        "majorDimension": "ROWS",
                        "values": ValuesToUpdate
                    }
                }).then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject({hint : `An error occurred while saving spreadsheet : ${this.spreadsheet}`,error : err});
                });
            });
        }
        this.append = function(sheet){
            if(this.spreadsheet=="")throw 'You must connect or use the set_spreadsheet method before attempting to save';
            const range = sheet?`'${sheet}'!`:'' + 'A1';
            return new Promise((resolve, reject) => {
                spreadsheets.sheets.spreadsheets.values.append({
                    spreadsheetId: this.spreadsheet,
                    range: range,
                    includeValuesInResponse: false,
                    insertDataOption: "INSERT_ROWS",
                    responseDateTimeRenderOption: "FORMATTED_STRING",
                    valueInputOption: "USER_ENTERED",
                    resource: {
                        majorDimension: "ROWS",
                        range: range,
                        values: this.rows.map(row=>{
                          const v = new Array(this.keys.length);
                            for (const k in this.map) {
                                v[this.map[k]] = row[k];
                            }
                          return v;
                        })
                    }
                }).then(res=>resolve(res)).catch(err=>{
                    reject({hint:'An error occurred while appending data.',error:err}) ;
                });
            });

        }
        this.set_spreadsheet = function(spreadsheet){
            this.spreadsheet = spreadsheets.extractID(spreadsheet);
        };
        this.createSheet = function(sheet){
            if(this.spreadsheet=="")throw 'You must connect to an spreadsheet before adding a new sheet to it. You can also use the set_spreadsheet method instead.';
            const rows = this.get_set();
            return new Promise((resolve, reject) => {
                spreadsheets.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: this.spreadsheet,
                    requestBody: {
                        requests: [{
                            addSheet: {
                                properties: {
                                    title: sheet?sheet:DEFAULT_SHEET_NAME,
                                }
                            }
                        }]
                    }
                }).then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject({hint : `An error occurred while creating sheet : ${sheet} over spreadsheet : ${this.spreadsheet}`,error:err});
                })
            });
        }
        this.create =  function(title,sheetTitle){
            const rows = this.get_set();
            return new Promise((resolve, reject) => {
                spreadsheets.sheets.spreadsheets.create({
                    resource: {
                        properties: {
                            "title": title?title:DEFAULT_SHEET_NAME
                        },
                        sheets: [
                            {
                                properties: {
                                    "title": sheetTitle?sheetTitle:DEFAULT_SHEET_NAME
                                },
                                data: [
                                    {
                                        rowData: rows
                                    }
                                ]
                            }
                        ]
                    }
                }).then(res=>{
                    resolve(res);
                }).catch(err=>{
                   reject({hint : `An error occurred while creating spreadsheet : ${title}`,error : err});
                });
            });
        }
        this.get_set = function(){
            const h = {values : new Array(this.keys.length)};
            for (const k in this.map) {
                h.values[this.map[k]] = {userEnteredValue : {stringValue : k}};
            }
            const rows = this.rows.map(row=>{
                const v = {values : new Array(this.keys.length)};
                for (const k in this.map) {
                    v.values[this.map[k]] = {userEnteredValue : {stringValue : row[k]?row[k].toString():""}};
                }
                return v;
            });
            rows.unshift(h);
            return rows;
        }
        return this;
    },
    sheets : undefined,
    extractID : function(url){
        return /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/.test(url)?new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(url)[1]:url;
    },
    toA1Notation : function (i){
        i-=1;
        const alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
            'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
        if (i >= alphabet.length) {
            return this.toA1Notation(Math.floor(i / alphabet.length) - 1)
                + this.toA1Notation(i % alphabet.length);
        }
        return alphabet[i];
    },
    authenticate : function(credentials){
        this.sheets = google.sheets({version: 'v4', auth : credentials});
    },
    getData(sheet,cols,lowerLimit,upperLimit){
        if(!lowerLimit || lowerLimit===0)lowerLimit = 1;
        if(!upperLimit)upperLimit = 500;
        if(!cols)cols = 10;
        if(typeof sheet === "string"){
            sheet = {spreadsheet : sheet};
        }
        const spreadsheetID = sheet['spreadsheet'];
        const range = `${sheet['sheet']?`'${sheet['sheet']}'!`:''}A${lowerLimit}:${spreadsheets.toA1Notation(cols)}${upperLimit}`;
        if(!spreadsheetID) throw `Unexpected sheet specification. Expected object: {spreadsheet : string, sheet ?: string} or string. Got: ${sheet}`;
        return new Promise((resolve, reject) => {
          this.sheets.spreadsheets.values.get({
              spreadsheetId: spreadsheetID,
              range: range,
              dateTimeRenderOption: "FORMATTED_STRING",
              majorDimension: "ROWS",
              valueRenderOption: "FORMATTED_VALUE"
          }).then(r=>{
              if(r.status!==200)resolve({success:false,message : `Error code : ${r.status} Error: ${JSON.stringify(r)}`});
              resolve({success : true, data : r.data?r.data.values?r.data.values:[]:[]});
          }).catch(err=>{
             resolve({success : false, message : err});
          });
        });
    },
    overview : function(spreadsheetID){
        spreadsheetID = spreadsheets.extractID(spreadsheetID);
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
module.exports = {getDriver : ()=>spreadsheets.sheets, spreadsheets : spreadsheets,table : spreadsheets.table};
