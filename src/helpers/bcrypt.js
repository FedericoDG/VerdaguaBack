const bcryptjs = require('bcryptjs');

module.exports = {
    hash: async (password) => {
        const salt = await bcryptjs.genSalt(10)
        return await bcryptjs.hash(password, salt)
    },
    compare: async (password, storedPassword) => {
        return await bcryptjs.compare(password, storedPassword);
    }
};
