const prisma = require("../../config/prisma_db");

const createOferta = async ({ titulo, descricao, categoria, nivel, pessoaId }) => {
  if (!titulo || !categoria || !nivel || !pessoaId) {
    throw new Error("Campos obrigatórios: titulo, categoria, nivel, pessoaId");
  }

  const pessoa = await prisma.pessoa.findUnique({ where: { id: pessoaId } });
  if (!pessoa) throw new Error("Pessoa responsável não encontrada.");

  return prisma.conhecimento.create({
  data: {
    titulo,
    descricao: descricao ?? null,
    categoria,
    nivel,
    responsavel: { connect: { id: pessoaId } },
  },
  include: { responsavel: true },
});

};

const updateOferta = async (id, data) => {
  const existing = await prisma.conhecimento.findUnique({ where: { id } });
  if (!existing) throw new Error("Oferta não encontrada.");

  if (data.pessoaId) {
    const pessoa = await prisma.pessoa.findUnique({ where: { id: data.pessoaId } });
    if (!pessoa) throw new Error("Pessoa não encontrada para reassociar.");
  }

  return prisma.conhecimento.update({
  where: { id },
  data: {
    titulo: data.titulo ?? undefined,
    descricao: data.descricao ?? undefined,
    categoria: data.categoria ?? undefined,
    nivel: data.nivel ?? undefined,
    responsavel: data.pessoaId ? { connect: { id: data.pessoaId } } : undefined,
  },
  include: { responsavel: true },
});

};

const deleteOferta = async (id) => {
  const existing = await prisma.conhecimento.findUnique({ where: { id } });
  if (!existing) throw new Error("Oferta não encontrada.");

  await prisma.conhecimento.delete({ where: { id } });
  return { message: "Oferta removida com sucesso" };
};

const listOfertas = async () => {
 return prisma.conhecimento.findMany({
  include: { responsavel: true },
  orderBy: { titulo: "asc" },
});

};

module.exports = { createOferta, updateOferta, deleteOferta, listOfertas };
