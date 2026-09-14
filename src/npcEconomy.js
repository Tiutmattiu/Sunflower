const SOURCE_ORDER=['UNKNOWN','SOURCE_LOCATED','LOCALLY_AVAILABLE','ESTABLISHED'];
const WONG_STAGE_ORDER=['counter','storage','laundry','frontage'];

export const WONG_ASSETS=Object.freeze({
 storage_racks:Object.freeze({stage:'storage',cost:8,residualValue:4,capacity:2,operatingCost:1,label:'Storage racks'}),
 laundry_machine:Object.freeze({stage:'laundry',cost:14,residualValue:7,capacity:3,operatingCost:2,label:'Laundry machine'}),
 expanded_frontage:Object.freeze({stage:'frontage',cost:18,residualValue:10,capacity:4,operatingCost:2,label:'Expanded shop frontage'}),
});

export const JUAN_CROP_PROFILES=Object.freeze({
 lime_tree:Object.freeze({maturityDays:8,inputCost:2,inputInterval:4,baseYield:2,weatherSensitivity:.12,failureRisk:.08,earlySaleFraction:.45,matureValue:14}),
 mint:Object.freeze({maturityDays:4,inputCost:1,inputInterval:3,baseYield:2,weatherSensitivity:.03,failureRisk:.03,earlySaleFraction:.68,matureValue:6}),
 basil:Object.freeze({maturityDays:5,inputCost:1,inputInterval:3,baseYield:2,weatherSensitivity:.05,failureRisk:.05,earlySaleFraction:.62,matureValue:6}),
 tomato:Object.freeze({maturityDays:6,inputCost:2,inputInterval:4,baseYield:3,weatherSensitivity:.10,failureRisk:.10,earlySaleFraction:.50,matureValue:12}),
 lemongrass:Object.freeze({maturityDays:6,inputCost:1,inputInterval:4,baseYield:2,weatherSensitivity:.04,failureRisk:.04,earlySaleFraction:.66,matureValue:8}),
});

function reservedUnitIds(w){return new Set((w.market?.reservations||[]).filter(r=>r.kind==='unit').map(r=>r.unitId));}
function reservedCash(w,id){return (w.market?.reservations||[]).filter(r=>r.actorId===id&&r.kind==='cash').reduce((n,r)=>n+(r.amount||0),0);}
function freeCash(w,id){return Math.max(0,(w.actors[id]?.cash||0)-reservedCash(w,id));}
function unitOwner(w,unitId){for(const actor of Object.values(w.actors||{})){const unit=actor.inventory?.find(u=>u.unitId===unitId);if(unit)return {actor,unit};}return null;}
function livingAssetOwner(w,assetId){const asset=(w.livingAssets||[]).find(a=>a.id===assetId);return asset?{ownerId:asset.ownerId,asset}:null;}
function emit(w,type,data={}){const row={id:`ev${++w.nextEvent}`,day:w.day,type,...data};w.evidence??=[];w.evidence.push(row);return row;}
function tx(w,kind,from,to,amount,purpose){w.privateTransactions??=[];w.privateTransactions.push({day:w.day,kind,from,to,amount,purpose});}
function transferCash(w,from,to,amount,kind,purpose){
 if(amount<=0)return 0;
 const paid=Math.min(amount,freeCash(w,from));
 if(paid<=0)return 0;
 w.actors[from].cash-=paid;w.actors[to].cash+=paid;tx(w,kind,from,to,paid,purpose);return paid;
}
function ensureWongBusiness(w){
 const legacy=w.wongBusiness||{};
 const defaults={stage:'counter',fixedAssets:[],serviceCapacity:Number.isFinite(legacy.capacity)?legacy.capacity:3,dailyRevenue:0,dailyCost:Number.isFinite(legacy.operatingCost)?legacy.operatingCost:1,baseOperatingCost:Number.isFinite(legacy.operatingCost)?legacy.operatingCost:1,rentAmount:2,rentDueDay:3,rentCadence:5,landlordId:'dima',rentArrears:0,operatingArrears:0,expansionHistory:[],serviceHistory:[],lastRunDay:null};
 w.wongBusiness=legacy;
 for(const [key,value] of Object.entries(defaults))if(w.wongBusiness[key]===undefined)w.wongBusiness[key]=Array.isArray(value)?[]:value;
 w.wongBusiness.fixedAssets??=[];w.wongBusiness.expansionHistory??=[];w.wongBusiness.serviceHistory??=[];w.wongBusiness.stored??=[];
 return w.wongBusiness;
}
function stageFromAssets(b){
 let best=0;
 for(const held of b.fixedAssets){const config=WONG_ASSETS[held.assetId];if(config)best=Math.max(best,WONG_STAGE_ORDER.indexOf(config.stage));}
 b.stage=WONG_STAGE_ORDER[Math.max(0,best)];
 b.serviceCapacity=3+b.fixedAssets.reduce((n,a)=>n+(WONG_ASSETS[a.assetId]?.capacity||0),0);
 b.dailyCost=b.baseOperatingCost+b.fixedAssets.reduce((n,a)=>n+(WONG_ASSETS[a.assetId]?.operatingCost||0),0);
 b.capacity=b.serviceCapacity;b.operatingCost=b.dailyCost;
 return b;
}
function riskRoll(w,assetId){let h=(Number(w.seed||0)^Math.imul((w.day||0)+11,2654435761))>>>0;for(const c of String(assetId))h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;h^=h>>>16;return (h>>>0)/4294967296;}

