const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  login,
} = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

// IMPORTANTE: antes do /:id
router.post("/login", login);

router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

module.exports = router;
