const express = require("express");
const userRoutes = require("./src/routes/users");
const ofertaRoutes = require("./src/routes/oferta.routes");

const app = express();
const PORT = 3000;

app.use(express.json());

// Rotas
app.use('/users', userRoutes);
app.use("/ofertas", ofertaRoutes);

app.get("/", (req, res) => res.send("API Banco de Trocas Rodando 🚀"));

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});