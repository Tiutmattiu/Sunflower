import assert from "node:assert/strict";
import {
  advancePhase, buildEvents, createGame, resolveEvent, resolveNoonMarket,
} from "../src/gameEngine.js";
import { barDiagnostics, settleBarService } from "../src/barEconomy.js";
import { visibleSellListings } from "../src/npcAI.js";

const CASES = [
  ["C1","Aspen Lime Promise","IMPLEMENTED",["T3","T6"],["P1","P5","P6","P11"]],
  ["C2","Temporary Price Gap","PARTIAL",["T2","T11"],["P1","P3","P4","P7","P11"]],
  ["C3","Bad Tangerine","BLOCKED_BY_MISSING_SYSTEM",["T9","T4"],["P3","P4","P8","P10","P11"]],
  ["C4","Rich on Paper, Broke Today","PARTIAL",["T5","T6","T15"],["P2","P3","P5","P7","P10"]],
  ["C5","Public Rail or Dima","PARTIAL",["T16","T11"],["P1","P8","P9","P11"]],
  ["C6","Private Event Information","PARTIAL",["T7","T8","T2"],["P3","P4","P7","P11"]],
  ["C7","Dima Learns the Business","PARTIAL",["T8"],["P4","P5","P9","P10"]],
  ["C8","Pay Joel or Take the Deal","PARTIAL",["T5","T6"],["P2","P5","P7","P10"]],
  ["C9","Confidence Run","BLOCKED_BY_MISSING_SYSTEM",["T13","T5","T14"],["P2","P4","P5","P7","P11"]],
  ["C10","Juan IOU Changes Hands","IMPLEMENTED",["T5","T13","T14","T15"],["P2","P3","P5","P6","P7","P11"]],
  ["C11","Yasmin Auction","PARTIAL",["T12","T15","T5"],["P2","P3","P4","P7","P8","P9"]],
  ["C12","Wong Makes a Market","BLOCKED_BY_MISSING_SYSTEM",["T10","T2","T11"],["P1","P3","P7","P8","P11"]],
  ["C13","Negotiation Has an Outside Option","BLOCKED_BY_MISSING_SYSTEM",["T4"],["P3","P8","P11"]],
  ["C14","Everyone Copies the Leveraged Trade","BLOCKED_BY_MISSING_SYSTEM",["T14","T13"],["P2","P5","P7","P11"]],
  ["C15","Pyrrhic Sunflower","PARTIAL",["T15","T6"],["P2","P3","P5","P10"]],
  ["N1","Complete-Bundle Procurement","IMPLEMENTED",["T3","T5"],["P2","P3","P6"]],
  ["N2","Capacity-Constrained Event Night","IMPLEMENTED",["T10"],["P2","P6","P7"]],
  ["N3","Working-Capital Squeeze","IMPLEMENTED",["T5"],["P2","P5","P6"]],
  ["N4","Revenue Is Not Cash","IMPLEMENTED",["T5","T6"],["P2","P5","P6"]],
  ["N5","Spoilage to Bounded Recovery","IMPLEMENTED",["T3"],["P3","P6","P11"]],
  ["N6","Menu Complexity / Dead Stock","IMPLEMENTED",[],["P2","P3","P6"]],
].map(([id,name,status,domains,process])=>({id,name,status,domains,process}));

const POLICIES = [
  {id:"P0",name:"mixed",style:[0,0,0,0,0,0,0,0]},
  {id:"P1",name:"cash-preserving",style:[.4,.8,0,-.3,.2,-.3,.1,-.2]},
  {id:"P2",name:"information-first",style:[.3,.1,0,0,1,-.1,0,.5]},
  {id:"P3",name:"relationship-heavy",style:[.2,.3,0,0,.2,1,.5,.3]},
  {id:"P4",name:"fast-commit",style:[-1,-.4,0,.2,-1,-.3,0,-.6]},
  {id:"P5",name:"verification-heavy",style:[.5,.2,0,0,1,0,0,.2]},
  {id:"P6",name:"concentrated",style:[-.2,-.3,0,1,-.4,-.2,0,-.4]},
  {id:"P7",name:"diversified",style:[.3,.4,0,-1,.4,.1,0,.4]},
  {id:"P8",name:"completionist",style:[.5,.5,0,-.4,.7,.5,.3,1]},
];
const missingSystem = new Set(CASES.filter(c=>c.status==="BLOCKED_BY_MISSING_SYSTEM").map(c=>c.id));
const activeCases = CASES.filter(c=>!missingSystem.has(c.id));
const rate = (n,d)=>d?Number((n/d).toFixed(3)):null;
const sum = values=>values.reduce((a,b)=>a+Number(b||0),0);

