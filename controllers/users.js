const prisma = require("../src/config/prisma_db");
const bcrypt = require("bcrypt");

// GET /users  (lista pessoas)
const getUsers = async (req, res) => {
  try {
    const pessoas = await prisma.pessoa.findMany({
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true,
        foto: true,
        role: true,
        // NÃƒO retornar senha
      },
    });
    return res.status(200).json({ count: pessoas.length, pessoas });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /users  (cria pessoa)
const createUser = async (req, res) => {
  try {
    const { nome, email, senha, cpf, telefone, descricao, foto, role, tipoUsuario, areaAtuacao, uf, linkPortfolio, especialidadePrincipal } = req.body;

    // validaÃ§Ã£o mÃ­nima
    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({
        error: "Campos obrigatÃ³rios: nome, email, senha, telefone",
      });
    }

    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const pessoa = await prisma.pessoa.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone,
        descricao: descricao ?? null,
        foto: foto ?? null,
        tipoUsuario: tipoUsuario || 'ALUNO',
        areaAtuacao: areaAtuacao ?? null,
        uf: uf ?? null,
        linkPortfolio: linkPortfolio ?? null,
        especialidadePrincipal: especialidadePrincipal ?? null,
        role: role || "USER", // Default USER se nÃ£o for especificado
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true,
        foto: true,
        role: true,
        // NÃƒO retornar senha
      },
    });

    return res.status(201).json({ message: "Pessoa criada com sucesso", pessoa });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// GET /users/:id  (busca pessoa por id)
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const pessoa = await prisma.pessoa.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true,
        foto: true,
        role: true,
      },
    });

    if (!pessoa) return res.status(404).json({ error: "Pessoa nÃ£o encontrada" });
    
    return res.status(200).json(pessoa);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// DELETE /users/:id  (remove pessoa)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const pessoa = await prisma.pessoa.findUnique({ where: { id } });
    if (!pessoa) return res.status(404).json({ error: "Pessoa nÃ£o encontrada" });
    
    await prisma.pessoa.delete({ where: { id } });

    return res.status(200).json({ message: "Pessoa removida com sucesso" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// PATCH /users/:id  (atualiza pessoa)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, cpf, telefone, descricao, foto, role, tipoUsuario, areaAtuacao, uf, linkPortfolio, especialidadePrincipal } = req.body;

    const updateData = {
      nome: nome ?? undefined,
      email: email ?? undefined,
      telefone: telefone ?? undefined,
      descricao: descricao ?? undefined,
      foto: foto ?? undefined,
      role: role ?? undefined,
    };

    // Se senha foi passada, fazer hash
    if (senha) {
      const saltRounds = 10;
      updateData.senha = await bcrypt.hash(senha, saltRounds);
    }

    const pessoa = await prisma.pessoa.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true,
        foto: true,
        role: true,
      },
    });

    return res.status(200).json({ message: "Pessoa atualizada com sucesso", pessoa });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = { getUsers, createUser, getUser, deleteUser, updateUser };