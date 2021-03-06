import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { getIDs } from '../utils/getRandomNPC'
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import Link from 'next/link'

const Home: NextPage = () => {


  const [ids, setIds] = useState(() => getIDs());
  const [first, second] = ids;
  
  const [npc, setNpc] = useState(null);
  const [npc2, setNpc2] = useState(null);

  const firstNPC = trpc.useQuery(['get-npc-by-id', {id: first}]);
  const secondNPC = trpc.useQuery(['get-npc-by-id', {id: second}]);

   const voteMutation = trpc.useMutation(['cast-vote']);

    const vote = (selected: number) => {
      if(!firstNPC.isLoading && !secondNPC.isLoading) {
      if(selected === firstNPC.data!.id) {
        voteMutation.mutate({votedFor: firstNPC.data!.id, votedAgainst: secondNPC.data!.id});
      }
      else{
        voteMutation.mutate({votedFor: secondNPC.data!.id, votedAgainst: firstNPC.data!.id});
      }
      
      setIds(() => getIDs());
    }
   }

  return (
    <div>
      <Head>
        <title>Coolest NPC</title>
        <meta name="description" content="Website to vote on your favorite npc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='w-screen h-screen antialiased bg-slate-800 flex flex-row justify-center items-center'>
        <div className='text-3xl text-slate-50 text-center'>
          Which NPC is cooler?

        <div>
        <Link href="/results">
        <a className=' text-slate-300 text-xl pt-5'>
          results
        </a>
        </Link>
        </div>

        </div>
        <div className='p-16'></div>
        <div className='border rounded p-24 flex flex-row items-center justify-between max-w-2xl'>


        {firstNPC.data && (
         <div className='w-64 h-64 text-slate-50 flex flex-col items-center justify-end' >
            <Image src={firstNPC.data?.spriteUrl!} width={256} height={256} layout="intrinsic"/>
            <h2>{firstNPC.data?.name}</h2>
            <button onClick={() => vote(firstNPC.data?.id!)} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded  ">
              cooler
              </button>
          </div>
        )}

          <div className='text-slate-50 text-xl w-64 h-64 text-center flex justify-center items-center'>Vs</div>
         
          {secondNPC.data && (
          <div className='w-64 h-64 text-slate-50 display flex flex-col items-center justify-end'>
            <Image src={secondNPC.data?.spriteUrl!}  width={256} height={256} layout="intrinsic"/>
            <h2>{secondNPC.data?.name!}</h2>
            <button onClick={() => vote(secondNPC.data?.id!)} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded ">
              cooler
              </button>
          </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default Home
