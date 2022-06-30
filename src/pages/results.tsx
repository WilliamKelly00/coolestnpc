import { GetServerSideProps } from "next";
import prisma from "../utils/prisma";
import Image from "next/image";

export default function ResultsPage(props: any) {
  return (
    <div className=" bg-slate-800 h-full text-slate-50">
        <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">


        {props.npcsOrdered && props.npcsOrdered
          .sort((a: { _count: { votesFor: number; }; }, b: { _count: { votesFor: number; }; }) => {
            const difference =
              generateCountPercent(b) - generateCountPercent(a);

            if (difference === 0) {
              return b._count.votesFor - a._count.votesFor;
            }

            return difference;
          })
          .map((currentNpc: any, index: number) => {
            return <NpcListing npc={currentNpc} key={index} rank={index + 1} />;
          })}
      </div>
    </div>
    
    </div>
  )
}

const NpcListing = (props:any) => {
  return (
    <div className="relative flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
         <div className="flex items-center pl-8">
          <Image
            src={props.npc.spriteUrl}
            width={64}
            height={64}
            layout="fixed"
          />
          <div className="pl-2 capitalize">{props.npc.name}</div>
        </div>
      </div>
      <div className="pr-4">
        {generateCountPercent(props.npc).toFixed(2) + "%"}
      </div>
      <div className="absolute top-0 left-0 z-20 flex items-center justify-center px-2 font-semibold text-white bg-gray-600 border border-gray-500 shadow-lg rounded-br-md">
        {props.rank}
      </div>
    </div>
  );
}


const generateCountPercent = (props:any) => {
  const { votesFor, votesAgainst } = props._count;
  if (votesFor + votesAgainst === 0) {
    return 0;
  }
  return (votesFor / (votesFor + votesAgainst)) * 100;
};


const getNpcsInOrder = async() => {
    const npcs =  await prisma.npc.findMany({
        orderBy: {
          votesFor: { _count: "desc" },
        },
        select: {
          id: true,
          name: true,
          spriteUrl: true,
          _count: {
            select: {
              votesFor: true,
              votesAgainst: true,
            },
          },
        },
        take: 50,
      });

    return npcs;
}

export const getStaticProps: GetServerSideProps = async () => {
  const npcs = await getNpcsInOrder();
  return {
    props: {
      npcsOrdered: npcs,
    },
    revalidate: 60 * 5,
  };
}