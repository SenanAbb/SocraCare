const connection = require('../config/db');

class doctorController {
  newForm = (req, res) => {
    const { hospital_id } = req.params;
    let sql = 'SELECT * FROM speciality';

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        const isLoggedIn = req.session.hospital ? true : false;
        const hospitalId = req.session.hospital
          ? req.session.hospital.id
          : null;

        res.render('newDoctor', {
          specialities: result,
          hospital_id,
          isLoggedIn,
          hospitalId,
        });
      }
    });
  };

  create = (req, res) => {
    const { hospital_id } = req.params;
    const { name, lastname, degree, speciality, description } = req.body;
    const isLoggedIn = req.session.hospital ? true : false;
    const hospitalId = req.session.hospital ? req.session.hospital.id : null;

    if (!name || !lastname || !degree || !speciality) {
      connection.query('SELECT * FROM speciality', (err, result) => {
        if (err) {
          throw err;
        } else {
          res.render('newDoctor', {
            hospital_id,
            specialities: result,
            message: 'Todos los campos son obligatorios',
            isLoggedIn,
            hospitalId,
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
            const isLoggedIn = req.session.hospital ? true : false;
            const hospitalId = req.session.hospital
              ? req.session.hospital.id
              : null;
            res.render('editDoctor', {
              doctor: result[0],
              specialities: result2,
              hospital_id: h,
              isLoggedIn,
              hospitalId,
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
    console.log(hospital_id);
    const isLoggedIn = req.session.hospital ? true : false;
    const hospitalId = req.session.hospital ? req.session.hospital.id : null;

    if (!name || !lastname || !degree || !speciality) {
      console.log(req.body);
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
            isLoggedIn,
            hospitalId,
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

  search = (req, res) => {
    const { name, lastname, degree, speciality } = req.query;

    console.log(speciality);

    let sql = `SELECT * FROM active_doctors`;
    let specialitiesSql = 'SELECT * FROM speciality';

    let conditions = [];

    if (name) {
      conditions.push(`doctor.name LIKE '%${name}%'`);
    }
    if (lastname) {
      conditions.push(`doctor.last_name LIKE '%${lastname}%'`);
    }
    if (degree) {
      conditions.push(`doctor.degree LIKE '%${degree}%'`);
    }
    if (speciality) {
      conditions.push(`speciality.name LIKE '%${speciality}%'`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    connection.query(specialitiesSql, (err, result) => {
      if (err) {
        throw err;
      } else {
        connection.query(sql, (err, result2) => {
          if (err) {
            throw err;
          } else {
            const isLoggedIn = req.session.hospital ? true : false;
            const hospitalId = req.session.hospital
              ? req.session.hospital.id
              : null;
            res.render('doctorSearch', {
              doctors: result2,
              specialities: result,
              isLoggedIn,
              hospitalId,
            });
          }
        });
      }
    });
  };
}

module.exports = new doctorController();