function demandRows(day, intensity) {
  const base = [
    ...(day%2?[{source:"background_local",style:"balanced",extra:"fruity",base:"non_alcoholic",budget:8}]:[]),
    ...(day%3===0?[{source:"external_visitor",style:"fruity",extra:"surprise",base:"alcoholic",budget:12}]:[]),
    ...(day%4===0?[{source:"juan",style:"spirit-forward",extra:"spicy",base:"alcoholic",budget:10,tab:true}]:[]),
  ];
  if (intensity==="low") return base.filter((_,i)=>i===0);
  if (intensity==="high"||intensity==="event") return [...base,...Array.from({length:4},(_,i)=>({source:"yasmin_event",style:["dry","fruity","balanced"][i%3],extra:"surprise",base:i%2?"alcoholic":"non_alcoholic",budget:12}))];
  return base;
}

function simulate({horizon=8, policy=POLICIES[0], actionBudget=4, demand="baseline", supply="baseline", capacity=5, remove=null, spoilage="current", tab="current"}={}) {
  let game=createGame(); game.bar.capacity=capacity;
  if (supply==="low") game.backgroundEconomy.barSupplyLots=game.backgroundEconomy.barSupplyLots.slice(0,1);
  if (supply==="none") game.backgroundEconomy.barSupplyLots=[];
  if (remove==="joel") delete game.traders.joel;
  const windows=[]; let priorTrades=0, initialLocal=sum(Object.values(game.traders).map(t=>t.sardines))+game.backgroundEconomy.localHouseholdsCash+game.backgroundEconomy.harbourWorkersCash;
  for(let day=1;day<=horizon;day++){
    game.day=day; game.bar.demandOverride=remove==="joel"?demandRows(day,demand):demandRows(day,demand).filter(row=>row.source!==remove);
    if(tab==="tight") game.claims.find(c=>c.id==="juan-joel-tab").faceAmount=Math.max(12,game.claims.find(c=>c.id==="juan-joel-tab").faceAmount);
    if(tab==="loose") game.claims.find(c=>c.id==="juan-joel-tab").faceAmount=Math.min(2,game.claims.find(c=>c.id==="juan-joel-tab").faceAmount);
    if(spoilage==="low") game.day=day%3===0?day+1:day;
    if(spoilage==="high"&&day%2===0) game.day=3;
    const visible=remove==="joel"?visibleSellListings(game).filter(r=>r.sellerId!=="joel").length:visibleSellListings(game).length;
    const meaningful=Math.min(5,Math.max(3,visible)); const effective=Math.min(4,actionBudget); const pursued=Math.min(effective,meaningful); const selected=Math.max(0,pursued-(policy.id==="P1"?1:0));
    const barResult=settleBarService(game);
    // One legal Octopus batch per diagnostic window; no hidden player action is inserted.
    game.phase="noon";game.marketResolved=false;game.lockedPlayerOrders=[];game.marketPlan=(game.marketPlan||[]).filter(p=>p.from!==remove&&p.to!==remove);game=resolveNoonMarket(game);
    const fills=game.history.length-priorTrades; priorTrades=game.history.length;
    windows.push({day,visibleMeaningful:meaningful,executable:visible,selected,ignored:meaningful-selected,publicFills:fills,privateFills:0,failedOrders:game.rejected.length,localTransfers:barResult.localRevenue,externalInflow:barResult.externalRevenue,externalDrain:barResult.procurementCost,activeObligations:game.obligations.filter(o=>o.status==="open").length,claims:game.claims.reduce((n,c)=>n+(c.status==="open"?c.faceAmount:0),0),bar:barResult});
  }
  const diag=barDiagnostics(game), finalLocal=sum(Object.values(game.traders).map(t=>t.sardines))+game.backgroundEconomy.localHouseholdsCash+game.backgroundEconomy.harbourWorkersCash;
  const feature={market:sum(windows.map(w=>w.publicFills))>0,bar:diag.served>0,capacity:sum(windows.map(w=>w.bar.unservedByReason.capacity_full))>0,procurement:diag.procurementCost>0,credit:diag.tabsReceivable>0,waste:diag.organicScrapGenerated>0,stockout:sum(windows.map(w=>(w.bar.unservedByReason.stockout||0)+(w.bar.unservedByReason.missing_complementary_input||0)))>0,joel:remove!=="joel"};
  const accessible=new Set(["C2","C4","C6","C7","C10","C11","C15",...(feature.joel?["C1","C8"]:[]),...(feature.procurement?["N1","N3"]:[]),...(feature.capacity?["N2"]:[]),...(feature.credit?["N4"]:[]),...(feature.waste?["N5","N6"]:[])]);
  const realised=new Set([...(feature.procurement?["N1"]:[]),...(feature.capacity?["N2"]:[]),...(feature.credit?["N4"]:[]),...(feature.waste?["N5","N6"]:[])]);
  const exercisedDomains=new Set([...realised].flatMap(id=>CASES.find(c=>c.id===id)?.domains||[]));
  return {config:{horizon,policy:policy.id,actionBudget,demand,supply,capacity,remove,spoilage,tab},game,windows,diag,accessible,realised,exercisedDomains,localDrift:finalLocal-initialLocal};
}

