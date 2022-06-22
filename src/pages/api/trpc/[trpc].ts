import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

export const appRouter = trpc
  .router()
  .query('get-npc-by-id', {
    input: z
      .object({
        id: z.number()
      }),
    async resolve({ input }) {

        // get first npc
        const firstNPC = await fetch(`https://maplestory.io/api/GMS/233/npc?startAt=${input.id}&count=1`);
        const firstNPCData = await firstNPC.json();

        return firstNPCData[0];
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});