export function initializeNpcEconomy(w){
 w.npcEconomy??={securedClaims:[],sourceEvents:[],enterpriseEvents:[],futureOutputAssignments:[],cropEvents:[],version:2};
 w.npcEconomy.securedClaims??=[];w.npcEconomy.sourceEvents??=[];w.npcEconomy.enterpriseEvents??=[];w.npcEconomy.futureOutputAssignments??=[];w.npcEconomy.cropEvents??=[];
 w.sourceBook??={};
 ensureWongBusiness(w);stageFromAssets(w.wongBusiness);
 return w;
}

export function sourceState(w,good){
 initializeNpcEconomy(w);
 if(!w.sourceBook[good])w.sourceBook[good]={good,status:'UNKNOWN',routes:[],discoveries:0,successfulReturns:0,establishedAt:null};
 return w.sourceBook[good];
}

export function recordSourceDiscovery(w,routeId,goods,{returned=false,establishAfter=3}={}){
 initializeNpcEconomy(w);
 for(const good of goods){
  const state=sourceState(w,good);
  if(!state.routes.includes(routeId))state.routes.push(routeId);
  state.discoveries+=1;
  if(SOURCE_ORDER.indexOf(state.status)<1)state.status='SOURCE_LOCATED';
  if(returned){
   state.successfulReturns+=1;
   if(SOURCE_ORDER.indexOf(state.status)<2)state.status='LOCALLY_AVAILABLE';
   if(state.successfulReturns>=establishAfter){state.status='ESTABLISHED';state.establishedAt??=w.day;}
  }
  const event={day:w.day,routeId,good,returned,status:state.status};
  w.npcEconomy.sourceEvents.push(event);
  emit(w,'source_progress',event);
 }
 return w;
}

