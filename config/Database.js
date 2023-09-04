import { Sequelize } from "sequelize";

const db = new Sequelize('if0_34823801_conncet_db','if0_34823801','hzhRlHgQjJ', {
    host: "185.27.134.112",
    dialect: "mysql"
})

export default db;