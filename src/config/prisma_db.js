const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    // SSL obrigatório em produção (Neon, Render, etc.)
    ...(process.env.NODE_ENV === 'production' && { ssl: { rejectUnauthorized: false } })
 })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

module.exports = prisma