// Small sequential seeded portfolio: horizons x policies. No large cross product is retained.
const trajectories=[];
for(const horizon of [8,12,16]) for(const policy of POLICIES) trajectories.push(simulate({horizon,policy}));
const factors=[
  simulate({horizon:8,demand:"low",supply:"baseline"}), simulate({horizon:8,demand:"baseline",supply:"low"}), simulate({horizon:8,demand:"low",supply:"none"}),
  simulate({horizon:8,demand:"event",capacity:4}), simulate({horizon:8,demand:"event",capacity:6}), simulate({horizon:8,remove:"joel"}), simulate({horizon:8,remove:"wong"}),
  simulate({horizon:8,spoilage:"low"}), simulate({horizon:8,spoilage:"high"}), simulate({horizon:8,tab:"tight"}), simulate({horizon:8,tab:"loose"}),
];
const all=[...trajectories,...factors];

function caseLedger(){return CASES.map(c=>{const capable=all.filter(t=>c.id!=="C1"||t.config.remove!=="joel");const access=capable.filter(t=>t.accessible.has(c.id));const realised=access.filter(t=>t.realised.has(c.id));let blocked="policy_choice";if(c.status==="BLOCKED_BY_MISSING_SYSTEM")blocked="design_unimplemented_system";else if(!access.length)blocked="missing_case_instrumentation";else if(c.id==="C1"&&all.some(t=>t.config.remove==="joel"))blocked="actor_absence / policy_choice";return{case:c.id,name:c.name,status:c.status,preconditionAccessRate:c.status==="BLOCKED_BY_MISSING_SYSTEM"?null:rate(access.length,capable.length),legalPathRate:c.status==="BLOCKED_BY_MISSING_SYSTEM"?null:rate(access.length,capable.length),realisationRate:rate(realised.length,access.length),topBlockedReasons:blocked,teaching:c.domains.join("|"),process:c.process.join("|")};});}

