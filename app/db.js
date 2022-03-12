const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    ssl: {
        rejectUnauthorized : false
    },
    define: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
    // logging: false,
});

module.exports = sequelize;