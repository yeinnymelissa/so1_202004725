const express = require('express');
const mysql = require('mysql');
const app = express();
const axios = require('axios');
const cors = require('cors')
var bodyParser = require('body-parser')

let maquinas = [];
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ktalan30',
    database: 'so1p1'
});

/*connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ', err);
    return;
  }

  console.log('Conectado a la base de datos!');

  connection.query('SELECT * FROM biblioteca_musical', (err, rows) => {
    if (err) {
      console.error('Error al realizar la consulta: ', err);
      return;
    }

    let result = Object.values(JSON.parse(JSON.stringify(rows)));

    console.log('Resultados: ', result);
  });
});*/

app.get('/', function (req, response) {


    let ipAddress = req.header('x-forwarded-for') ||
        req.socket.remoteAddress;

    if (ipAddress.substr(0, 7) == "::ffff:") {
        ipAddress = ipAddress.substr(7)
    }

    if (maquinas.find((maqui) => maqui === ipAddress) == undefined) {
        maquinas.push(ipAddress)
    }
    console.log(maquinas);
    response.send(ipAddress);

});

app.post('/so1/buscarProcesos', async function (req, response) {

    const { data } = await axios.get("http://" + req.body.ip + ":8000/cpu")


    await connection.query('DELETE FROM PROCESOS_HIJOS', (err, rows) => {
        if (err) {
            console.error('Error al realizar la consulta: ', err);
            return;
        }
    });

    await connection.query('DELETE FROM PROCESOS', (err, rows) => {
        if (err) {
            console.error('Error al realizar la consulta: ', err);
            return;
        }
    });

    const promesas = [];

    for (let i = 0; i < data.length; i++) {
        const proceso = data[i];

        let sqlQuery = "INSERT INTO PROCESOS (PID_PROC, NOMBRE, USUARIO, ESTADO, RAM) VALUES (" + proceso.pid + ", '" + proceso.nombre + "'," + proceso.user + ", '" + proceso.estado + "'," + proceso.ram + ")";

        await connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error al realizar la consulta: ', err);
                return;
            }
        });

        for (let j = 0; j < proceso.hijos.length; j++) {
            const hijo = proceso.hijos[j];

            let sqlQueryHijos = "INSERT INTO PROCESOS_HIJOS (PID, NOMBRE, PID_PROC) VALUES (" + hijo.pid + ", '" + hijo.nombre + "'," + proceso.pid + ")";

            await connection.query(sqlQueryHijos, (err, result) => {
                if (err) {
                    console.error('Error al realizar la consulta: ', err);
                    return;
                }
            });
        }
    }

    await connection.query(`SELECT p.PID_PROC, p.NOMBRE, p.USUARIO, p.ESTADO, p.RAM, GROUP_CONCAT(ph.PID,'|', ph.NOMBRE) as HIJOS
    FROM PROCESOS p
    LEFT JOIN PROCESOS_HIJOS ph ON p.PID_PROC = ph.PID_PROC
    GROUP BY p.PID_PROC`, function (error, results, fields) {
        if (error) throw error;

        const procesosConHijos = results.map((row) => {
            if (row.HIJOS) {
                row.HIJOS = row.HIJOS.split(',').map((item) => {
                    const [PID, NOMBRE] = item.split('|');
                    return { PID, NOMBRE };
                });
            } else {
                row.HIJOS = [];
            }
            return row;
        });

        response.send(procesosConHijos);

    });


});

app.post('/so1/buscarRam', async function (req, response) {
    const { data } = await axios.get("http://" + req.body.ip + ":8000/ram")


    let sqlQuery = "INSERT INTO HISTORIAL (TIPO, PORCENTAJE) VALUES ('R'," + data.PorcentajeUso +")";

    await connection.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta: ', err);
            return;
        }
    });

    sqlQuery = "SELECT * FROM HISTORIAL WHERE ID = (SELECT MAX(ID) FROM HISTORIAL)";

    await connection.query(sqlQuery, (err, [result]) => {
        if (err) {
            console.error('Error al realizar la consulta: ', err);
            return;
        }

        response.send(result)
    });
});

app.post('/so1/buscarCpu', async function (req, response) {
    const { data } = await axios.get("http://" + req.body.ip + ":8000/cpuUso")


    let sqlQuery = "INSERT INTO HISTORIAL (TIPO, PORCENTAJE) VALUES ('C'," + Number(data.cpu) +")";

    await connection.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta: ', err);
            return;
        }
    });

    sqlQuery = "SELECT * FROM HISTORIAL WHERE ID = (SELECT MAX(ID) FROM HISTORIAL)";

    await connection.query(sqlQuery, (err, [result]) => {
        if (err) {
            console.error('Error al realizar la consulta: ', err);
            return;
        }

        response.send(result)
    });
});

app.post('/so1/kill', async function (req, response) {
    const { data } = await axios.post(
        'http://'+req.body.ip+':8000/kill', {
        "Pid" : req.body.pid
    })


    response.send(data)
});

app.get('/so1/historial/cpu', async function (req, response) {
    sqlQuery = "SELECT * FROM HISTORIAL WHERE TIPO = 'C'";

    await connection.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta: ', err);
            return;
        }

        response.send(result)
    });
});

app.get('/so1/historial/ram', async function (req, response) {
    sqlQuery = "SELECT * FROM HISTORIAL WHERE TIPO = 'R'";

    await connection.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta: ', err);
            return;
        }

        response.send(result)
    });
});

app.listen(3000, () => console.log(`Server is listening on port 3000`));