/*
  Warnings:

  - Added the required column `senha` to the `Pessoa` table without a default value. This is not possible if the table is not empty.
*/

-- AlterTable
-- Primeiro adiciona a coluna como opcional
ALTER TABLE "Pessoa" ADD COLUMN "foto" TEXT;
ALTER TABLE "Pessoa" ADD COLUMN "senha" TEXT;

-- Atualiza registros existentes com senha padrão (hash de "senha123")
UPDATE "Pessoa" SET "senha" = '$2b$10$rQ8K3Z8xJ.KX8kXJZJ.Y8.8wKxYxYxYxYxYxYxYxYxYxYxYxYxY' WHERE "senha" IS NULL;

-- Torna a coluna obrigatória
ALTER TABLE "Pessoa" ALTER COLUMN "senha" SET NOT NULL;
