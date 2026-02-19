const express = require('express');
const router = express.Router();

const users =  [

{
"Nome": "Marcos",
"Sobrenome": "Silva",
"Idade": 30,
},
{Nome: "Maria", Sobrenome: "Oliveira", Idade: 25},
]

// Rota para obter todos os usuários
router.get('/', (req, res) => {
    console.log('entrou na rota /users');
    res.send('Hello');
});

module.exports = router;
