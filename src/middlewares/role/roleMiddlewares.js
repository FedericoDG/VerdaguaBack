const { Rol } = require('../../database/models');

module.exports = {
    roleExist: async (req, res, next) => {
        const { id } = req.params;
        const role = await Rol.findOne({ where: { id } });
        if (!role) {
            res.status(404).json({
                msg: "Rol no existente o invalido",
                status: "not found"
            })
        } else {
            next();
        }
    }
}