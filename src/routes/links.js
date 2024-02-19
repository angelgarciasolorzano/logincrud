import express from "express";
import pool from "../database.js";
import { isLoggedIn } from "../lib/auth.js"

const router = express.Router();

router.get('/add', isLoggedIn, (req, res) => {
  res.render('links/add');
});

router.post('/add', isLoggedIn, async(req, res) => {
  console.log(req.body);
  const { title, url, description } = req.body;
  console.log(req.user[0]);
  const newLink = { title, url, description, user_id: req.user[0].id };

  await pool.query('INSERT INTO links SET ?', [newLink]);
  req.flash('sucess', 'link guardado');
  res.redirect('/links');
});

router.get('/', isLoggedIn, async(req, res) => {
  const[links] = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user[0].id]);
  res.render('links/list', { links: links });
});

router.get('/delete/:id', isLoggedIn, async(req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM links WHERE id = ?', [id]);
  req.flash('sucess', 'link eliminado');
  res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async(req, res) => {
  const { id } = req.params;
  const[link] = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
  const linkEdit = link[0];
  res.render('links/edit', { link: linkEdit });
});

router.post('/edit/:id', isLoggedIn, async(req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = { title, description, url };
  await pool.query('UPDATE links SET ? WHERE id =?', [newLink, id]);
  req.flash('sucess', 'link editado');
  res.redirect('/links');
});

export default router;