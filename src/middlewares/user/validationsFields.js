const { check } = require('express-validator');
const path = require('path');

const validates = {
  validatesLoginForm: [
    check('email').notEmpty().withMessage('Este campo es requerido').bail().isEmail().withMessage('email invalido'),
    check('password').notEmpty().withMessage('Este campo es requerido')
  ],
  validatesCreateForm: [
    check('nombre').notEmpty().withMessage('Este campo es requerido'),
    check('apellido').notEmpty().withMessage('Este campo es requerido'),
    check('email').notEmpty().withMessage('Este campo es requerido').bail().isEmail().withMessage('email invalido'),
    check('password').notEmpty().withMessage('Este campo es requerido')
  ],

  validatesEditForm: [
    check('nombre').notEmpty().withMessage('Este campo es requerido'),
    check('apellido').notEmpty().withMessage('Este campo es requerido'),
    check('email').notEmpty().withMessage('Este campo es requerido').bail().isEmail().withMessage('email invalido'),
    check('password').notEmpty().withMessage('Este campo es requerido'),
    check('id_rol').notEmpty().withMessage('Este campo es requerido')
  ],
  validatesChangeImg: [
    check('url_img')
      .custom((el, { req }) => {
        const ext = ['.jpg', '.png', 'jpeg', '.webp'];
        const extFile = path.extname(req.file.originalname);
        return ext.includes(extFile);
      })
      .withMessage('Este campo acepta las siguientes extensiones .jpg, .png, .jpeg, .webp')
  ],
  validatesChangePass: [check('password').notEmpty().withMessage('Este campo es requerido')]
};

module.exports = validates;
