const express = require("express");
const db = require("./db");
const app = express();
const port = 3200;
const { Pool } = require("pg");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-----------------------
//Get data tabel students
app.get("/students", async (req, res) => {
  try {
    const allStudents = await prisma.students.findMany();
    res.status(200).json({
      status: "get success",
      data: allStudents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//------------------------
//Post data tabel students
app.post("/students", async (req, res) => {
  try {
    const { name, address } = req.body;

    await prisma.students.create({
      data: {
        name: name,
        address: address,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Data berhasil di post",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//-------------------------------
//Get ID data dari tabel students
app.get("/students/:id", async (req, res) => {
  const studentsId = req.params.id;

  try {
    const student = await prisma.students.findUnique({
      where: {
        id: parseInt(studentsId),
      },
    });

    if (!student) {
      res.status(404).json({
        status: "error",
        message: "Data students tidak ditemukan",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: student,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//--------------------------------
//Update ID data ke tabel students
app.put("/students/:id", async (req, res) => {
  const studentsId = req.params.id;
  const { name, address } = req.body;

  try {
    await prisma.students.update({
      where: {
        id: parseInt(studentsId),
      },
      data: {
        name: name,
        address: address,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Data berhasil di update",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//-----------------------------------
//Delete ID Data dari tabel students
app.delete("/students/:id", async (req, res) => {
  const studentsId = req.params.id;
  try {
    await prisma.students.deleteMany({
      where: {
        id: parseInt(studentsId),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Data berhasil di delete",
    });
  } catch (error) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));