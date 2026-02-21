// Importa a instância do PrismaClient (conexão com o banco) configurada no projeto
const prisma = require("../config/prisma_db");

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
 
  const existing = await prisma.conhecimento.findUnique({ where: { id } });
  if (!existing) throw new Error("Oferta não encontrada.");

  await prisma.conhecimento.delete({ where: { id } });

  return { message: "Oferta removida com sucesso" };
};

/**
 * Lista todas as ofertas (Conhecimento) com filtros opcionais.
 * Traz também o responsável e ordena pelo título.
 * @param {Object} filters - Filtros de busca
 * @param {string} filters.search - Busca por título ou descrição
 * @param {string} filters.categoria - Filtro por categoria
 * @param {string} filters.nivel - Filtro por nível
 */
const listOfertas = async (filters = {}) => {
  const { search, categoria, nivel } = filters;

  const where = {};

  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: 'insensitive' } },
      { descricao: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (categoria) {
    where.categoria = categoria;
  }

  if (nivel) {
    where.nivel = nivel;
  }

  return prisma.conhecimento.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: { responsavel: true },
    orderBy: { titulo: "asc" },
  });
};

module.exports = { createOferta, updateOferta, deleteOferta, listOfertas };
