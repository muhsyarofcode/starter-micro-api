import express from "express";
import dotenv from 'dotenv'
import db from "./config/Database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from 'express-session'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth2'
import FacebookStrategy from "passport-facebook"
import { getUsers,  Register, Login, Logout, CreatePass, ChangeName, Delete} from "./controler/Users.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { refreshToken } from "./controler/RefreshToken.js";
import Users from "./models/UserModel.js";
import { receiveMessage, sendMessage } from "./controler/ChatMessage.js";

dotenv.config();
const app = express()
const router = express.Router();

try {
    await db.authenticate();
    console.log('database connected');
} catch (error) {
    console.error(error)
}   

app.use(cors({origin:"https://muhsyarof.my.id", credentials:true, whithCredentials:true}));

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
      name: profile.displayName,
      photo: profile.picture,
      role:"user"
    }
  });
  return done(null, profile);
}
));

passport.use('facebook',new FacebookStrategy.Strategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'https://ultramarine-hen-kilt.cyclic.app/oauth2/redirect/facebook',
  profileFields: [ 'email' , 'name', 'id', 'picture' ]
},
async function(req, accessToken, profile, done) {
  const name = (profile._json.first_name)+(profile._json.last_name)
  await Users.findOrCreate({
    where:{
      email: profile.emails[0].value
    },
    defaults:{
      facebookId: profile.id,
      name: name,
      photo: profile.photos[0].value,
      role:"user"
    }
  });
  return done(null, profile);
}
  ));

  
passport.serializeUser((user, done) => {
  return done(null, (user));
});

passport.deserializeUser((user, done) => {
  return done(null,  (user));
});


app.use(cookieParser());
app.use(express.json());
app.use(router);

router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.post('/createpassword', CreatePass);
router.get('/loginGoogle', passport.authenticate('google', {scope: ["profile", "email"]}));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect:"https://muhsyarof.my.id/Connectcrtpass",
  failureRedirect:"https://muhsyarof.my.id/connect"
}));
router.get('/loginFacebook', passport.authenticate('facebook',{scope: "email"}));
router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successReturnToOrRedirect:"https://muhsyarof.my.id/Connectcrtpass",
  failureRedirect:"https://muhsyarof.my.id/connect"
}));
router.post('/changename', ChangeName);
router.get('/token', refreshToken);
router.delete('/out', Logout);
router.delete('/delete', Delete);

router.post('/sendmessage', sendMessage)
router.get('/receivemessage', receiveMessage)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`api listening on ${port}`)
})
