const ofertaService = require("./oferta.service");

exports.createOfertaController = async (req, res) => {
  try {
    const oferta = await ofertaService.createOferta(req.body);
    return res.status(201).json({ message: "Oferta criada com sucesso", oferta });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.updateOfertaController = async (req, res) => {
  try {
    const { id } = req.params;
    const oferta = await ofertaService.updateOferta(id, req.body);
    return res.status(200).json({ message: "Oferta atualizada com sucesso", oferta });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteOfertaController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ofertaService.deleteOferta(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.listOfertasController = async (req, res) => {
  try {
    const ofertas = await ofertaService.listOfertas();
    return res.status(200).json({ count: ofertas.length, ofertas });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
