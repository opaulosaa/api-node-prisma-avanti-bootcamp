const prisma = require("../src/config/prisma_db");
const bcrypt = require("bcrypt");

// POST /auth/login  (autenticação)
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    // Buscar pessoa por email
    const pessoa = await prisma.pessoa.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        telefone: true,
        descricao: true,
        foto: true,
        role: true,
      },
    });

    if (!pessoa) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, pessoa.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    // Remover senha da resposta
    const { senha: _, ...pessoaSemSenha } = pessoa;

    return res.status(200).json({
      message: "Login realizado com sucesso",
      pessoa: pessoaSemSenha,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { login };