export function createSecuredClaim(w,{borrowerId,lenderId,collateralUnitId=null,collateralAssetId=null,principal,face,dueDay,purpose='secured_advance'}){
 initializeNpcEconomy(w);
 const borrower=w.actors[borrowerId],lender=w.actors[lenderId];
 if(!borrower||!lender)return {ok:false,reason:'missing counterparty'};
 if(!Number.isFinite(principal)||principal<=0||!Number.isFinite(face)||face<principal)return {ok:false,reason:'invalid secured terms'};
 if(freeCash(w,lenderId)<principal)return {ok:false,reason:'lender lacks free cash'};
 if(Boolean(collateralUnitId)===Boolean(collateralAssetId))return {ok:false,reason:'claim requires exactly one collateral object'};
 const foundUnit=collateralUnitId?unitOwner(w,collateralUnitId):null;
 const foundAsset=collateralAssetId?livingAssetOwner(w,collateralAssetId):null;
 if(foundUnit){
  if(foundUnit.actor.id!==borrowerId)return {ok:false,reason:'borrower does not own collateral'};
  if(reservedUnitIds(w).has(collateralUnitId)||foundUnit.unit.pledgedTo)return {ok:false,reason:'collateral is already committed'};
 }else if(foundAsset){
  if(foundAsset.ownerId!==borrowerId)return {ok:false,reason:'borrower does not own collateral'};
  if(foundAsset.asset.pledgedTo)return {ok:false,reason:'collateral is already committed'};
 }else return {ok:false,reason:'borrower does not own collateral'};
 lender.cash-=principal;borrower.cash+=principal;
 if(foundUnit)foundUnit.unit.pledgedTo=lenderId;else foundAsset.asset.pledgedTo=lenderId;
 const settlementModel=foundUnit?'secured_unit':'secured_living_asset';
 const claim={id:`secured-${++w.nextEvent}`,type:'secured_claim',settlementModel,issuerId:borrowerId,holderId:lenderId,principal,face,originalFace:face,dueDay,collateralUnitId:foundUnit?collateralUnitId:null,collateralAssetId:foundAsset?collateralAssetId:null,status:'open',purpose,createdDay:w.day};
 w.claims.push(claim);w.npcEconomy.securedClaims.push(claim.id);
 tx(w,'secured_advance',lenderId,borrowerId,principal,purpose);
 emit(w,'secured_claim_created',{claimId:claim.id,borrowerId,lenderId,collateralUnitId:claim.collateralUnitId,collateralAssetId:claim.collateralAssetId,principal,face,dueDay,purpose});
 return {ok:true,claimId:claim.id};
}

function releaseCollateral(w,claim){
 if(claim.settlementModel==='secured_living_asset'){
  const found=livingAssetOwner(w,claim.collateralAssetId);if(found?.asset?.pledgedTo===claim.holderId)found.asset.pledgedTo=null;return;
 }
 const found=unitOwner(w,claim.collateralUnitId);if(found?.unit?.pledgedTo===claim.holderId)found.unit.pledgedTo=null;
}
function seizeCollateral(w,claim){
 if(claim.settlementModel==='secured_living_asset'){
  const found=livingAssetOwner(w,claim.collateralAssetId);if(!found)return;
  found.asset.ownerId=claim.holderId;found.asset.pledgedTo=null;return;
 }
 const found=unitOwner(w,claim.collateralUnitId);if(!found)return;
 const lender=w.actors[claim.holderId];if(!lender)return;
 const index=found.actor.inventory.findIndex(u=>u.unitId===claim.collateralUnitId);if(index<0)return;
 const [unit]=found.actor.inventory.splice(index,1);unit.owner=claim.holderId;unit.pledgedTo=null;lender.inventory.push(unit);
}

export function settleSecuredClaims(w){
 initializeNpcEconomy(w);
 for(const claim of w.claims.filter(c=>['secured_unit','secured_living_asset'].includes(c.settlementModel)&&c.status==='open'&&c.dueDay<=w.day)){
  const borrower=w.actors[claim.issuerId],lender=w.actors[claim.holderId];if(!borrower||!lender)continue;
  if(freeCash(w,claim.issuerId)>=claim.face){
   borrower.cash-=claim.face;lender.cash+=claim.face;claim.paid=claim.face;claim.status='settled';releaseCollateral(w,claim);
   tx(w,'secured_repayment',claim.issuerId,claim.holderId,claim.face,claim.purpose);
   emit(w,'secured_claim_settled',{claimId:claim.id,amount:claim.face});
  }else{
   claim.paid=0;claim.status='default';seizeCollateral(w,claim);
   emit(w,'secured_claim_default',{claimId:claim.id,collateralUnitId:claim.collateralUnitId,collateralAssetId:claim.collateralAssetId});
  }
 }
 return w;
}

