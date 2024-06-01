// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/api/flavors', (req, res) => {
  db.all("SELECT * FROM flavors", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.get('/api/flavors/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM flavors WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(row);
  });
});

app.post('/api/flavors', (req, res) => {
  const { name, is_favorite } = req.body;
  db.run("INSERT INTO flavors (name, is_favorite) VALUES (?, ?)", [name, is_favorite], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    db.get("SELECT * FROM flavors WHERE id = ?", [this.lastID], (err, row) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.json(row);
    });
  });
});

app.delete('/api/flavors/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM flavors WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(204).send();
  });
});

app.put('/api/flavors/:id', (req, res) => {
  const id = req.params.id;
  const { name, is_favorite } = req.body;
  db.run("UPDATE flavors SET name = ?, is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [name, is_favorite, id], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    db.get("SELECT * FROM flavors WHERE id = ?", [id], (err, row) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.json(row);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
