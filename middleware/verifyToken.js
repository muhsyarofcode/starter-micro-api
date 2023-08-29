import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const autHeader = req.headers['authorization'];
    const token = autHeader && autHeader.split(' ')[1];
    if(token == null)return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
        if(err) return res.sendStatus(401);
    req.email = decoded.email;
    next();
    })
}