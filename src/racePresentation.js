const fallbackName=id=>id?`${id[0].toUpperCase()}${id.slice(1)}`:'Someone';

export function raceBettingLines(scene,nameOf=fallbackName){
 if(!scene?.bets?.length)return [];
 const lines=[];
 for(const bet of scene.bets){
  if(!bet?.settled||!bet.playerBacker||!bet.juanBacker||!(bet.stake>0))continue;
  const playerBacker=nameOf(bet.playerBacker)||fallbackName(bet.playerBacker);
  const juanBacker=nameOf(bet.juanBacker)||fallbackName(bet.juanBacker);
  const winner=nameOf(bet.winnerId)||fallbackName(bet.winnerId);
  const tins=`${bet.stake} tin${bet.stake===1?'':'s'}`;
  lines.push(`${playerBacker} puts ${tins} on you against ${juanBacker}.`);
  lines.push(`${winner} collects the ${tins}.`);
 }
 return lines;
}
