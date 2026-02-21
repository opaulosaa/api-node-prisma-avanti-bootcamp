const jwt = require('jsonwebtoken');
const prisma = require("../config/prisma_db");

const verificarDonoOuAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido." });

  try {
       
    const usuarioLogado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = usuarioLogado;

    if (req.params.id && (req.method === 'DELETE' || req.method === 'PUT')) {
      const oferta = await prisma.conhecimento.findUnique({
        where: { id: req.params.id }
      });

      if (!oferta) return res.status(404).json({ error: "Oferta não encontrada." });
     
      if (oferta.pessoa_id !== usuarioLogado.id) {
        return res.status(403).json({ error: "Acesso negado: você não é o dono desta oferta." });
      }
    }

    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido ou expirado." });
  }
};

module.exports = { verificarDonoOuAdmin };