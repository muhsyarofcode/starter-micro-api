import { Sequelize } from "sequelize";

const db = new Sequelize('bsfbrh0ikechnlvntabc','ucjdmyeitlkko9sd','30tOMRbk7Lj4Uobnb6xH', {
    host: "bsfbrh0ikechnlvntabc-mysql.services.clever-cloud.com",
    dialect: "mysql"
})

export default db;