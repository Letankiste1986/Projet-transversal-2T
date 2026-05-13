import prisma from "../config/prisma.js";

export const allData = async ()=> {
    const data = await prisma.mesure.findMany({});

    return data;
}

export const lastData = async () => {
    const data = await prisma.mesure.findFirst({
        orderBy: {
            createdAt: 'desc',
        }
    })
    return data;
}