const connection = require('../config/db');
const getRandomItems = require('../utils/getRandomItems');
const bcrypt = require('bcrypt');

class IndexController {
  openIndex = (req, res) => {
    let hospitalsSql = 'SELECT * FROM active_hospitals';
    let doctorsSql = 'SELECT * FROM active_doctors';
    let specialitiesSql = 'SELECT * FROM speciality';

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
            connection.query(specialitiesSql, (err, result3) => {
              if (err) {
                console.log(err);
                throw err;
              } else {
                result = getRandomItems(result, 3);
                result2 = getRandomItems(result2, 3);
                const isLoggedIn = req.session.hospital ? true : false;
                const hospitalId = req.session.hospital
                  ? req.session.hospital.id
                  : null;
                console.log(req.session);
                res.render('index', {
                  hospitals: result,
                  doctors: result2,
                  specialities: result3,
                  isLoggedIn,
                  hospitalId,
                });
              }
            });
          }
        });
      }
    });
  };

  openLogin = (req, res) => {
    const isLoggedIn = req.session.hospital ? true : false;
    const hospitalId = req.session.hospital ? req.session.hospital.id : null;
    res.render('login', { isLoggedIn, hospitalId });
  };

  login = (req, res) => {
    const { email, password } = req.body;
    const isLoggedIn = req.session.hospital ? true : false;

    if (!email || !password) {
      res.render('login', { message: 'Todos los campos son obligatorios' });
    } else {
      connection.query(
        `SELECT * FROM hospital WHERE email = '${email}'`,
        (err, result) => {
          if (err) {
            console.log(err);
            throw err;
          } else {
            console.log(result);
            if (result.length > 0 && result[0].is_deleted === 0) {
              const validPassword = bcrypt.compareSync(
                password,
                result[0].password
              );
              if (validPassword) {
                req.session.hospital = {
                  id: result[0].hospital_id,
                };

                req.session.save(() => {
                  res.redirect('/');
                });
              } else {
                res.render('login', {
                  message: 'Credenciales incorrectas',
                  isLoggedIn,
                });
              }
            } else {
              res.render('login', {
                message: 'Credenciales incorrectas',
                isLoggedIn,
              });
            }
          }
        }
      );
    }
  };

  logout = (req, res) => {
    // 1. Destruir la sesión primero
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir la sesión:', err);
        return res.redirect('/'); // Redirige a la página de inicio si hay error
      }

      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: false, // Cambia a true si usas HTTPS
        sameSite: 'lax',
      });

      res.redirect('/');
    });
  };
}

module.exports = new IndexController();
