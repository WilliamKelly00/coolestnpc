import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import prisma from '../../../utils/prisma';

export const appRouter = trpc
  .router()
  .query('get-npc-by-id', {
    input: z
      .object({
        id: z.number()
      }),
    async resolve({ input }) {
      const npc = await prisma.npc.findFirst({
        where: {
          id: input.id
        }
      });

      if(!npc) {
        throw new Error('NPC not found');
      }

      return npc;
    },
  })
  .mutation('cast-vote', {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number()
    }),
    async resolve({ input }) {

      const voteInDb = await prisma.vote.create({
        data: {
          votedForId: input.votedFor,
          votedAgainstId: input.votedAgainst
        }
      });


      return {success: true, vote: voteInDb};
    },
  })
  ;

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});