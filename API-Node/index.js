const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const axios = require('axios');
const cors = require('cors')
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ktalan30',
    database: process.env.DB_NAME || 'so1p1'
});

app.get('/', function (req, response) {
    response.send("SALUDO DESDE REQUEST");

});

app.post('/so1/buscarProcesos', async function (req, response) {

    try {
        const { data } = await axios.get("http://" + req.body.ip + ":8000/cpu");

        // Eliminar registros de PROCESOS_HIJOS y PROCESOS
        await (await connection).query('DELETE FROM PROCESOS_HIJOS');
        await (await connection).query('DELETE FROM PROCESOS');

        for (let i = 0; i < data.length; i++) {
            const proceso = data[i];

            // Insertar en la tabla PROCESOS
            const insertProcesoQuery = "INSERT INTO PROCESOS (PID_PROC, NOMBRE, USUARIO, ESTADO, RAM) VALUES (?, ?, ?, ?, ?)";
            await (await connection).query(insertProcesoQuery, [proceso.pid, proceso.nombre, proceso.user, proceso.estado, proceso.ram]);

            for (let j = 0; j < proceso.hijos.length; j++) {
                const hijo = proceso.hijos[j];

                // Insertar en la tabla PROCESOS_HIJOS
                const insertHijoQuery = "INSERT INTO PROCESOS_HIJOS (PID, NOMBRE, PID_PROC) VALUES (?, ?, ?)";
                await (await connection).query(insertHijoQuery, [hijo.pid, hijo.nombre, proceso.pid]);
            }
        }

        // Consulta para obtener procesos con hijos
        const selectQuery = `
            SELECT p.PID_PROC, p.NOMBRE, p.USUARIO, p.ESTADO, p.RAM, GROUP_CONCAT(ph.PID, '|', ph.NOMBRE) as HIJOS
            FROM PROCESOS p
            LEFT JOIN PROCESOS_HIJOS ph ON p.PID_PROC = ph.PID_PROC
            GROUP BY p.PID_PROC
        `;

        const [results] = await (await connection).query(selectQuery);

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
    } catch (error) {
        console.error('Error al realizar la consulta: ', error);
        response.status(500).send('Error en el servidor');
    }
});

app.post('/so1/buscarRam', async function (req, response) {
    const { data } = await axios.get("http://" + req.body.ip + ":8000/ram")


    let sqlQuery = "INSERT INTO HISTORIAL (TIPO, PORCENTAJE) VALUES ('R'," + data.PorcentajeUso + ")";

    try {

        await (await connection).execute(sqlQuery);

    } catch (err) {
        console.error('Error al realizar la consulta: ', err);
        response.status(500).send('Error en el servidor');
    }

    sqlQuery = "SELECT * FROM HISTORIAL WHERE ID = (SELECT MAX(ID) FROM HISTORIAL)";

    try {

        const [rows] = await (await connection).execute(sqlQuery);
    
        response.send(rows)
    } catch (err) {
        console.error('Error al realizar la consulta: ', err);
        response.status(500).send('Error en el servidor');
    }
});

app.post('/so1/buscarCpu', async function (req, response) {
    const { data } = await axios.get("http://" + req.body.ip + ":8000/cpuUso")


    let sqlQuery = "INSERT INTO HISTORIAL (TIPO, PORCENTAJE) VALUES ('C'," + Number(data.cpu) + ")";

    try {

        await (await connection).execute(sqlQuery);

    } catch (err) {
        console.error('Error al realizar la consulta: ', err);
        response.status(500).send('Error en el servidor');
    }

    sqlQuery = "SELECT * FROM HISTORIAL WHERE ID = (SELECT MAX(ID) FROM HISTORIAL)";

    try {

        const [rows] = await (await connection).execute(sqlQuery);
    
        response.send(rows)
    } catch (err) {
        console.error('Error al realizar la consulta: ', err);
        response.status(500).send('Error en el servidor');
    }
});

app.post('/so1/kill', async function (req, response) {
    const { data } = await axios.post(
        'http://' + req.body.ip + ':8000/kill', {
        "Pid": req.body.pid
    })


    response.send(data)
});

app.get('/so1/historial/cpu', async function (req, response) {
    sqlQuery = "SELECT * FROM HISTORIAL WHERE TIPO = 'C'";

    try {

        const [rows] = await (await connection).execute(sqlQuery);
    
        response.send(rows)
    } catch (err) {
        console.error('Error al realizar la consulta: ', err);
        response.status(500).send('Error en el servidor');
    }
});

app.get('/so1/historial/ram', async function (req, response) {
    sqlQuery = "SELECT * FROM HISTORIAL WHERE TIPO = 'R'";

    try {

        const [rows] = await (await connection).execute(sqlQuery);
    
        response.send(rows)
    } catch (err) {
        console.error('Error al realizar la consulta: ', err);
        response.status(500).send('Error en el servidor');
    }
});

app.listen(3000, () => console.log(`Server is listening on port 3000`));