const ofertaService = require("../services/oferta.service");

/**
 * Controller: cria uma oferta.
 * - Recebe os dados via req.body
 * - Chama o service para criar no banco
 * - Retorna HTTP 201 (Created) em caso de sucesso
 */
exports.createOfertaController = async (req, res) => {
  try {  
    const oferta = await ofertaService.createOferta(req.body);
    return res.status(201).json({ message: "Oferta criada com sucesso", oferta });
  } catch (error) {    
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
    const { id } = req.params;
   
    const oferta = await ofertaService.updateOferta(id, req.body);
  
    return res.status(200).json({ message: "Oferta atualizada com sucesso", oferta });
  } catch (error) {
   
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller: remove uma oferta pelo id.
 * - Retorna 200 em sucesso com uma mensagem
 */
exports.deleteOfertaController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ofertaService.deleteOferta(id);

    return res.status(200).json(result);
  } catch (error) {

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
   
    const { search, categoria, nivel } = req.query;

    const ofertas = await ofertaService.listOfertas({ search, categoria, nivel });

    return res.status(200).json({ count: ofertas.length, ofertas });
  } catch (error) {
 
    return res.status(400).json({ error: error.message });
  }
};
