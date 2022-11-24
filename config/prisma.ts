import { Prisma, PrismaClient } from '@prisma/client'

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

let prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['info', 'warn', 'error'] : [],
})

export const getSequence = async (sequenceName: string): Promise<number> => {
    const result: Array<{ id: number }> = await prisma.$queryRaw(
        Prisma.sql`SELECT nextval(${sequenceName}) as id`
    )
    return Number(result[0].id);
}

if( process.env.NODE_ENV === 'development' ) {
    // do next.js
    global.prisma = prisma
}

export default prisma