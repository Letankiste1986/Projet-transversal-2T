import prisma from "../config/prisma.js";

export const allData = async ()=> {
    const data = await prisma.mesure.findMany({});

    return data;
}