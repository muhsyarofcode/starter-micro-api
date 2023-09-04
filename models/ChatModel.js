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
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
})

export default Chat;
