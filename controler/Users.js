import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id','googleId','facebookId','name','email','photo','role']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req,res) => {
    const { name, email, password, confPassword} = req.body;
    if(password !== confPassword)return res.status(400).json({msg: "Password dan confirm password tidak cocok"})
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({msg: "register berhasil"})
    } catch (error) {
        console.error(error)
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg:"salah password"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const photo = user[0].photo;
        const role = user[0].role;
        const accessToken = jwt.sign({userId, name, email, photo, role},process.env.ACCESS_TOKEN_SECRET, {
            expiresIn:'20s'
        });
        const refreshToken = jwt.sign({userId, name, email, photo, role},process.env.REFRESH_TOKEN_SECRET, {
            expiresIn:'1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id:userId
            }
         });
        res.cookie('refreshToken', refreshToken,{
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"email tidak ditemukan"})
    }
}
export const ChangeName = async(req,res) => {
    try {
        const newname = req.body.newname;
        const email = req.body.email;
            await Users.update({name:newname},{
                where:{
                    email: email
                }
            });
            res.json({msg: "change name berhasil"})
    } catch (error) {
        res.status(404).json({msg:"name not changed"})
    }
   
}

export const CreatePass = async(req, res) => {
    const {password, confPassword} = req.body;
    if(password !== confPassword)return res.status(400).json({msg: "Password dan confirm password tidak cocok"})
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const existpass = await Users.findAll({
        where:{
            email:req.body.email
        }
    });
    if(existpass[0].password != null)return res.status(400).json({msg: "email sudah punya password"})
    try {
        await Users.update({password:hashPassword},{
            where:{
                email: req.body.email
            }
         });
         res.json({msg: "register berhasil"})
    } catch (error) {
        res.status(404).json({msg:"email tidak ditemukan"})
    }
}


export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id;
        await Users.update({refresh_token: null},{
            where: {
                id: userId
            }
        });
        res.clearCookie('refreshToken','refreshToken',{
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.sendStatus(200);
} 

export const Delete = async(req,res) =>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.destroy({
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken','refreshToken',{
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    return res.sendStatus(200);
}