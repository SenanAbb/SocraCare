const connection = require('../config/db');
const bcrypt = require('bcrypt');

class HospitalController {
  newForm = (req, res) => {
    res.render('newHospital');
  };

  create = (req, res) => {
    const {
      name,
      email,
      password,
      repPassword,
      address,
      city,
      phone_number,
      description,
    } = req.body;

    // Validaciones
    // Contraseñas no coinciden
    if (password !== repPassword) {
      res.render('newHospital', {
        message: 'Las contraseñas no coinciden',
      });
      // Algun campo esta vacio
    } else if (
      !name ||
      !email ||
      !password ||
      !repPassword ||
      !address ||
      !city ||
      !phone_number
    ) {
      res.render('newHospital', {
        message: 'Las contraseñas no coinciden',
      });
    } else {
      bcrypt.hash(password, 10, (errHash, hash) => {
        if (errHash) {
          console.log(errHash);
        } else {
          let sql = `INSERT INTO hospital (name, email, password, address, city, phone_number, description) VALUES ('${name}', '${email}', '${hash}', '${address}', '${phone_number}', '${city}', '${description}')`;

          if (req.file != undefined) {
            const { filename } = req.file;
            console.log(filename);

            sql = `INSERT INTO hospital (name, email, password, address, city, phone_number, description, image) VALUES ('${name}', '${email}', '${hash}', '${address}', '${city}', '${phone_number}', '${description}', '${filename}')`;
          }

          connection.query(sql, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/');
            }
          });
        }
      });
    }
  };

  showOne = (req, res) => {
    const { id } = req.params;

    let hospitalSql = `SELECT * FROM active_hospitals WHERE id=${id}`;
    let doctorsSql = `SELECT * FROM active_doctors WHERE hospital_id=${id}`;

    connection.query(hospitalSql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        connection.query(doctorsSql, (err, result2) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result2);
            res.render('hospital', { hospital: result[0], doctors: result2 });
          }
        });
      }
    });
  };

  delete = (req, res) => {
    const { id } = req.params;

    let sql = `UPDATE hospital SET is_deleted=1 WHERE id=${id}`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  };
}

module.exports = new HospitalController();
