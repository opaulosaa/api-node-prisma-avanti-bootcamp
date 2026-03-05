const express = require("express");
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
});
