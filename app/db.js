const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    // dialectOptions: {
    //     ssl: {
    //       require: true,
    //       rejectUnauthorized: false
    //     }
    // },
    define: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
    // logging: false,
});

module.exports = sequelize;