export function investWongAsset(w,assetId,{financierId=null}={}){
 initializeNpcEconomy(w);
 const b=w.wongBusiness,config=WONG_ASSETS[assetId];
 if(!config)return {ok:false,reason:'unknown productive asset'};
 if(b.fixedAssets.some(a=>a.assetId===assetId))return {ok:false,reason:'asset already installed'};
 if(freeCash(w,'wong')<config.cost)return {ok:false,reason:'Wong lacks working capital'};
 const supplier=w.actors.wharf_suppliers?'wharf_suppliers':w.actors.crews?'crews':null;
 if(!supplier)return {ok:false,reason:'no equipment supplier exists'};
 w.actors.wong.cash-=config.cost;w.actors[supplier].cash+=config.cost;
 tx(w,'productive_asset_purchase','wong',supplier,config.cost,assetId);
 const asset={id:`wong-asset-${++w.nextEvent}`,assetId,ownerId:'wong',purchasedDay:w.day,cost:config.cost,residualValue:config.residualValue,financierId,status:'operating'};
 b.fixedAssets.push(asset);b.expansionHistory.push({day:w.day,assetId,cost:config.cost,financierId});stageFromAssets(b);
 w.npcEconomy.enterpriseEvents.push({day:w.day,type:'wong_asset_installed',assetId,cost:config.cost,financierId});
 emit(w,'wong_asset_installed',{assetId,cost:config.cost,financierId,stage:b.stage,serviceCapacity:b.serviceCapacity});
 return {ok:true,assetId:asset.id};
}

export function financeWongAsset(w,assetId,financierId='dima'){
 initializeNpcEconomy(w);
 const config=WONG_ASSETS[assetId],lender=w.actors[financierId];
 if(!config)return {ok:false,reason:'unknown productive asset'};
 if(w.wongBusiness.fixedAssets.some(a=>a.assetId===assetId))return {ok:false,reason:'asset already installed'};
 if(!lender||freeCash(w,financierId)<config.cost)return {ok:false,reason:'financier lacks free cash'};
 lender.cash-=config.cost;w.actors.wong.cash+=config.cost;
 tx(w,'productive_asset_advance',financierId,'wong',config.cost,assetId);
 const bought=investWongAsset(w,assetId,{financierId});
 if(!bought.ok){lender.cash+=config.cost;w.actors.wong.cash-=config.cost;return bought;}
 const face=config.cost+Math.max(2,Math.ceil(config.cost*.2));
 const claim={id:`wong-finance-${++w.nextEvent}`,type:'productive_asset_finance',settlementModel:'business_revenue_share',issuerId:'wong',holderId:financierId,principal:config.cost,face,originalFace:face,balance:face,dueDay:w.day+12,collateralAssetId:bought.assetId,revenueShare:.25,status:'open',purpose:`finance_${assetId}`,createdDay:w.day};
 w.claims.push(claim);w.npcEconomy.enterpriseEvents.push({day:w.day,type:'wong_equipment_financed',assetId,claimId:claim.id,financierId,principal:config.cost,face});
 emit(w,'wong_equipment_financed',{assetId,claimId:claim.id,financierId,principal:config.cost,face});
 return {ok:true,assetId:bought.assetId,claimId:claim.id};
}

function createRentArrears(w,amount){
 if(amount<=0)return null;
 const b=w.wongBusiness;b.rentArrears+=amount;
 const claim={id:`wong-rent-${w.day}-${++w.nextEvent}`,type:'rent_arrears',issuerId:'wong',holderId:b.landlordId,face:amount,originalFace:amount,dueDay:w.day+b.rentCadence,status:'open',purpose:'shop_rent',createdDay:w.day};
 w.claims.push(claim);emit(w,'wong_rent_arrears',{claimId:claim.id,amount,landlordId:b.landlordId});return claim;
}
function serviceDemand(w,b,forceDemand){
 if(Number.isFinite(forceDemand))return Math.max(0,Math.min(b.serviceCapacity,Math.floor(forceDemand)));
 return Math.min(b.serviceCapacity,1+((Number(w.seed||0)+w.day+b.fixedAssets.length)%Math.max(1,b.serviceCapacity)));
}
function repayWongBusinessFinance(w,revenue){
 if(revenue<=0)return 0;
 let total=0;
 for(const claim of w.claims.filter(c=>c.type==='productive_asset_finance'&&c.issuerId==='wong'&&c.status==='open')){
  const target=Math.min(claim.balance,Math.max(1,Math.floor(revenue*(claim.revenueShare||.25))));
  const paid=transferCash(w,'wong',claim.holderId,target,'productive_asset_repayment',claim.purpose);
  claim.balance-=paid;claim.paid=(claim.paid||0)+paid;total+=paid;
  if(claim.balance<=0){claim.balance=0;claim.status='settled';emit(w,'wong_equipment_finance_settled',{claimId:claim.id,amount:claim.paid});}
 }
 return total;
}

