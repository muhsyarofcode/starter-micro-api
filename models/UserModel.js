import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes} = Sequelize;

const Users = db.define('users', {
    googleId: {
        type: DataTypes.STRING
    },
    facebookId: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
    activity: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
},{
    freezeTableName: true
})

export default Users;