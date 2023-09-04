import { Sequelize } from "sequelize";

const db = new Sequelize('if0_34823801_conncet_db','if0_34823801','hzhRlHgQjJ', {
    host: "sql306.infinityfree.com",
    dialect: "mysql"
})

export default db;