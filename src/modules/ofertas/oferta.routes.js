const express = require("express");
const router = express.Router();
const controller = require("./oferta.controllers");

router.get("/", controller.listOfertasController);
router.post("/", controller.createOfertaController);
router.put("/:id", controller.updateOfertaController);
router.delete("/:id", controller.deleteOfertaController);

module.exports = router;
