// Importa a instância do PrismaClient (conexão com o banco) configurada no projeto
const prisma = require("../../config/prisma_db");

/**
 * Cria uma nova "Oferta" (no seu caso, um registro na tabela/model Conhecimento)
 * e associa a oferta a uma Pessoa existente (responsável).
 */
const createOferta = async ({ titulo, descricao, categoria, nivel, pessoaId }) => {
  // 1) Validação de campos obrigatórios (evita inserir dados incompletos no banco)
  if (!titulo || !categoria || !nivel || !pessoaId) {
    throw new Error("Campos obrigatórios: titulo, categoria, nivel, pessoaId");
  }

  // 2) Verifica se a pessoa (responsável) existe antes de criar a oferta
  //    Isso evita erro de FK/relacionamento e permite retornar uma mensagem amigável
  const pessoa = await prisma.pessoa.findUnique({ where: { id: pessoaId } });
  if (!pessoa) throw new Error("Pessoa responsável não encontrada.");

  // 3) Cria o registro em "conhecimento" (Oferta) e conecta com a Pessoa via relação "responsavel"
  //    - descricao: se vier undefined, salva como null para não quebrar regras do schema
  //    - include: retorna também os dados do responsável junto com a oferta criada
  return prisma.conhecimento.create({
    data: {
      titulo,
      descricao: descricao ?? null,
      categoria,
      nivel,
      responsavel: { connect: { id: pessoaId } }, // conecta a oferta ao responsável já existente
    },
    include: { responsavel: true }, // inclui os dados do responsável no retorno
  });
};

/**
 * Atualiza uma oferta existente (Conhecimento) pelo id.
 * Atualiza apenas os campos que foram enviados (patch-like behavior via ?? undefined).
 */
const updateOferta = async (id, data) => {
  // 1) Confere se a oferta existe antes de tentar atualizar
  //    (evita o Prisma lançar erro e permite mensagem controlada)
  const existing = await prisma.conhecimento.findUnique({ where: { id } });
  if (!existing) throw new Error("Oferta não encontrada.");

  // 2) Se a requisição quiser trocar o responsável (pessoaId),
  //    valida se essa nova pessoa existe
  if (data.pessoaId) {
    const pessoa = await prisma.pessoa.findUnique({ where: { id: data.pessoaId } });
    if (!pessoa) throw new Error("Pessoa não encontrada para reassociar.");
  }

  // 3) Atualiza o registro
  //    - campo ?? undefined: se não vier no body, não altera no banco
  //    - se vier pessoaId, conecta o novo responsável
  //    - include: traz o responsável junto no retorno
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

/**
 * Remove uma oferta existente (Conhecimento) pelo id.
 */
const deleteOferta = async (id) => {
  // 1) Confere se existe antes de deletar (mensagem mais amigável)
  const existing = await prisma.conhecimento.findUnique({ where: { id } });
  if (!existing) throw new Error("Oferta não encontrada.");

  // 2) Deleta o registro do banco
  await prisma.conhecimento.delete({ where: { id } });

  // 3) Retorna uma mensagem padrão para o controller enviar ao cliente
  return { message: "Oferta removida com sucesso" };
};

/**
 * Lista todas as ofertas (Conhecimento).
 * Traz também o responsável e ordena pelo título.
 */
const listOfertas = async () => {
  // 1) Busca vários registros
  //    - include: traz o responsável junto
  //    - orderBy: ordena alfabeticamente pelo título
  return prisma.conhecimento.findMany({
    include: { responsavel: true },
    orderBy: { titulo: "asc" },
  });
};

// Exporta as funções do service para serem usadas pelo controller
module.exports = { createOferta, updateOferta, deleteOferta, listOfertas };
