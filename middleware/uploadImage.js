const multer = require('multer');

//función de configuración de donde u como se guardará la copia del archivo

let upload = (folder) =>{
    //configurar el storage (como y donde guardamos la foto)
    const storage = multer.diskStorage({
        destination: `public/images/${folder}`,
        filename: function (req, file, cb){
            
            let originalName = file.originalname;
            const finalName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-" + originalName;
            cb(null, finalName)
        }
    });

    const executeUpload = multer({storage: storage}).single("img");
    return executeUpload;
};

//genera req.body={los textos}
//genera req.file={los datos del file}

module.exports = upload;