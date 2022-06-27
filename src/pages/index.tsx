import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { getIDs } from '../utils/getRandomNPC'
import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {


  const [ids, setIds] = useState(() => getIDs());
  const [first, second] = ids;
  
  const [npc, setNpc] = useState(null);
  const [npc2, setNpc2] = useState(null);
  const [npcImage, setNpcImage] = useState(null);
  const [npcImage2, setNpcImage2] = useState(null);

  const firstNPCData = trpc.useQuery(['get-npc-by-id', {id: first}]);
  const secondNPCData = trpc.useQuery(['get-npc-by-id', {id: second}]);

  useEffect(() => {
    if (firstNPCData.data && secondNPCData.data) {
      setNpc(firstNPCData.data.name);
      setNpc2(secondNPCData.data.name);
      setNpcImage(firstNPCData.data.id);
      setNpcImage2(secondNPCData.data.id);
    }
  }, [firstNPCData, secondNPCData]);


   const voteMutation = trpc.useMutation(['cast-vote']);

    const vote = (selected: string) => {
      if(!firstNPCData.isLoading && !secondNPCData.isLoading && npcImage && npcImage2) {
      if(selected === npcImage) {
        voteMutation.mutate({votedFor: npcImage, votedAgainst: npcImage2});
      }
      else{
        voteMutation.mutate({votedFor: npcImage2, votedAgainst: npcImage});
      }
      
      setIds(() => getIDs());
    }
   }


  return (
    <div>
      <Head>
        <title>Coolest NPC</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='w-screen h-screen antialiased bg-slate-800 flex flex-co justify-center items-center'>
        <h1 className='text-3xl text-slate-50 text-center'>
          Which NPC is cooler?
        </h1>
        <div className='p-16'></div>
        <div className='border rounded p-24 flex flex-row items-center justify-between max-w-2xl'>

          <div className='w-64 h-64 text-slate-50 flex flex-col items-center justify-end' >
            <Image src={`https://maplestory.io/api/GMS/233/npc/${npcImage}/icon`} width={256} height={256} layout="intrinsic"/>
            <h2>{npc}</h2>
            <button onClick={() => vote(npcImage!)} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded  ">
              cooler
              </button>
          </div>

          <div className='text-slate-50 text-xl w-64 h-64 text-center flex justify-center items-center'>Vs</div>

          <div className='w-64 h-64 text-slate-50 display flex flex-col items-center justify-end'>
            <Image src={`https://maplestory.io/api/GMS/233/npc/${npcImage2}/icon`}  width={256} height={256} layout="intrinsic"/>
            <h2>{npc2}</h2>
            <button onClick={() => vote(npcImage2!)} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded ">
              cooler
              </button>
          </div>

        </div>
      </div>

    </div>
  )
}



export default Home