export function runWongBusinessDay(w,{forceDemand=null,skipRent=false}={}){
 initializeNpcEconomy(w);
 const b=stageFromAssets(w.wongBusiness);
 if(b.lastRunDay===w.day)return b;
 b.lastRunDay=w.day;b.dailyRevenue=0;b.dailyCost=b.baseOperatingCost+b.fixedAssets.reduce((n,a)=>n+(WONG_ASSETS[a.assetId]?.operatingCost||0),0);b.operatingCost=b.dailyCost;
 const demand=serviceDemand(w,b,forceDemand),price=1;
 const affordable=Math.min(demand,Math.floor(freeCash(w,'households')/price));
 const revenue=transferCash(w,'households','wong',affordable*price,'wong_service_payment',b.stage);
 b.dailyRevenue=revenue;
 const costPaid=transferCash(w,'wong','crews',b.dailyCost,'wong_operating_cost',b.stage);
 if(costPaid<b.dailyCost)b.operatingArrears+=b.dailyCost-costPaid;
 let rentPaid=0;
 if(!skipRent&&w.day>=b.rentDueDay){
  rentPaid=transferCash(w,'wong',b.landlordId,b.rentAmount,'shop_rent','wong_shop');
  if(rentPaid<b.rentAmount)createRentArrears(w,b.rentAmount-rentPaid);
  b.rentDueDay+=b.rentCadence;
 }
 const financePaid=repayWongBusinessFinance(w,revenue);
 const row={day:w.day,stage:b.stage,demand,served:affordable,revenue,cost:b.dailyCost,costPaid,rentPaid,financePaid,cash:w.actors.wong.cash};
 b.serviceHistory.push(row);w.npcEconomy.enterpriseEvents.push({type:'wong_business_day',...row});
 emit(w,'wong_business_day',row);return b;
}

export function applyJuanCropEconomicsDay(w,{chargeInputs=true,applyFailureRoll=true}={}){
 initializeNpcEconomy(w);
 for(const asset of w.livingAssets.filter(a=>a.ownerId==='juan'&&JUAN_CROP_PROFILES[a.species])){
  const profile=JUAN_CROP_PROFILES[asset.species];
  asset.economicProfile=asset.species;asset.inputSpent??=0;asset.inputShortfall??=0;asset.riskEvents??=0;
  const weatherStress=w.weather==='storm'?profile.weatherSensitivity:profile.weatherSensitivity*.15;
  asset.health=Math.max(.2,asset.health-weatherStress);
  if(applyFailureRoll&&riskRoll(w,asset.id)<profile.failureRisk*(w.weather==='storm'?1.5:.5)){
   asset.health=Math.max(.2,asset.health-.12);asset.riskEvents++;
   w.npcEconomy.cropEvents.push({day:w.day,type:'crop_risk',assetId:asset.id,species:asset.species,weather:w.weather});
   emit(w,'juan_crop_risk',{assetId:asset.id,species:asset.species,weather:w.weather});
  }
  if(chargeInputs&&w.day>0&&w.day%profile.inputInterval===0){
   const paid=transferCash(w,'juan','wharf_suppliers',profile.inputCost,'cultivation_input',asset.species);
   asset.inputSpent+=paid;
   if(paid<profile.inputCost){asset.inputShortfall+=profile.inputCost-paid;asset.health=Math.max(.2,asset.health-.08);}
   w.npcEconomy.cropEvents.push({day:w.day,type:'crop_input',assetId:asset.id,species:asset.species,cost:profile.inputCost,paid});
  }
 }
 return w;
}

