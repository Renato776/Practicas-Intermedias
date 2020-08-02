const {google} = require('googleapis');
const spreadsheets = {
    table : function(){
        this.fetchedAll = false;
        this.header_less = true;
        this.map = {};
        this.rows = [];
        this.keys = [];
        this.spreadsheet = '';
        this.sheet = '';
        this.CHUNK = 500;
        for (const arg of arguments) {
            if(typeof arg == "string")this.keys.push({primaryKey:arg,header:arg});
            else this.keys.push(arg);
        }
        this.connect = async function (spreadsheet, sheet){
            this.spreadsheet = spreadsheet;
            this.sheet = sheet;
            const raw_header = await spreadsheets.getData({spreadsheet:spreadsheet,sheet:sheet},this.keys.length,1,1);
            if(!raw_header.success)throw `An error occurred fetching spreadsheet: ${this.spreadsheet}.
            Error: ${raw_header.message}`;
            const header = raw_header.data[0];
            function resolve_default_header(t){
                for (const [j, sett] of t.keys.entries()) {
                    t.map[sett.primaryKey] = j;
                }
            }
            for (const [j, k] of header.entries()) {
                for (const Sett of this.keys) {
                    if(k.trim().replace(/\s+/g,'_').toLowerCase()==Sett.primaryKey.toLowerCase()){
                        this.map[Sett.primaryKey] = [j];
                        break;
                    }
                }
            }
            this.header_less = Object.keys(this.map).length === 0; // If no key was found is header-less. If at least one key was found it is considered the header.
            if(this.header_less)resolve_default_header(this);
            else{
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
                return rows;
            }else{
                this.fetchedAll = false;
                let i = this.header_less?1:2;
                while(!this.fetchedAll){
                    this.rows = [];
                    const data = await this.fetch(this.CHUNK,i);
                    this.rows = this.rows.concat(data);
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
        return this;
    },
    sheets : undefined,
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

