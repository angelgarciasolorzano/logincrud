import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import helpers from "../lib/helpers.js";
import pool from "../database.js";

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

  if(rows.length > 0) {
    const user = rows[0][0];
    console.log(user);
    const validPassword = await helpers.matchPassword(password, user.password);

    if(validPassword) {
      done(null, user, req.flash('success', 'Bienvenido' + user.username));
      console.log(req.flash('success'));
    } else {
      done(null, false, req.flash('message', 'Contraseña Incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'Usuario no encontrado'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const { fullname } = req.body;
  const newUser = { username, password, fullname };

  newUser.password = await helpers.encryptPassword(password);
  const result = await pool.query('INSERT INTO users SET ?', [newUser]);
  newUser.id = result[0].insertId;
  console.log(newUser);

  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const result = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, result[0]);
});