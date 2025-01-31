const connection = require('../config/db');

class doctorController {
  newForm = (req, res) => {
    const { hospital_id } = req.params;
    let sql = 'SELECT * FROM speciality';

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render('newDoctor', { specialities: result, hospital_id });
      }
    });
  };

  create = (req, res) => {
    const { hospital_id } = req.params;
    const { name, lastname, degree, speciality, description } = req.body;

    if (!name || !lastname || !degree || !speciality) {
      connection.query('SELECT * FROM speciality', (err, result) => {
        if (err) {
          throw err;
        } else {
          res.render('newDoctor', {
            hospital_id,
            specialities: result,
            message: 'Todos los campos son obligatorios',
          });
        }
      });
    } else {
      let sql = `INSERT INTO doctor (name, last_name, degree, speciality_id, hospital_id, description) VALUES ('${name}', '${lastname}', '${degree}', '${speciality}', '${hospital_id}', '${description}')`;

      if (req.file != undefined) {
        const { filename } = req.file;

        sql = `INSERT INTO doctor (name, last_name, degree, speciality_id, hospital_id, description, image) VALUES ('${name}', '${lastname}', '${degree}', '${speciality}', '${hospital_id}', '${description}', '${filename}')`;
      }

      connection.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          res.redirect(`/hospital/show/${hospital_id}`);
        }
      });
    }
  };

  editForm = (req, res) => {
    const { id } = req.params;
    const { h } = req.query;

    let sql = `SELECT * FROM doctor WHERE doctor_id=${id}`;
    let sql2 = `SELECT * FROM speciality`;

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        connection.query(sql2, (err, result2) => {
          if (err) {
            throw err;
          } else {
            res.render('editDoctor', {
              doctor: result[0],
              specialities: result2,
              hospital_id: h,
            });
          }
        });
      }
    });
  };

  edit = (req, res) => {
    const { id } = req.params;
    const { name, lastname, degree, speciality, description } = req.body;
    const hospital_id = req.query.h;

    console.log(req.body);

    if (!name || !lastname || !degree || !speciality) {
      connection.query('SELECT * FROM speciality', (err, result) => {
        if (err) {
          throw err;
        } else {
          res.render('editDoctor', {
            message: 'Todos los campos son obligatorios',
            specialities: result,
            doctor: {
              doctor_id: id,
              name,
              last_name: lastname,
              degree,
              speciality,
              description,
            },
            hospital_id,
          });
        }
      });
    } else {
      let sql = `UPDATE doctor SET name = '${name}', last_name = '${lastname}', degree = '${degree}', speciality_id = '${speciality}', description = '${description}' WHERE doctor_id = ${id}`;

      connection.query(sql, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.redirect(`/hospital/show/${hospital_id}`);
        }
      });
    }
  };

  delete = (req, res) => {
    const { id } = req.params;
    const hospital_id = req.query.h;

    let sql = `UPDATE doctor SET is_deleted = 1 WHERE doctor_id=${id}`;

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect(`/hospital/show/${hospital_id}`);
      }
    });
  };
}

module.exports = new doctorController();
