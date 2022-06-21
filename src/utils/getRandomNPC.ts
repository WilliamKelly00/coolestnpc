const MAX_NPC_ID = 11210;

export const getRandomNPC: (notThisID?: number) => number = (
    notThisID) => {
    const NPCID = Math.floor(Math.random() * (MAX_NPC_ID - 1)) + 1;

    if (NPCID === notThisID) {
        return getRandomNPC(notThisID);
    }
    return NPCID;
}

export const getIDs = () => {
    const firstID = getRandomNPC();
    const secondID = getRandomNPC(firstID);

    return [firstID, secondID];
}