const connection = require('../config/db');
const getRandomItems = require('../utils/getRandomItems');

class IndexController {
  openIndex = (req, res) => {
    let hospitalsSql = 'SELECT * FROM active_hospitals';
    let doctorsSql = 'SELECT * FROM active_doctors';

    connection.query(hospitalsSql, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        connection.query(doctorsSql, (err, result2) => {
          if (err) {
            console.log(err);
            throw err;
          } else {
            result2 = getRandomItems(result2, 3);
            res.render('index', { hospitals: result, doctors: result2 });
          }
        });
      }
    });
  };
}

module.exports = new IndexController();
