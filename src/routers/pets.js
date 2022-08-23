const db = require("../../db");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const sqlQuery = "SELECT * FROM pets;";
  const qResult = await db.query(sqlQuery);

  res.status(200).json({ pets: qResult.rows });
});

router.post("/", async (req, res) => {
  const newPet = req.body;
  const params = [
    newPet.name,
    newPet.age,
    newPet.type,
    newPet.breed,
    newPet.microchip,
  ];

  const sqlQuery =
    "INSERT INTO pets (name, age, type, breed, microchip) VALUES($1, $2, $3, $4, $5) RETURNING *;";
  const qResult = await db.query(sqlQuery, params);
  //   console.log(qResult.rows);

  res.status(201).json({ pet: { id: qResult.rows[0].id, ...newPet } });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const params = [id];

  const sqlQuery = "SELECT * FROM pets WHERE id = $1;";
  const qResult = await db.query(sqlQuery, params);

  res.status(200).json({ pet: { ...qResult.rows[0] } });
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const newInfo = { id: id, ...req.body };
  const params = [
    id,
    newInfo.name,
    newInfo.age,
    newInfo.type,
    newInfo.breed,
    newInfo.microchip,
  ];

  const sqlQuery =
    'UPDATE pets SET "name" = $2, age = $3, "type" = $4, breed = $5, microchip = $6 WHERE id = $1;';
  //   console.log(sqlQuery);
  await db.query(sqlQuery, params);

  res.status(201).json({ pet: newInfo });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const params = [id];

  const sqlQuery = "DELETE FROM pets WHERE id = $1 RETURNING *;";
  const qResult = await db.query(sqlQuery, params);

  res.status(201).json({ pet: { ...qResult.rows[0] } });
});

module.exports = router;
