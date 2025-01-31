const mysql2 = require('mysql2');
const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'SocraCare',
});

connection.connect((err) => {
  if (err) {
    console.log('Error al conectar', err);
    return;
  }
  console.log('DB connected' + connection.threadId);
});

module.exports = connection;