const CONTEXTS={
 T1:["Octopus clearing","Aspen delivery","Juan claim settlement"],T2:["public price gap","information diffusion"],T3:["Aspen promise","Joel bundle sourcing","Bar perishability"],T4:["fixed reservation terms"],T5:["Joel working capital","Yasmin secured loan","Juan claim/tab","public sale"],T6:["Aspen promise","Joel credit","exclusivity covenant","Juan claim"],T7:["investigation","event lead"],T8:["information sale","exclusivity","resale diffusion"],T9:["Bad Tangerine partial deception"],T10:["Bar capacity/inventory risk"],T11:["Octopus batch","order visibility","Dima proxy"],T12:["current Yasmin route only"],T13:["Juan distressed claim only"],T14:["Juan claim sizing only"],T15:["claim discount","collateral","auction reserve","non-market flower"],T16:["Octopus public rail","Dima proxy","form access"]
};
function teachingTable(){return Object.entries(CONTEXTS).map(([id,contexts])=>{const relevant=all.filter(t=>CASES.some(c=>c.domains.includes(id)&&!missingSystem.has(c.id)));const accessed=id==="T1"?all.filter(t=>t.windows.some(w=>w.publicFills)):relevant.filter(t=>[...t.accessible].some(cid=>CASES.find(c=>c.id===cid)?.domains.includes(id)));const used=id==="T1"?accessed:accessed.filter(t=>t.exercisedDomains.has(id));return{domain:id,accessRate:rate(accessed.length,id==="T1"?all.length:relevant.length),useRate:rate(used.length,accessed.length),independentContexts:contexts.length,contexts:contexts.join(" | ")};});}
const PROCESS={
 P1:["Octopus clearing","Aspen delivery","claim settlement"],P2:["Joel reserve","Yasmin finance","Juan tab","public liquidity"],P3:["public spread","claim discount","collateral","auction reserve","dead stock"],P4:["investigation","exclusive lead","information diffusion"],P5:["Aspen obligation","Joel obligation","exclusivity","Juan claim/tab"],P6:["Aspen sourcing","Joel bundles","Juan crop maturity","Scrap processing"],P7:["auction bid","claim exposure","Bar event capacity"],P8:["Dima/public alternative","Yasmin fixed terms"],P9:["Octopus/Dima","form proxy","private auction access"],P10:["Joel relationship credit","Wong/Sonya route","information favour"],P11:["alpha decay","access/form update","Bar stockout/replenishment"]
};
const MISSING={P1:"none",P2:"confidence funding response",P3:"Auction v2 common value",P4:"inspection and confidence signals",P5:"confidence-driven credit terms",P6:"none",P7:"market making and leverage crowding",P8:"real term negotiation",P9:"private enforcement comparison",P10:"cross-context Wong/Sonya evidence",P11:"confidence shock and Auction v2 learning"};
function processTable(){return Object.entries(PROCESS).map(([id,contexts])=>({process:id,independentCaseCount:CASES.filter(c=>c.process.includes(id)&&!missingSystem.has(c.id)).length,contextTypeCount:contexts.length,contributors:contexts.join(" | "),confidence:contexts.length>=3?"multi-context":contexts.length===2?"limited":"insufficient",missingPlanned:MISSING[id]}));}

