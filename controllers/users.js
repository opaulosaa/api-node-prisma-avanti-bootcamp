const prisma = require("../src/config/prisma_db"); // ajuste o caminho conforme sua estrutura

// GET /users  (lista pessoas)
const getUsers = async (req, res) => {
  try {
    const pessoas = await prisma.pessoa.findMany({
      orderBy: { nome: "asc" },
      include: { ofertas: true }, // opcional: traz as ofertas
    });
    return res.status(200).json({ count: pessoas.length, pessoas });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /users  (cria pessoa)
const createUser = async (req, res) => {
  try {
    const { nome, email, telefone, descricao } = req.body;

    // validação mínima (porque no schema são obrigatórios)
    if (!nome || !email || !telefone) {
      return res.status(400).json({
        error: "Campos obrigatórios: nome, email, telefone",
      });
    }

    const pessoa = await prisma.pessoa.create({
      data: {
        nome,
        email,
        telefone,
        descricao: descricao ?? null,
      },
    });

    return res.status(201).json({ message: "Pessoa criada com sucesso", pessoa });
  } catch (err) {
    // Se email for duplicado, o Prisma costuma lançar erro de unique constraint
    return res.status(400).json({ error: err.message });
  }
};

// GET /users/:id  (busca pessoa por id)
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

// DELETE /users/:id  (remove pessoa)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Opcional: verificar se existe antes
    const pessoa = await prisma.pessoa.findUnique({ where: { id } });
    if (!pessoa) return res.status(404).json({ error: "Pessoa não encontrada" });

    await prisma.pessoa.delete({ where: { id } });

    return res.status(200).json({ message: "Pessoa removida com sucesso" });
  } catch (err) {
    // Pode falhar se existir Conhecimento ligado por FK (dependendo do onDelete)
    return res.status(400).json({ error: err.message });
  }
};

// PATCH /users/:id  (atualiza pessoa)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, descricao } = req.body;

    const pessoa = await prisma.pessoa.update({
      where: { id },
      data: {
        nome: nome ?? undefined,
        email: email ?? undefined,
        telefone: telefone ?? undefined,
        descricao: descricao ?? undefined,
      },
    });

    return res.status(200).json({ message: "Pessoa atualizada com sucesso", pessoa });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = { getUsers, createUser, getUser, deleteUser, updateUser };
