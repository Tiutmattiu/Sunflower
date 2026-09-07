import assert from "node:assert/strict";
import { createGame, resolveNoonMarket } from "../src/gameEngine.js";
import { createBarState, ingredientCarrying, produceDrink, syncBarInventory } from "../src/barEconomy.js";
import { visibleSellListings } from "../src/npcAI.js";
import { ITEMS } from "../src/gameData.js";

const accessibleWealth = (game) => game.traders.joel.sardines + game.traders.joel.inventory.reduce((sum,item)=>sum+Number(ITEMS[item]?.value||0),0) + Object.keys(game.bar.servings).reduce((sum,item)=>sum+ingredientCarrying(game,item).remainingCarryingValue,0);

let game=createGame(); game.traders.joel.inventory=game.traders.joel.inventory.filter(item=>!["Soda","Cucumber","Lime Crate"].includes(item)); game.bar=createBarState(1);
game.traders.joel.inventory.push("Soda","Cucumber","Lime Crate"); syncBarInventory(game);
const initial={...ingredientCarrying(game,"Cucumber"),accessibleWealth:accessibleWealth(game)}; assert.equal(initial.remainingCarryingValue,4); assert.equal(initial.resaleEligible,true);
for(let i=0;i<3;i++) assert(produceDrink(game,"Cucumber Highball"));
const partial={...ingredientCarrying(game,"Cucumber"),accessibleWealth:accessibleWealth(game)}; assert.equal(partial.servingsRemaining,3); assert.equal(partial.remainingCarryingValue,2); assert.equal(partial.resaleEligible,false); assert(partial.accessibleWealth < initial.accessibleWealth); assert(!visibleSellListings(game).some(row=>row.sellerId==="joel"&&row.item==="Cucumber"));
game.marketPlan=[{from:"aspen",to:"joel",wantItem:"Cucumber",offerItem:null,sardines:20}]; game.phase="noon"; game.marketResolved=false; game.lockedPlayerOrders=[]; game=resolveNoonMarket(game); assert(!game.history.some(row=>row.item==="Cucumber"),"opened unit cannot clear as unopened");
for(let i=0;i<3;i++) assert(produceDrink(game,"Cucumber Highball")); const empty={...ingredientCarrying(game,"Cucumber"),accessibleWealth:accessibleWealth(game)}; assert.equal(empty.servingsRemaining,0); assert.equal(empty.remainingCarryingValue,0); assert(empty.accessibleWealth < partial.accessibleWealth);
console.table([initial,partial,empty]); console.log("Partial-serving accounting smoke passed.");
