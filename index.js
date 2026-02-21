const express = require('express');

const userRoutes = require('./routes/users.js');
const app = express();
const PORT = 3000;

app.use(express.json());
app.get('/', (req, res) => {
    console.log('Requisição recebida');
  res.send('Servidor rodando ');
});

app.use('/users', userRoutes);
console.log('userRoutes:', userRoutes);
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});