<<<<<<< HEAD
﻿const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.get("/", (req, res) => res.send("Servidor rodando"));

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

const ofertaRoutes = require("./src/modules/ofertas/oferta.routes");
app.use("/ofertas", ofertaRoutes);

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
=======
const express = require("express");
const cors = require("cors");

const userRoutes = require("./src/routes/users");
const ofertaRoutes = require("./src/routes/oferta.routes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Vite
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/users", userRoutes);
app.use("/ofertas", ofertaRoutes);

app.get("/", (req, res) => res.send("API Banco de Trocas Rodando 🚀"));

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
>>>>>>> main
});
