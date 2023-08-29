import express from "express";
import dotenv from 'dotenv'
import db from "./config/Database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from 'express-session'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth2'
import { getUsers,  Register, Login, Logout} from "./controler/Users.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { refreshToken } from "./controler/RefreshToken.js";
import Users from "./models/UserModel.js";
import jwt from "jsonwebtoken";
dotenv.config();
const app = express()
const router = express.Router();

try {
    await db.authenticate();
    console.log('database connected');
} catch (error) {
    console.error(error)
}   

app.use(cors({origin:"http://localhost:3000", credentials:true, whithCredentials:true}));

app.use(passport.initialize())

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure:false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.authenticate('session'));

passport.use('google', new GoogleStrategy.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://ultramarine-hen-kilt.cyclic.app/oauth2/redirect/google',
  scope: ['profile']
},
async function(req, accessToken, profile, done) {
  await Users.findOrCreate({
    where:{
      email: profile.email
    },
    defaults:{
      googleId: profile.id,
      name: profile.displayName
    }
  });
  const user = await Users.findAll({
    where:{
      googleId: profile.id
    }
  })
  const userId = user[0].id;
  const name = user[0].name;
  const email = user[0].email;
  const token = jwt.sign({userId, name, email},process.env.ACCESS_TOKEN_SECRET, {
    expiresIn:'5s'
  });
  const tokenRefresh = jwt.sign({userId, name, email},process.env.REFRESH_TOKEN_SECRET, {
    expiresIn:'1d'
  });
  var userData = {
    accessToken: token,
    refreshToken: tokenRefresh,
    profile: profile
  }
  return done(null, userData)
  }
));

passport.serializeUser((user, done) => {
  return done(null, (user));
});

passport.deserializeUser((user, done) => {
  return done(null, (user));
});


app.use(cookieParser());
app.use(express.json());
app.use(router);

router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/loginGoogle', passport.authenticate('google', {scope: ["profile", "email"]}));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect:'/setcookie',
  failureRedirect:'/'
}));
router.get('/setcookie', function(req,res){
  res.json(req.session)
  res.redirect('http://localhost:3000/connect/setcookie')
});
router.get('/token', refreshToken);
router.delete('/out', Logout);


const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`api listening on ${port}`)
})
