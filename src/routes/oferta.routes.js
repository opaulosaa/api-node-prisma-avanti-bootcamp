const express = require("express");
const router = express.Router();
const controller = require("../controllers/oferta.controllers");
const { verificarDonoOuAdmin } = require("../middlewares/auth");

router.get("/", controller.listOfertasController);
router.post("/", controller.createOfertaController);

router.put("/:id", verificarDonoOuAdmin, controller.updateOfertaController);
router.delete("/:id", verificarDonoOuAdmin, controller.deleteOfertaController);

module.exports = router;
