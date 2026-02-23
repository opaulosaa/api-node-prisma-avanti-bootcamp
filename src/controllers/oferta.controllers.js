const ofertaService = require("../services/oferta.service");

exports.createOfertaController = async (req, res) => {
  try {  
    const oferta = await ofertaService.createOferta(req.body);
    return res.status(201).json({ message: "Oferta criada com sucesso", oferta });
  } catch (error) {    
    return res.status(400).json({ error: error.message });
  }
};

<<<<<<< HEAD
=======
/**
 * Controller: atualiza uma oferta.
 */
>>>>>>> 0061769c8c28721ce0a6fb29a0cbdb3f68e9dc73
exports.updateOfertaController = async (req, res) => {
  try {   
    const { id } = req.params;
   
    const oferta = await ofertaService.updateOferta(id, req.body);
  
    return res.status(200).json({ message: "Oferta atualizada com sucesso", oferta });
  } catch (error) {
   
    return res.status(400).json({ error: error.message });
  }
};

<<<<<<< HEAD
=======
/**
 * Controller: remove uma oferta pelo id.
 */
>>>>>>> 0061769c8c28721ce0a6fb29a0cbdb3f68e9dc73
exports.deleteOfertaController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ofertaService.deleteOferta(id);

    return res.status(200).json(result);
  } catch (error) {

    return res.status(400).json({ error: error.message });
  }
};

<<<<<<< HEAD
=======
/**
 * Controller: lista ofertas com filtros.
 */
>>>>>>> 0061769c8c28721ce0a6fb29a0cbdb3f68e9dc73
exports.listOfertasController = async (req, res) => {
  try {
   
    const { search, categoria, nivel } = req.query;

    const ofertas = await ofertaService.listOfertas({ search, categoria, nivel });

    return res.status(200).json({ count: ofertas.length, ofertas });
  } catch (error) {
 
    return res.status(400).json({ error: error.message });
  }
};
