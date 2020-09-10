const Table = require('./GoogleSpreadsheets/spreadsheets').table;
const spreadsheets = require('./GoogleSpreadsheets/spreadsheets');
const docs = require('./GoogleDocs/docs');
const { Pool } = require('pg');
const pool = new Pool();
const Authorizer = require('./credentials/Authenticate');
Authorizer.grant().then(()=>Main());
async function Main(){
    const code = 7;
    const hoja_de_prueba = '1772D-LsrgvaB3zSmOXk087op2RNJQy9Cc4GpHcyER34';
    switch (code){
        case -3 :
            const docs_driver = docs.getDriver();
            let requests = [
                {
                    replaceAllText: {
                        containsText: {
                            text: '{{customer-name}}',
                            matchCase: true,
                        },
                        replaceText: 'Practicas Intermedias',
                    },
                },
                {
                    replaceAllText: {
                        containsText: {
                            text: '{{date}}',
                            matchCase: true,
                        },
                        replaceText: 'Alguna Fecha',
                    },
                },
            ];
            docs_driver.documents.batchUpdate({
                documentId: '1A4jsyrG_IrNxzpZMJFf18wJCk_WLFLSNyFX22kF3dpU',
                resource: {
                    requests
                }
            }, (err, res) => {
                if (err) console.log(err);
                console.log(res);
                process.exit(0);
            });
            break;
        case -2 :
            await docs.append('1A4jsyrG_IrNxzpZMJFf18wJCk_WLFLSNyFX22kF3dpU','Practicas intermedias Test');
            break;
        case -1 :
            const k =  await docs.getDocTitle('1A4jsyrG_IrNxzpZMJFf18wJCk_WLFLSNyFX22kF3dpU');
            console.log(k);
            break;
        case 0:
            const table = new Table('name','score','age');
            await table.connect('https://docs.google.com/spreadsheets/d/1772D-LsrgvaB3zSmOXk087op2RNJQy9Cc4GpHcyER34/edit#gid=448958861');
            await table.fetch();
            console.log(table.toSQL());
            break;
        case 1:
            const table2 = new Table('fecha','curso','estudiante','punteo');
            await table2.connect('19NV-XzX7KdZd1TfiapXlZGQpjNnLNo4oTe_6jgguIVE','Table de postgres exportada');
            table2.rows = (await pool.query('select * from practicas_intermedias')).rows;
            await table2.save();
            process.exit(0);
            break;
        case 2:
            const driver = spreadsheets.getDriver();
            driver.spreadsheets.get({
                spreadsheetId: '1772D-LsrgvaB3zSmOXk087op2RNJQy9Cc4GpHcyER34',
                "includeGridData": false
            },(err,res)=>{
                console.log(res) ;
                process.exit(0);
            });
            break;
        case 5:
            const nueva_prueba = '19NV-XzX7KdZd1TfiapXlZGQpjNnLNo4oTe_6jgguIVE';
            const nueva_tabla = new Table('Carnet','Nombre','Curso','Edad');
            await nueva_tabla.connect(nueva_prueba);
            nueva_tabla.rows = [{'Carnet': 2001709244 , 'Nombre' : 'Renato Flores', 'Curso' : 'Practicas Intermedias', 'Edad' : 22},
                {'Carnet': 201502458 , 'Nombre' : 'Erick Chavez', 'Curso' : 'Practicas Intermedias', 'Edad' : 55}];
            await nueva_tabla.save();
            process.exit(0);
            break;
        case 6:
            const table3 = new Table('Carnet','Nombre','Curso','Edad');
            await table3.connect('19NV-XzX7KdZd1TfiapXlZGQpjNnLNo4oTe_6jgguIVE');
            table3.rows.push({'Carnet':245112,'Nombre':'Alex Flores','Curso':'IPC2', 'Edad': 22 });
            await table3.append();
            process.exit(0);
            break;
        case 7:
            const table4 = new Table('Carnet','Nombre','Curso','Edad');
            await table4.connect('19NV-XzX7KdZd1TfiapXlZGQpjNnLNo4oTe_6jgguIVE');
            await table4.fetch();
            console.log(table4.toSQL());
            process.exit();
    }
}


