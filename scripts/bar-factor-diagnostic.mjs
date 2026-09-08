import { buildEvents, createGame, resolveNoonMarket } from "../src/gameEngine.js";
import { BAR_INGREDIENTS, barDiagnostics, createBarState, settleBarService, syncBarInventory } from "../src/barEconomy.js";

const demand=(count=3)=>Array.from({length:count},(_,i)=>({source:i%2?"external_visitor":"background_local",style:i%3===0?"fruity":"balanced",extra:i%3===1?"spicy":"herbal",base:i%2?"alcoholic":"non_alcoholic",budget:20}));
function abundant(game){ for(const name of Object.keys(BAR_INGREDIENTS)) game.traders.joel.inventory.push(name,name); syncBarInventory(game); }
function run(name,setup){ const game=createGame(); setup(game); const cash=game.traders.joel?.sardines||0, receivable=game.bar.receivables; settleBarService(game); const row=game.bar.serviceWindows.at(-1); return {name,arrivals:row.arrivals,served:row.served,unserved:row.unserved,reasons:JSON.stringify(row.unservedByReason),capacity:row.capacity,capacityUsed:row.capacityUsed,revenue:row.localRevenue+row.externalRevenue+row.tabs,localRevenue:row.localRevenue,externalRevenue:row.externalRevenue,procurement:row.procurementCost,procurementSource:row.procurement.map(p=>p.source).join("|"),failedProcurement:row.failedProcurement.map(p=>p.reason).join("|"),spoilage:Number(row.spoilage.toFixed(2)),scrap:row.organicScrap,scrapProcessed:row.scrapProcessed,scrapRemaining:row.scrapUnprocessed,cashChange:(game.traders.joel?.sardines||0)-cash,receivableChange:game.bar.receivables-receivable}; }

const rows=[
  run("A abundant normal",g=>{abundant(g);g.bar.demandOverride=demand(3)}),
  run("B current normal",g=>{g.bar.demandOverride=demand(3)}),
  run("C abundant event",g=>{abundant(g);g.bar.demandOverride=demand(8)}),
  run("D critical Soda removed",g=>{g.traders.joel.inventory=g.traders.joel.inventory.filter(i=>i!=="Soda");g.bar=createBarState(1);syncBarInventory(g);g.backgroundEconomy.barSupplyLots=[];g.bar.demandOverride=demand(3)}),
  run("E replenishment",g=>{g.traders.joel.inventory=g.traders.joel.inventory.filter(i=>!["Soda","Cucumber","Lime Crate"].includes(i));g.bar=createBarState(1);syncBarInventory(g);g.bar.demandOverride=[{source:"background_local",style:"dry",extra:"herbal",base:"non_alcoholic",budget:20}]}),
  run("F Joel absent",g=>{delete g.traders.joel;g.bar.demandOverride=demand(3)}),
];
console.log("BAR FACTOR TABLE"); console.table(rows);

let original=createGame(); for(let day=1;day<=14;day++){original.day=day;original.bar.demandOverride=null;settleBarService(original);} console.log("14-WINDOW CAUSE TABLE"); console.table([barDiagnostics(original)]);
console.log("UNSERVED REASONS"); console.table(Object.entries(barDiagnostics(original).unservedByReason).map(([reason,count])=>({reason,count})));
console.log("DEMAND SOURCES"); console.table(Object.entries(barDiagnostics(original).arrivalsBySource).map(([source,arrivals])=>({source,arrivals,served:barDiagnostics(original).servedBySource[source]||0})));
let resilience=createGame();delete resilience.traders.joel;resilience.marketPlan=[{from:"aspen",to:"octopus",wantItem:"Fresh Mackerel",offerItem:null,sardines:20}];resilience.phase="noon";resilience.marketResolved=false;resilience.lockedPlayerOrders=[];resilience=resolveNoonMarket(resilience);resilience.traders.player.sardines=70;resilience.traders.player.inventory.push("Blue Glass Marble");resilience.worldThreads.valeScreening.stage="aftermath";
console.log("RESILIENCE / CLEARING");console.table([{barOpen:false,harbourTrades:resilience.history.length,auctionReachable:buildEvents(resilience).some(e=>e.id==="auction"),clearingThroughput:resilience.clearingBatches.reduce((n,b)=>n+b.settledTransfers.length,0),octopusPersonalVolume:resilience.history.filter(t=>t.from==="octopus"||t.to==="octopus").length,octopusInventory:resilience.traders.octopus.inventory.join("|"),backgroundMarineThroughput:resilience.history.filter(t=>t.source==="background-marine").length,settlementFloat:resilience.settlementFloat,reconciled:resilience.clearingBatches.every(b=>b.reconciled&&b.settlementFloat===0)}]);

console.log("ACTIVE INGREDIENT USE");console.table(Object.keys(BAR_INGREDIENTS).map(ingredient=>{const uses=original.bar.ingredientTransactions.filter(t=>t.ingredient===ingredient&&t.kind==="bar_use");const receipts=original.bar.ingredientTransactions.filter(t=>t.ingredient===ingredient&&t.kind==="stock_received");return{ingredient,barUses:uses.length,nonBarUse:"BAR_ONLY_IN_THIS_SLICE",source:receipts.length?"initial stock / recorded lot":"none",sink:uses.length?"drink serving":"unused/spoilage",transactionUseCount:uses.length+receipts.length};}));