export function earlySellLivingAsset(w,assetId,buyerId){
 initializeNpcEconomy(w);
 const asset=w.livingAssets.find(a=>a.id===assetId),profile=asset&&JUAN_CROP_PROFILES[asset.species],buyer=w.actors[buyerId];
 if(!asset||asset.ownerId!=='juan'||!profile)return {ok:false,reason:'Juan does not own that productive asset'};
 if(asset.pledgedTo)return {ok:false,reason:'living asset is pledged'};
 if(!buyer)return {ok:false,reason:'buyer missing'};
 if(w.npcEconomy.futureOutputAssignments.some(a=>a.assetId===assetId&&a.status==='open'))return {ok:false,reason:'future output is already assigned'};
 const price=Math.max(1,Math.floor(profile.matureValue*profile.earlySaleFraction*Math.max(.5,asset.health)));
 if(freeCash(w,buyerId)<price)return {ok:false,reason:'buyer lacks cash'};
 buyer.cash-=price;w.actors.juan.cash+=price;asset.ownerId=buyerId;
 tx(w,'living_asset_distress_sale',buyerId,'juan',price,assetId);
 w.npcEconomy.cropEvents.push({day:w.day,type:'living_asset_early_sale',assetId,buyerId,price});
 emit(w,'living_asset_early_sale',{assetId,buyerId,price,species:asset.species});
 return {ok:true,price};
}

export function assignFutureOutput(w,assetId,buyerId,{cashNow,share=.5}={}){
 initializeNpcEconomy(w);
 const asset=w.livingAssets.find(a=>a.id===assetId),buyer=w.actors[buyerId];
 if(!asset||asset.ownerId!=='juan')return {ok:false,reason:'Juan does not own that productive asset'};
 if(asset.pledgedTo)return {ok:false,reason:'living asset is pledged'};
 if(!buyer||!Number.isFinite(cashNow)||cashNow<=0||!(share>0&&share<=1))return {ok:false,reason:'invalid output assignment terms'};
 if(w.npcEconomy.futureOutputAssignments.some(a=>a.assetId===assetId&&a.status==='open'))return {ok:false,reason:'future output already assigned'};
 if(freeCash(w,buyerId)<cashNow)return {ok:false,reason:'buyer lacks cash'};
 buyer.cash-=cashNow;w.actors.juan.cash+=cashNow;
 const assignment={id:`output-share-${++w.nextEvent}`,assetId,species:asset.species,sellerId:'juan',buyerId,cashNow,share,status:'open',createdDay:w.day,lastSettlementDay:null,remainingHarvests:1};
 w.npcEconomy.futureOutputAssignments.push(assignment);tx(w,'future_output_advance',buyerId,'juan',cashNow,assetId);
 emit(w,'future_output_assigned',{assignmentId:assignment.id,assetId,buyerId,cashNow,share});
 return {ok:true,assignmentId:assignment.id};
}

export function settleFutureOutputAssignment(w,assignmentId,grossValue){
 initializeNpcEconomy(w);
 const assignment=w.npcEconomy.futureOutputAssignments.find(a=>a.id===assignmentId);
 if(!assignment||assignment.status!=='open')return {ok:false,reason:'no open output assignment'};
 if(assignment.lastSettlementDay===w.day)return {ok:false,reason:'this harvest is already settled'};
 if(!Number.isFinite(grossValue)||grossValue<=0)return {ok:false,reason:'invalid realised harvest value'};
 const amount=Math.max(1,Math.floor(grossValue*assignment.share));
 if(freeCash(w,assignment.sellerId)<amount)return {ok:false,reason:'harvest proceeds are not yet liquid'};
 w.actors[assignment.sellerId].cash-=amount;w.actors[assignment.buyerId].cash+=amount;
 assignment.lastSettlementDay=w.day;assignment.remainingHarvests--;assignment.settledAmount=(assignment.settledAmount||0)+amount;
 if(assignment.remainingHarvests<=0)assignment.status='settled';
 tx(w,'future_output_share',assignment.sellerId,assignment.buyerId,amount,assignment.assetId);
 emit(w,'future_output_share_settled',{assignmentId,assetId:assignment.assetId,amount,grossValue});
 return {ok:true,amount};
}

export function npcEconomyDay(w){initializeNpcEconomy(w);runWongBusinessDay(w);applyJuanCropEconomicsDay(w);settleSecuredClaims(w);return w;}