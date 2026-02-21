const bcrypt = require('bcrypt');
const prisma = require("../config/prisma_db"); 
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.pessoa.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ error: "Credenciais inválidas." });

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ error: "Credenciais inválidas." });

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } 
    );

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token: token,
      user: { id: user.id, nome: user.nome }
    });

  } catch (error) {
    return res.status(500).json({ error: "Erro no servidor." });
  }
};

const createUser = async (req, res) => {
  try {
    const { nome, email, senha, telefone, descricao } = req.body;

    if (!nome || !email || !senha || !telefone) {
        return res.status(400).json({ error: "Campos obrigatórios: nome, email, senha, telefone" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "O e-mail fornecido não é válido." });
    }

    if (senha.length < 8) {
        return res.status(400).json({ error: "Segurança: A senha deve ter no mínimo 8 caracteres." });
    }
      
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const pessoa = await prisma.pessoa.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        telefone,
        descricao: descricao ?? null,
      },
    });

    return res.status(201).json({ message: "Pessoa criada com sucesso", pessoa });
  } catch (err) {
    if (err.code === 'P2002') {
        return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }
    return res.status(400).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const pessoas = await prisma.pessoa.findMany({
      orderBy: { nome: "asc" },
      include: { ofertas: true }, 
    });
    return res.status(200).json({ count: pessoas.length, pessoas });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const pessoa = await prisma.pessoa.findUnique({
      where: { id },
      include: { ofertas: true },
    });

    if (!pessoa) return res.status(404).json({ error: "Pessoa não encontrada" });
    return res.status(200).json(pessoa);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const pessoa = await prisma.pessoa.findUnique({ where: { id } });
    if (!pessoa) return res.status(404).json({ error: "Pessoa não encontrada" });

    await prisma.pessoa.delete({ where: { id } });
    return res.status(200).json({ message: "Pessoa removida com sucesso" });
  } catch (err) {    
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, descricao, senha } = req.body;

    const dataToUpdate = {};

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "O novo e-mail fornecido não é válido." });
      }
      dataToUpdate.email = email;
    }

    if (senha) {
      if (senha.length < 8) {
        return res.status(400).json({ error: "A nova senha deve ter no mínimo 8 caracteres." });
      }
      dataToUpdate.senha = await bcrypt.hash(senha, 10);
    }

    if (nome) dataToUpdate.nome = nome;
    if (telefone) dataToUpdate.telefone = telefone;
    if (descricao) dataToUpdate.descricao = descricao;

    const pessoa = await prisma.pessoa.update({
      where: { id },
      data: dataToUpdate,
    });

    return res.status(200).json({ message: "Pessoa atualizada com sucesso", pessoa });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: "Este e-mail já está sendo usado por outra pessoa." });
    }
    return res.status(400).json({ error: err.message });
  }
};

module.exports = { getUsers, createUser, getUser, deleteUser, updateUser, login };