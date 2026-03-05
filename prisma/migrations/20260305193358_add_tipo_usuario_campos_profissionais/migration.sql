-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ALUNO', 'ESPECIALISTA');

-- AlterTable
ALTER TABLE "Pessoa" ADD COLUMN     "areaAtuacao" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "especialidadePrincipal" TEXT,
ADD COLUMN     "linkPortfolio" TEXT,
ADD COLUMN     "tipoUsuario" "TipoUsuario" NOT NULL DEFAULT 'ALUNO',
ADD COLUMN     "uf" TEXT;
