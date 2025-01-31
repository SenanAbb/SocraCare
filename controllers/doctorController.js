class doctorController {
  newForm = (req, res) => {
    res.render('newDoctorForm');
  };
}

module.exports = new doctorController();
