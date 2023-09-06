import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes} = Sequelize;

const Chat = db.define('publicchat', {
    email: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    message: {
        type: DataTypes.TEXT
    },
    photo: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.TEXT
    }
},{
    freezeTableName: true
})

export default Chat;
