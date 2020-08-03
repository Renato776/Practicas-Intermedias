const Table = require('./GoogleSpreadsheets/spreadsheets').table;
const Authorizer = require('./credentials/Authenticate');
Authorizer.grant().then(()=>{Main()});
async function Main(){
    const table = new Table('name','score','age');
    await table.connect('https://docs.google.com/spreadsheets/d/1772D-LsrgvaB3zSmOXk087op2RNJQy9Cc4GpHcyER34/edit#gid=448958861');
    await table.fetch();
    console.log(table.toSQL());
}


