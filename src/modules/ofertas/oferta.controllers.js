// Importa o service (camada que contém as regras e acesso ao banco via Prisma)
const ofertaService = require("./oferta.service");

/**
 * Controller: cria uma oferta.
 * - Recebe os dados via req.body
 * - Chama o service para criar no banco
 * - Retorna HTTP 201 (Created) em caso de sucesso
 */
exports.createOfertaController = async (req, res) => {
  try {
    // 1) Passa o body para o service (validação e criação acontecem lá)
    const oferta = await ofertaService.createOferta(req.body);

    // 2) Responde com status 201 e o objeto criado
    return res.status(201).json({ message: "Oferta criada com sucesso", oferta });
  } catch (error) {
    // 3) Em caso de erro (validação, não encontrado etc), responde 400 com a mensagem
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller: atualiza uma oferta.
 * - Pega o id pela URL (req.params)
 * - Pega os campos a atualizar pelo body
 * - Retorna 200 em sucesso
 */
exports.updateOfertaController = async (req, res) => {
  try {
    // 1) Extrai o id da rota /ofertas/:id
    const { id } = req.params;

    // 2) Chama o service para atualizar no banco
    const oferta = await ofertaService.updateOferta(id, req.body);

    // 3) Retorna a oferta atualizada
    return res.status(200).json({ message: "Oferta atualizada com sucesso", oferta });
  } catch (error) {
    // 4) Qualquer erro vira 400 com a mensagem
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller: remove uma oferta pelo id.
 * - Retorna 200 em sucesso com uma mensagem
 */
exports.deleteOfertaController = async (req, res) => {
  try {
    // 1) Extrai o id da URL
    const { id } = req.params;

    // 2) Chama o service para deletar no banco
    const result = await ofertaService.deleteOferta(id);

    // 3) Retorna o resultado (ex: { message: "..." })
    return res.status(200).json(result);
  } catch (error) {
    // 4) Em caso de erro, responde 400
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller: lista ofertas com filtros.
 * - Query params: search (título/descrição), categoria, nivel
 * - Retorna 200 com a lista e um count
 */
exports.listOfertasController = async (req, res) => {
  try {
    // 1) Extrai os filtros da query string
    const { search, categoria, nivel } = req.query;

    // 2) Busca a lista no service passando os filtros
    const ofertas = await ofertaService.listOfertas({ search, categoria, nivel });

    // 3) Retorna a lista e a contagem
    return res.status(200).json({ count: ofertas.length, ofertas });
  } catch (error) {
    // 4) Em caso de erro, responde 400
    return res.status(400).json({ error: error.message });
  }
};
