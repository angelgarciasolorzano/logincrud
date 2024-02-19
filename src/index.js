import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars"
import { join, dirname } from "path";
import session from "express-session";
import flash from "connect-flash";
import MySQLStoreFactory from "express-mysql-session";
import passport from "passport";
import { fileURLToPath } from "url";
import { database } from "./keys.js";

import authenticationRoutes from "./routes/authentication.js";
import indexRoutes from "./routes/index.js";
import linksRoutes from "./routes/links.js";
import handlebars from "./lib/handlebars.js";
import './lib/passport.js'

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const MySQLStore = MySQLStoreFactory(session);

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutsDir: join(app.set('views'), 'layouts'),
  partialsDir: join(app.set('views'), 'partials'),
  extname: '.hbs',
  helpers: handlebars
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  store: new MySQLStore(database)
}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables globales
app.use((req, res, next) => {
  if (req.user && Array.isArray(req.user) && req.user.length > 0) {
    res.locals.success = req.flash('success');
    res.locals.message = req.flash('message');
    res.locals.user = req.user[0];
  } else {
    res.locals.user = null;
  }
  next();
});

//Routes: Caminos
app.use(indexRoutes);
app.use(authenticationRoutes);
app.use('/links', linksRoutes);

//Publico
app.use(express.static(join(__dirname, 'public')));

//Inicializando Servidor
app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});