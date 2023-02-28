const { check } = require('express-validator');
const path = require('path');

const validates = {
  //Login validations
  validatesLoginForm: [
    check('email').notEmpty().withMessage('Este campo es requerido').bail().isEmail().withMessage('email invalido'),
    check('password').notEmpty().withMessage('Este campo es requerido')
  ],
  //Signin validations
  validatesCreateForm: [
    check('nombre').notEmpty().withMessage('Este campo es requerido'),
    check('apellido').notEmpty().withMessage('Este campo es requerido'),
    check('email').notEmpty().withMessage('Este campo es requerido').bail().isEmail().withMessage('email invalido'),
    check('password').notEmpty().withMessage('Este campo es requerido')
    /* check("confirmPassword").notEmpty().withMessage("Este campo es requerido").bail().custom((
            confirmPassword, { req }) => {
            if (confirmPassword != req.body.password) {
                throw new Error("Passwords doesn't match")
            } else {
                return true;
            }
        }), */
    //TODO: FOR IMPLEMENT EVENTLY
    /*
        check("url_img").custom((el, { req }) => {
            const ext = [".jpg", ".png", "jpeg", ".webp"];
            const extFile = path.extname(req.file.originalname);
            return (ext.includes(extFile));
        }).withMessage('This field requires the following extensions .jpg, .png, .jpeg, .webp')
        */
  ],
  //Edit validations
  //For common data
  validatesEditForm: [
    check('nombre').notEmpty().withMessage('Este campo es requerido'),
    check('apellido').notEmpty().withMessage('Este campo es requerido'),
    check('email').notEmpty().withMessage('Este campo es requerido').bail().isEmail().withMessage('email invalido'),
    check('password').notEmpty().withMessage('Este campo es requerido'),
    check('id_rol').notEmpty().withMessage('Este campo es requerido')
  ],
  //For image avatar
  validatesChangeImg: [
    check('url_img')
      .custom((el, { req }) => {
        const ext = ['.jpg', '.png', 'jpeg', '.webp'];
        const extFile = path.extname(req.file.originalname);
        return ext.includes(extFile);
      })
      .withMessage('Este campo acepta las siguientes extensiones .jpg, .png, .jpeg, .webp')
  ],
  //For password
  validatesChangePass: [check('password').notEmpty().withMessage('Este campo es requerido')]
};

module.exports = validates;
