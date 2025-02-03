const connection = require('../config/db');
const bcrypt = require('bcrypt');

class HospitalController {
  newForm = (req, res) => {
    const isLoggedIn = req.session.hospital ? true : false;

    res.render('newHospital', { isLoggedIn });
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

    const isLoggedIn = req.session.hospital ? true : false;

    // Validaciones
    // Contraseñas no coinciden
    if (password !== repPassword) {
      res.render('newHospital', {
        message: 'Las contraseñas no coinciden',
        isLoggedIn,
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
        message: 'Algún campo está vacío',
        isLoggedIn,
      });
    } else {
      bcrypt.hash(password, 10, (errHash, hash) => {
        if (errHash) {
          console.log(errHash);
          throw errHash;
        } else {
          let sql = `INSERT INTO hospital (name, email, password, address, city, phone_number, description) VALUES ('${name}', '${email}', '${hash}', '${address}', '${city}', '${phone_number}', '${description}')`;

          if (req.file != undefined) {
            const { filename } = req.file;

            sql = `INSERT INTO hospital (name, email, password, address, city, phone_number, description, image) VALUES ('${name}', '${email}', '${hash}', '${address}', '${city}', '${phone_number}', '${description}', '${filename}')`;
          }

          connection.query(sql, (err, result) => {
            if (err) {
              if (err.errno == 1062) {
                res.render('newHospital', {
                  message: 'El email ya existe en el sistema',
                  isLoggedIn,
                });
              } else {
                throw err;
              }
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

    let hospitalSql = `SELECT * FROM active_hospitals WHERE hospital_id=${id}`;
    let doctorsSql = `SELECT * FROM active_doctors WHERE hospital_id=${id}`;

    connection.query(hospitalSql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        connection.query(doctorsSql, (err, result2) => {
          if (err) {
            console.log(err);
          } else {
            const isLoggedIn = req.session.hospital ? true : false;
            res.render('hospital', {
              hospital: result[0],
              doctors: result2,
              isLoggedIn,
            });
          }
        });
      }
    });
  };

  editForm = (req, res) => {
    const { id } = req.params;

    let sql = `SELECT * FROM hospital WHERE hospital_id=${id}`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const isLoggedIn = req.session.hospital ? true : false;
        res.render('editHospital', { hospital: result[0], isLoggedIn });
      }
    });
  };

  edit = (req, res) => {
    const { id } = req.params;
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

    const isLoggedIn = req.session.hospital ? true : false;

    // Obtener los datos actuales del hospital para mostrarlos en la vista en caso de error
    const hospitalQuery = `SELECT * FROM hospital WHERE hospital_id=${id}`;
    connection.query(hospitalQuery, (err, results) => {
      if (err) {
        console.log(err);
        res.redirect('/hospital'); // Redirigir a la lista si hay un error al obtener los datos
      } else {
        const hospital = results[0]; // Obtenemos el hospital actual

        let message = null;

        if (password && repPassword && password !== repPassword) {
          message = 'Las contraseñas no coinciden';
        } else if (!name || !email || !address || !city || !phone_number) {
          message = 'Algún campo está vacío';
        }

        if (message) {
          res.render('editHospital', { message, hospital, isLoggedIn });
        } else {
          // Construcción de la consulta SQL
          let sql = `UPDATE hospital SET name='${name}', email='${email}', address='${address}', city='${city}', phone_number='${phone_number}', description='${description}'`;

          if (req.file) {
            sql += `, image='${req.file.filename}'`;
          }

          if (password) {
            bcrypt.hash(password, 10, (errHash, hash) => {
              if (!errHash) {
                sql += `, password='${hash}'`;
                sql += ` WHERE hospital_id=${id}`;

                connection.query(sql, (err) => {
                  if (!err) {
                    res.redirect(`/hospital/show/${id}`, { isLoggedIn });
                  } else {
                    console.log(err);
                    throw err;
                  }
                });
              } else {
                res.render('editHospital', {
                  message: 'Error al procesar la contraseña',
                  hospital,
                });
              }
            });
          } else {
            sql += ` WHERE hospital_id=${id}`;

            connection.query(sql, (err) => {
              if (!err) {
                res.redirect(`/hospital/show/${id}`, { isLoggedIn });
              } else {
                console.log(err);
              }
            });
          }
        }
      }
    });
  };

  delete = (req, res) => {
    const { id } = req.params;

    let sqlHospital = `UPDATE hospital SET is_deleted=1 WHERE hospital_id=${id}`;

    connection.query(sqlHospital, (err) => {
      if (err) {
        console.log(err);
      } else {
        let sqlDoctors = `UPDATE doctor SET is_deleted=1 WHERE hospital_id=${id}`;

        connection.query(sqlDoctors, (err) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/');
          }
        });
      }
    });
  };

  search = (req, res) => {
    const { name, city, address, phone_number } = req.query;

    let sql = `SELECT * FROM active_hospitals`;
    let conditions = [];

    if (name) {
      conditions.push(`name LIKE '%${name}%'`);
    }
    if (city) {
      conditions.push(`city LIKE '%${city}%'`);
    }
    if (address) {
      conditions.push(`address LIKE '%${address}%'`);
    }
    if (phone_number) {
      conditions.push(`phone_number LIKE '%${phone_number}%'`);
    }

    // Agregar la cláusula WHERE solo si hay condiciones
    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        const isLoggedIn = req.session.hospital ? true : false;
        res.render('hospitalSearch', { hospitals: result, isLoggedIn });
      }
    });
  };
}

module.exports = new HospitalController();