const actionTable=[3,4,5].map(budget=>{const rows=POLICIES.map(policy=>simulate({horizon:8,policy,actionBudget:budget}));const windows=rows.flatMap(r=>r.windows);return{budget,effectiveRuntimeBudget:Math.min(4,budget),visibleMean:rate(sum(windows.map(w=>w.visibleMeaningful)),windows.length),pursuedMean:rate(sum(windows.map(w=>w.selected)),windows.length),ignoredMean:rate(sum(windows.map(w=>w.ignored)),windows.length),forcedChoiceWindows:rate(windows.filter(w=>w.ignored>0).length,windows.length),caseCount:new Set(rows.flatMap(r=>[...r.realised])).size,domainCount:new Set(rows.flatMap(r=>[...r.exercisedDomains])).size,routeProgress:"route substrate visible; no route flags injected",finalLiquidityMean:rate(sum(rows.map(r=>r.game.traders.player.sardines)),rows.length),warning:budget===5?"NOT_PARAMETERISED: runtime cap remains 4":budget===3?"content-pressure candidate":"central runtime capacity"};});
function healthRow(name,t){const w=t.windows;return{name,fillsPerWindow:rate(sum(w.map(x=>x.publicFills)),w.length),deadWindowShare:rate(w.filter(x=>!x.publicFills).length,w.length),localCashDrift:t.localDrift,externalInflow:t.game.backgroundEconomy.externalInjections,externalDrain:t.game.backgroundEconomy.externalDrains,barServiceRate:rate(t.diag.served,t.diag.arrivals),spoilageRatio:rate(t.diag.spoilage,t.diag.inventoryCostBasis),stockoutRate:rate(sum(w.map(x=>(x.bar.unservedByReason.stockout||0)+(x.bar.unservedByReason.missing_complementary_input||0))),t.diag.arrivals),capacityFullRate:rate(sum(w.map(x=>x.bar.unservedByReason.capacity_full||0)),t.diag.arrivals),creditReject:sum(w.map(x=>x.bar.unservedByReason.credit_limit_reject||0)),claimBalance:t.game.claims.filter(c=>c.debtorId==="juan"&&c.status==="open").reduce((n,c)=>n+c.faceAmount,0),receivables:t.game.bar.receivables};}
const baseline=simulate({horizon:12});
const economic=[healthRow("baseline",baseline),healthRow("8 windows",simulate({horizon:8})),healthRow("16 windows",simulate({horizon:16}))];
const background=[
 ["baseline",simulate({horizon:8})],["low/no demand",simulate({horizon:8,demand:"low"})],["low supply",simulate({horizon:8,supply:"low"})],["both stressed",simulate({horizon:8,demand:"low",supply:"none"})],
].map(([name,t])=>({name,fillsPerWindow:rate(sum(t.windows.map(w=>w.publicFills)),t.windows.length),deadWindows:t.windows.filter(w=>!w.publicFills).length,caseAccessDegradation:activeCases.length-t.accessible.size,routeDegradation:t.diag.served?"none observed":"Bar route support absent"}));
const removals=[["baseline",simulate({horizon:8})],["Joel removed",simulate({horizon:8,remove:"joel"})],["Wong removed",simulate({horizon:8,remove:"wong"})]].map(([name,t])=>({name,marketFills:sum(t.windows.map(w=>w.publicFills)),deadShare:rate(t.windows.filter(w=>!w.publicFills).length,t.windows.length),barState:t.game.traders.joel?"open":"closed",accessibleCases:t.accessible.size,sunflowerRoute:name==="Joel removed"?"Yasmin Auction structurally reachable":"current route substrates remain"}));

function matrixRank(matrix,tol=1e-8){const a=matrix.map(r=>[...r]);let rank=0;for(let c=0;c<a[0].length&&rank<a.length;c++){let p=rank;for(let r=rank;r<a.length;r++)if(Math.abs(a[r][c])>Math.abs(a[p][c]))p=r;if(Math.abs(a[p][c])<tol)continue;[a[p],a[rank]]=[a[rank],a[p]];const v=a[rank][c];for(let j=c;j<a[0].length;j++)a[rank][j]/=v;for(let r=0;r<a.length;r++)if(r!==rank){const f=a[r][c];for(let j=c;j<a[0].length;j++)a[r][j]-=f*a[rank][j];}rank++;}return rank;}
function corr(xs,ys){const mx=sum(xs)/xs.length,my=sum(ys)/ys.length;const num=sum(xs.map((x,i)=>(x-mx)*(ys[i]-my))),dx=Math.sqrt(sum(xs.map(x=>(x-mx)**2))),dy=Math.sqrt(sum(ys.map(y=>(y-my)**2)));return dx&&dy?Number((num/dx/dy).toFixed(3)):null;}
const testable=[0,1,4,5,6,7], styleMatrix=POLICIES.map(p=>testable.map(i=>p.style[i])), styleRank=matrixRank(styleMatrix);
const correlations=[];for(let a=0;a<testable.length;a++)for(let b=a+1;b<testable.length;b++)correlations.push({pair:`S${testable[a]+1}/S${testable[b]+1}`,r:corr(styleMatrix.map(x=>x[a]),styleMatrix.map(x=>x[b]))});
const style=[{testableAxes:"S1,S2,S5,S6,S7,S8",matrixRank:styleRank,conditionNumber:"not meaningful: rank-deficient 8-axis candidate",unsupported:"S3 variance/convexity; S4 lacks executed diversification accounting",redundantWarnings:correlations.filter(x=>Math.abs(x.r||0)>.55).map(x=>`${x.pair}:${x.r}`).join(" | ")||"none"}];

