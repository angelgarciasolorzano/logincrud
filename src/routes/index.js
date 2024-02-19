import express from "express";
import { isNotLoggedIn } from "../lib/auth.js"

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('index');
  req.flash('success', 'hola mundo');
});

export default router;