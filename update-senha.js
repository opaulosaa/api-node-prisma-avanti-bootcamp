const prisma = require("./src/config/prisma_db");

async function updateSenha() {
  try {
    const result = await prisma.pessoa.updateMany({
      where: { email: "joao@email.com" },
      data: { senha: "$2b$10$vBwlY3vvLH2FT..I3U0mgOfmcVz9fzJrVeYtfN2tzgVpyr6G5nRtS" }
    });
    console.log("Senha atualizada:", result);
  } catch (err) {
    console.error("Erro:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateSenha();
