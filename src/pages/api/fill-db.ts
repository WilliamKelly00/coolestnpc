import prisma from "../../utils/prisma";

const doBackfill = async () => {

    const npcs = await fetch(`https://maplestory.io/api/GMS/233/npc?startAt=0`);
    const npcsData: any = await npcs.json();

    const formattedNPCs = npcsData.map((npc: { id: any; name: any; }, index: any) => ({
        id: index,
        name: npc.name ? npc.name : "Unnamed NPC",
        spriteUrl: `https://maplestory.io/api/GMS/233/npc/${npc.id}/icon`
    }));

    const creation = await prisma.npc.createMany({
        data: formattedNPCs,
    });

    console.log("Creation:", creation);
}


import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await doBackfill();
  res.status(200).json({ name: 'Hello world!' })
}