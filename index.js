const express = require("express");
const userRoutes = require("./routes/users");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => res.send("Servidor rodando"));

app.use("/users", userRoutes);


const ofertaRoutes = require("./src/modules/ofertas/oferta.routes");
app.use("/ofertas", ofertaRoutes);



app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