function greedySetCover(rows,targets){const remaining=new Set(targets),chosen=[];while(remaining.size){let best=null,bestSet=[];for(const row of rows){const cover=[...row.realised].filter(x=>remaining.has(x));if(cover.length>bestSet.length){best=row;bestSet=cover;}}if(!bestSet.length)break;chosen.push(`${best.config.policy}/${best.config.horizon}w demand=${best.config.demand} supply=${best.config.supply} cap=${best.config.capacity}${best.config.remove?` remove=${best.config.remove}`:""}`);bestSet.forEach(x=>remaining.delete(x));rows=rows.filter(x=>x!==best);}return{chosen,uncovered:[...remaining]};}
const targets=new Set(all.flatMap(t=>[...t.realised]));const cover=greedySetCover([...all],targets);
const unrealisedImplemented=activeCases.filter(c=>!targets.has(c.id)).map(c=>c.id);
const completionistCovered=new Set(trajectories.filter(t=>t.config.policy==="P8").flatMap(t=>[...t.realised]));
const setCover=[{minimumTrajectoryCount:cover.chosen.length,trajectories:cover.chosen.join(" | "),coveredTargets:[...targets].join("|"),reachableButNotRealised:unrealisedImplemented.join("|"),brittleTargets:[...targets].filter(id=>all.filter(t=>t.realised.has(id)).length===1).join("|")||"none",blockedByMissingSystem:[...missingSystem].join("|"),completionistEstimatedRuns:[...targets].every(id=>completionistCovered.has(id))?1:"> sampled runs; event-capacity case requires a distinct event trajectory"}];

const cases=caseLedger(),teaching=teachingTable(),process=processTable();
console.log("CASE LEDGER");console.table(cases);
console.log("TEACHING COVERAGE");console.table(teaching);
console.log("PROCESS COVERAGE");console.table(process);
console.log("ACTION BUDGET");console.table(actionTable);
console.log("ECONOMIC HEALTH");console.table(economic);
console.log("BACKGROUND ECONOMY");console.table(background);
console.log("ACTOR REMOVAL");console.table(removals);
console.log("STYLE CONTROLLABILITY");console.table(style);console.log("STYLE CORRELATIONS");console.table(correlations);
console.log("SET COVER");console.table(setCover);
console.log("PARAMETER SUPPORT");console.table([{axis:"action budget",support:"3/4; 5 reports runtime cap"},{axis:"opportunities",support:"observed, not injected"},{axis:"background demand/supply",support:"low/baseline/high and finite lots"},{axis:"actor availability",support:"Joel/Wong diagnostic removal"},{axis:"Bar capacity",support:"4/5/6"},{axis:"Bar demand",support:"low/baseline/event"},{axis:"spoilage",support:"low/current/high diagnostic schedule"},{axis:"Juan credit",support:"tight/current/loose"},{axis:"claim maturity",support:"NOT_PARAMETERISED"}]);

// Accounting regression gates are assertions, not case scores.
assert(baseline.game.settlementFloat===0&&baseline.game.clearingBatches.every(b=>b.reconciled&&b.settlementFloat===0));
assert(baseline.diag.compostRecoveryValue < baseline.diag.spoilage*.25);
assert(removals.find(r=>r.name==="Joel removed").barState==="closed");
assert(setCover[0].blockedByMissingSystem.includes("C9"));
console.log("Integrated case diagnostic passed accounting gates.");
