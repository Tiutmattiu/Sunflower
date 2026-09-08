import React, { useEffect, useMemo, useState } from "react";
import { LOCATIONS, performPlayerAction, visibleActions, visitLocation } from "./playerGame.js";
import { ECONOMIC_GOODS as GOODS } from "./economicContent.js";
import { diagnosePlayer } from "./playerDiagnosis.js";
import { SceneStage } from "./SceneStage.jsx";
import { ConsequenceStrip } from "./ConsequenceStrip.jsx";
import "./index.css";
import { FORMS, ITEMS, PHASE_COPY, SARDINE } from "./gameData";
import {
  acceptInboundOffer,
  acceptJuanBuyback,
  acceptFutureDelivery,
  applyLateOrderEdit,
  advancePhase,
  canAccessVenue,
  createGame,
  buyJuanClaim,
  currentObligations,
  declineInboundOffer,
  duePrivateMatters,
  fulfillFutureDelivery,
  futureDeliveryAvailable,
  giveItem,
  informationBuyers,
  informationPrice,
  knownItemsForTrader,
  performFreeAction,
  repayObligation,
  requestRelationshipLoan,
  requestSecuredLoan,
  requestMarketProxy,
  resistSunMoment,
  resetOrders,
  resolveEvent,
  resolveDuePrivateMatter,
  resolveNoonMarket,
  sellInformation,
  sellInformationExclusive,
  securedCollateralItems,
  shareInformationAsFavor,
} from "./gameEngine";
import { visibleMarketBoard, visibleSellListings } from "./npcAI";
import { ACTIVE_REAL_MENU, ACTIVE_SUPPORT, buildDrinkPropositions, usableServings } from "./barEconomy";
import { advanceHarbourWindow, availableCash, createHarbourWorld, meetContact, phoneContact, placePublicOrder, sceneSnapshot } from "./harbourSpine";

const SAVE_KEY = "sunflower-living-market-v8";
const SAVE_VERSION = 8;
const PHASES = ["sunrise", "morning", "noon", "afternoon", "sunset"];

function loadGame() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVE_KEY) || "null");
    if (parsed?.version === SAVE_VERSION && parsed?.game?.traders?.player) return parsed.game;
  } catch {
    // Local persistence is convenience only.
  }
  return createGame();
}

function label(item) {
  return item ? `${ITEMS[item]?.icon || "□"} ${item}` : "nothing";
}

function BarPanel({ game }) {
  const bar = game.bar;
  if (!bar) return null;
  const last = bar.serviceWindows.at(-1);
  const propositions = buildDrinkPropositions(game);
  return <details className="card bar-board" open>
    <summary className="section-title">WHAT WE HAVE TONIGHT · Joel's Bar</summary>
    <p><strong>{bar.open ? "OPEN" : "CLOSED — Joel is absent; no drinks are produced."}</strong></p>
    <div className="bar-columns">
      <div><strong>Real-menu active</strong><div className="chips">{ACTIVE_REAL_MENU.map((name) => <span className="chip" key={name}>{name} · {usableServings(game, name)}</span>)}</div></div>
      <div><strong>Sunflower support</strong><div className="chips">{ACTIVE_SUPPORT.map((name) => <span className="chip" key={name}>{name} · {usableServings(game, name)}</span>)}</div></div>
    </div>
    <p className="small muted">Directions: fruity · spirit-forward · dry · sweet · balanced; optionally sour · smoky · savoury · spicy · surprise me. Stock numbers are servings, not hidden customer truth.</p>
    <div className="stack">{propositions.map((drink) => <div className="mini-card" key={drink.name}><strong>{drink.name}</strong> · {drink.style} · {drink.base.replace("_", "-")}<br/><span className="small muted">{drink.ingredients.join(" + ")}</span></div>)}</div>
    <p><strong>Public lead:</strong> {bar.publicSignal}</p>
    {last && <p className="small">Last service: {last.served}/{last.arrivals} served · {last.unserved} unserved · local {last.localRevenue}🥫 · visitors {last.externalRevenue}🥫 · tabs {last.tabs}🥫.</p>}
  </details>;
}

function publicListings(game) {
  return visibleSellListings(game);
}

function relationshipWord(value) {
  if (value <= 0) return "stranger";
  if (value === 1) return "recognises you";
  if (value === 2) return "familiar";
  return "knows you well";
}

function InboundOffers({ game, onAccept, onDecline }) {
  const pending = (game.inboundOffers || []).filter((offer) => offer.day === game.day && offer.phase === game.phase && offer.status === "pending");
  if (!pending.length) return null;
  return (
    <section className="card">
      <div className="section-title">Someone came to you</div>
      <div className="stack">
        {pending.map((offer) => (
          <div className="mini-card" key={offer.id}>
            <strong>{game.traders[offer.buyerId]?.name}</strong>
            <p>{offer.kind === "buy-item" ? `${offer.price}🥫 for your ${label(offer.item)}.` : `${offer.price}🥫 for one of your leads.`}</p>
            <div className="small muted">Reason visible to you: {offer.reason}.</div>
            <div className="inline-actions">
              <button className="btn gold" onClick={() => onAccept(offer.id)}>Accept</button>
              <button className="btn ghost" onClick={() => onDecline(offer.id)}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LearnPanel({ game, selectedId, setSelectedId, onTalk, onInvestigate, onGift, onSellInfo, onSellExclusive, onShareInfo, onRepay, onProxy, onFuture, onFulfillFuture, onRelationshipLoan, onSecuredLoan, onBuyClaim, onBuyback }) {
  const people = ["aspen", "joel", "yasmin", "wong", "juan", "dima", "octopus"].map((id) => game.traders[id]).filter(Boolean);
  const target = game.traders[selectedId] || people[0];
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0;
  const info = [...(game.information || [])].reverse();
  const obligations = currentObligations(game).filter((entry) => entry.creditorId === target.id);
  const knownFacts = info.filter((note) => note.subjectId === target.id);
  const holdings = knownItemsForTrader(game, target.id);
  const collateral = target.id === "yasmin" ? securedCollateralItems(game) : [];
  const claimsForSale = game.claims.filter((claim) => claim.status === "open" && claim.knownByPlayer && claim.currentHolderId === target.id);
  const playerClaims = game.claims.filter((claim) => claim.status === "open" && claim.knownByPlayer && claim.currentHolderId === "player");
  const sellableInfo = info.filter((note) => informationBuyers(game, note).includes(target.id) && !(note.knownBy || []).includes(target.id));

  return (
    <section className="focus-desk">
      <div className="avatar-row" role="list" aria-label="People in the harbour">
        {people.map((person) => <button type="button" role="listitem" className={`avatar ${person.id === "octopus" ? "supporting" : ""} ${person.id === target.id ? "selected" : ""}`} key={person.id} onClick={() => setSelectedId(person.id)} aria-pressed={person.id === target.id}>
          <span className="avatar-icon" aria-hidden="true">{person.icon}</span><span className="avatar-name">{person.name}</span>
        </button>)}
      </div>
      <section className="card detail-card" data-portrait-id={target.id}>
        <div className="detail-head"><div className="big-icon" aria-hidden="true">{target.icon}</div><div className="detail-copy"><h2>{target.name}</h2><div>{target.role}</div><span className="tag">{relationshipWord(game.relationships[target.id] || 0)}</span></div></div>
        <p className="muted">Known holdings: {holdings.slice(0, 3).map(label).join(", ") || "nothing currently justified"}{holdings.length > 3 ? `, +${holdings.length - 3} more` : ""}.</p>
        <p className="small muted">Saved notes: {knownFacts.length}</p>
        <div className="verb-explainer"><div><strong>Talk</strong><span>Spend time on this person. Only a genuinely new stage can deepen the relationship, at most once per day.</span></div><div><strong>Investigate</strong><span>Spend time on market facts and record where the claim came from.</span></div></div>
        <div className="action-grid">
          <button className="btn" disabled={!active} onClick={() => onTalk(target.id)}>Talk</button>
          <button className="btn" disabled={!active} onClick={() => onInvestigate(target.id)}>Investigate</button>
        </div>
        {game.lastInteraction?.targetId === target.id && <div className={`mini-card interaction-result ${game.lastInteraction.action === "talk" ? "conversation-result" : "investigation-result"}`}><p>{game.lastInteraction.text}{game.lastInteraction.note ? ` — ${game.lastInteraction.note}` : ""}</p>{game.lastInteraction.informationId && <span className="small muted">Saved to Notebook.</span>}</div>}
        <details className="advanced-details">
          <summary>More actions</summary>
          <div className="stack">
            {game.playerState.form === "animal" && ((target.id === "joel" && (game.relationships.joel || 0) >= 2) || target.id === "dima") && <button className="btn" disabled={!active} onClick={() => onProxy(target.id)}>Use {target.name} as formal-market proxy</button>}
            {target.id === "aspen" && futureDeliveryAvailable(game) && <button className="btn gold" onClick={onFuture}>Promise one Lime Crate</button>}
            {target.id === "joel" && (game.relationships.joel || 0) >= 2 && <button className="btn" disabled={!active || obligations.some((entry) => entry.kind === "relationship-loan")} onClick={onRelationshipLoan}>Ask for a short loan</button>}
            {collateral.map((item) => <button className="btn" disabled={!active} key={item} onClick={() => onSecuredLoan(item)}>Pledge {label(item)}</button>)}
            {claimsForSale.map((claim) => <button className="btn" disabled={!active || game.traders.player.sardines < claim.transferAsk + (target.id === "dima" ? 0 : 1)} key={claim.id} onClick={() => onBuyClaim(claim.id)}>Buy Juan claim · face {claim.faceAmount}🥫 · pay {claim.transferAsk + (target.id === "dima" ? 0 : 1)}🥫</button>)}
            {target.id === "juan" && playerClaims.filter((claim) => claim.dueDay > game.day).map((claim) => <button className="btn" disabled={!active || game.traders.juan.sardines < Math.ceil(claim.faceAmount * .7)} key={claim.id} onClick={() => onBuyback(claim.id)}>Accept Juan buyback · {Math.ceil(claim.faceAmount * .7)}🥫</button>)}
            {sellableInfo.map((note) => { const covenant = currentObligations(game).find((entry) => entry.kind === "information-exclusivity" && entry.infoId === note.id); return <div className="mini-card" key={note.id}><div>{note.text}</div><div className="inline-actions"><button className="btn" disabled={!active} onClick={() => onSellInfo(note.id, target.id)}>{covenant && covenant.creditorId !== target.id ? "Break exclusivity — sell" : "Sell lead"} · {informationPrice(game, note, target.id)}🥫</button>{(note.knownBy || []).length === 1 && <button className="btn" disabled={!active || game.traders[target.id].sardines < informationPrice(game, note, target.id) + 2} onClick={() => onSellExclusive(note.id, target.id)}>Exclusive · {informationPrice(game, note, target.id) + 2}🥫</button>}<button className="btn ghost" disabled={!active} onClick={() => onShareInfo(note.id, target.id)}>Tell as a favour</button></div></div>; })}
            {!!game.traders.player.inventory.length && <div className="chips">{game.traders.player.inventory.map((item, index) => <button className="btn ghost" disabled={!active} key={`${item}-${index}`} onClick={() => onGift(target.id, item)}>Give {label(item)}</button>)}</div>}
            {obligations.map((obligation) => <div className="mini-card" key={obligation.id}><strong>{obligation.note}</strong><div>Due Day {obligation.dueDay}{obligation.amount ? ` · ${obligation.amount}🥫` : ""}</div>{obligation.kind === "future-delivery" ? <button className="btn" disabled={!active || !game.traders.player.inventory.includes(obligation.item)} onClick={() => onFulfillFuture(obligation.id)}>Deliver Lime now</button> : obligation.kind !== "information-exclusivity" && <button className="btn" disabled={!active || game.traders.player.sardines < obligation.amount} onClick={() => onRepay(obligation.id)}>Repay</button>}</div>)}
          </div>
        </details>
      </section>
    </section>
  );
}

function TradePanel({ game, orders, setOrders }) {
  const listings = useMemo(() => publicListings(game), [game]);
  function update(index, patch) {
    const next = [...orders];
    next[index] = { ...next[index], ...patch };
    setOrders(next);
  }
  return (
    <section className="play-flow">
      <section className="card market-card">
        <div className="section-title">Public stalls</div>
        <p className="small muted">These are visible offers. Hidden stock is not shown merely because the engine stores it.</p>
        <div className="stack">
          {listings.map((row) => (
            <div className="mini-card" key={`${row.sellerId}-${row.item}`}>
              <strong>{game.traders[row.sellerId].name}</strong> · {label(row.item)} · ask {row.ask}🥫
              <button className="btn" onClick={() => {
                const slot = orders.findIndex((order) => !order.to || !order.wantItem);
                const index = slot >= 0 ? slot : 0;
                update(index, { to: row.sellerId, wantItem: row.item, sardines: row.ask, offerItem: "" });
              }}>Write this ask onto my sheet</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card order-card">
        <div className="section-title">Your Noon order sheet</div>
        <p className="small muted"><strong>Writing is not trading.</strong> These become binding only when Morning closes.</p>
        {orders.map((order, index) => {
          const known = order.to ? knownItemsForTrader(game, order.to) : [];
          const listing = listings.find((row) => row.sellerId === order.to && row.item === order.wantItem);
          return (
            <div className="order-box" key={index}>
              <strong>Order {index + 1}</strong>
              <select value={order.to} onChange={(event) => update(index, { to: event.target.value, wantItem: "" })}>
                <option value="">Seller</option>
                {Object.values(game.traders).filter((trader) => trader.id !== "player").map((trader) => <option key={trader.id} value={trader.id}>{trader.name}</option>)}
              </select>
              <select value={order.wantItem} onChange={(event) => update(index, { wantItem: event.target.value })}>
                <option value="">Item</option>
                {known.map((item) => <option value={item} key={item}>{item}</option>)}
              </select>
              <input type="number" min="0" value={order.sardines} onChange={(event) => update(index, { sardines: Math.max(0, Number(event.target.value || 0)) })} />
              <select value={order.offerItem || ""} onChange={(event) => update(index, { offerItem: event.target.value })}>
                <option value="">No barter item</option>
                {[...new Set(game.traders.player.inventory)].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              {listing && <div className="small muted">Current posted ask: {listing.ask}🥫.</div>}
            </div>
          );
        })}
      </section>

      <details className="advanced-details">
        <summary>Other announced buy orders</summary>
        {visibleMarketBoard(game).map((bid, index) => <div key={`${bid.from}-${bid.wantItem}-${index}`}>{bid.publicText}</div>)}
      </details>
    </section>
  );
}

function SunMomentPanel({ game, onResist, onLateEdit }) {
  const lockedCash = game.lockedPlayerOrders?.[0]?.sardines || 0;
  const [cash, setCash] = useState(lockedCash);
  const moment = game.sunMoment;
  useEffect(() => { if (moment?.lateEditAvailable) setCash(lockedCash); }, [moment?.lateEditAvailable, lockedCash]);
  if (!moment || !["sunrise", "noon", "sunset"].includes(game.phase)) return null;
  return <section className="card sun-moment"><div className="section-title">Sun Moment · {game.phase}</div>
    <p>{game.phase === "noon" ? "The harbour pauses immediately before Octopus Clearing." : "Trading stops for a brief natural pause. Continue when ready."}</p>
    {game.phase === "noon" && moment.eligible && moment.state === "contextual_opportunity" && <button className="btn" onClick={onResist}>Keep working</button>}
    {game.phase === "noon" && moment.lateEditAvailable && game.lockedPlayerOrders?.[0] && <div className="mini-card"><p>One late edit only. NPC commitments are already fixed; opening resources still bind.</p><label>Revised cash on Order 1 <input type="number" min="0" value={cash} onChange={(event) => setCash(Math.max(0, Number(event.target.value || 0)))} /></label><button className="btn gold" onClick={() => onLateEdit(0, { ...game.lockedPlayerOrders[0], sardines: cash })}>Apply late edit</button></div>}
  </section>;
}

function NoonPanel({ game }) {
  if (!game.marketResolved) {
    return (
      <section className="card">
        <div className="section-title">Octopus Clearing · locked, not settled</div>
        {(game.lockedPlayerOrders || []).length ? game.lockedPlayerOrders.map((order, index) => (
          <div className="mini-card" key={index}>{label(order.wantItem)} from {game.traders[order.to]?.name} · {order.sardines}🥫{order.offerItem ? ` + ${label(order.offerItem)}` : ""}</div>
        )) : <p>You locked no player order.</p>}
      </section>
    );
  }

  const bought = game.marketOutcome.filter((trade) => trade.from === "player");
  const sold = game.marketOutcome.filter((trade) => trade.to === "player");
  return (
    <section className="play-flow">
      <section className="card">
        <div className="section-title">Your Octopus Clearing result</div>
        {bought.map((trade, index) => <div className="mini-card" key={`b-${index}`}>Bought {label(trade.wantItem)} from {game.traders[trade.to]?.name} for {trade.sardines}🥫.</div>)}
        {sold.map((trade, index) => <div className="mini-card" key={`s-${index}`}>Sold {label(trade.wantItem)} to {game.traders[trade.from]?.name} for {trade.sardines}🥫.</div>)}
        {game.rejected.map((order, index) => <div className="mini-card" key={`r-${index}`}><strong>Did not fill:</strong> {label(order.wantItem)} · {order.reason}</div>)}
        {!bought.length && !sold.length && !game.rejected.length && <p>Nothing on your side settled.</p>}
      </section>
      <details className="tape-drawer" open>
        <summary>Public Tape · Octopus Clearing output · {game.history.filter((trade) => trade.day === game.day).length}</summary>
        {game.history.filter((trade) => trade.day === game.day).map((trade) => <div key={trade.id}>{game.traders[trade.from]?.name} bought {label(trade.item)} from {game.traders[trade.to]?.name} for {trade.sardines}🥫.</div>)}
      </details>
    </section>
  );
}

function TapeArchive({ game }) {
  if (!game.history.length) return null;
  return (
    <details className="tape-drawer">
      <summary>Public tape archive · {game.history.length}</summary>
      <div className="log-stack">{[...game.history].reverse().slice(0, 18).map((trade) => (
        <div className="log-line" key={trade.id}>Day {trade.day}: {game.traders[trade.from]?.name} bought {label(trade.item)} from {game.traders[trade.to]?.name} for {trade.sardines}🥫{trade.paymentItem ? ` + ${label(trade.paymentItem)}` : ""}.</div>
      ))}</div>
    </details>
  );
}

function CurrentState({ game }) {
  const due = duePrivateMatters(game).length;
  const copy = {
    sunrise: "The harbour is waking. Begin Morning to receive 2 scarce time actions.",
    morning: `${game.actionsRemaining} actions left. Talk, investigate, or prepare Noon orders. Closing Morning locks written orders.`,
    noon: game.marketResolved ? "Settlement happened. The Public Tape shows what actually traded; leave Noon for 2 Afternoon actions." : "Orders are locked. Settle Noon once to move goods and cash.",
    afternoon: `${game.actionsRemaining} actions left. Read the Public Tape, then talk, investigate, trade privately, or arrange finance.`,
    sunset: due ? `${due} due private matter${due === 1 ? "" : "s"} must be decided before the day can close.` : "Closing the day settles food, ordinary obligations, perishability, and business activity.",
  }[game.phase];
  return <section className="now-card"><strong>{PHASE_COPY[game.phase].title.toUpperCase()}</strong><span>{copy}</span></section>;
}

function DueMatters({ game, onResolve }) {
  const due = duePrivateMatters(game);
  if (!due.length) return null;
  return <section className="card obligation-sheet"><div className="section-title">Due private matters</div>{due.map((matter) => <div className="mini-card" key={matter.id}>
    <strong>{matter.note || (matter.debtorId === "juan" ? `Juan claim · face ${matter.faceAmount}🥫` : "Private matter")}</strong><p>{matter.debtorId === "juan" ? `Due Day ${matter.dueDay}. Juan currently has ${game.traders.juan.sardines}🥫; the linked crop determines whether forced liquidation is available.` : matter.kind === "future-delivery" ? "Aspen needs the promised Lime before the day closes." : `Repay ${matter.amount}🥫 or let Yasmin keep the ${matter.collateral}.`}</p>
    <div className="inline-actions">{matter.debtorId === "juan" ? <><button className="btn gold" onClick={() => onResolve(matter.id, "collect")}>Collect now</button>{matter.linkedProductiveAsset && game.traders.juan.sardines < matter.faceAmount && <button className="btn" onClick={() => onResolve(matter.id, "liquidate")}>Force liquidation</button>}{matter.extensionCount < 1 && <button className="btn" onClick={() => onResolve(matter.id, "extend")}>Extend · face +2🥫 · due +2 days</button>}</> : matter.kind === "future-delivery" ? <><button className="btn gold" disabled={!game.traders.player.inventory.includes(matter.item)} onClick={() => onResolve(matter.id, "deliver")}>Deliver as promised</button><button className="btn" onClick={() => onResolve(matter.id, "default")}>Do not deliver</button></> : <><button className="btn gold" disabled={game.traders.player.sardines < matter.amount} onClick={() => onResolve(matter.id, "repay")}>Repay now</button><button className="btn" onClick={() => onResolve(matter.id, "seize")}>Let Yasmin take collateral</button></>}</div>
  </div>)}</section>;
}

function EventPanel({ game, setGame }) {
  const [bid, setBid] = useState(52);
  if (!game.pendingEvents?.length) return null;
  return (
    <section className="card">
      <div className="section-title">Opportunity</div>
      {game.pendingEvents.map((event) => (
        <div className="mini-card" key={event.id}>
          <strong>{event.title}</strong><p>{event.text}</p>
          {event.id === "auction" && <input type="number" value={bid} onChange={(e) => setBid(Number(e.target.value || 0))} />}
          {event.actions.map((action) => <button className="btn" key={action} onClick={() => setGame((current) => resolveEvent(current, event.id, action, bid))}>{action}</button>)}
        </div>
      ))}
    </section>
  );
}

function LegacyAppCore() {
  const [game, setGame] = useState(loadGame);
  const [mode, setMode] = useState("learn");
  const [selectedId, setSelectedId] = useState("wong");

  useEffect(() => {
    try { window.localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, game })); } catch { /* ignore */ }
  }, [game]);

  const orders = game.playerOrders || resetOrders();
  const phase = game.phase;
  const player = game.traders.player;
  const referenceNetWorth = player.sardines + player.inventory.reduce((sum, item) => sum + Number(ITEMS[item]?.value || 0), 0);

  function setOrders(next) {
    setGame((current) => ({ ...current, playerOrders: next }));
  }

  function primary() {
    if (game.pendingEvents?.length) return;
    if (phase === "noon" && !game.marketResolved) setGame((current) => resolveNoonMarket(current));
    else setGame((current) => advancePhase(current));
  }

  function restart() {
    setGame(createGame());
    setMode("learn");
    setSelectedId("wong");
  }

  if (game.ended) {
    const openObligations = game.obligations.filter((obligation) => ["open", "overdue"].includes(obligation.status)).length;
    return <main className="app-shell"><div className="container"><section className="end-box"><h2>This prototype life ended.</h2><p>{game.finalText}</p><h3>What happened</h3><ul><li>Sunflower acquired: {game.flags.sunflowerAcquired ? "yes" : "no"}</li><li>Ending cash: {player.sardines}🥫 · reference net worth: {referenceNetWorth}🥫</li><li>Player trades completed: {game.stats.tradeCount + game.stats.inboundTrades}</li><li>Information sold/shared: {game.stats.informationSales} / {game.stats.informationFavours}</li><li>Open or overdue obligations: {openObligations} · defaults recorded: {game.stats.defaults}</li><li>Formal-market access: {canAccessVenue(game, "formalMarket") ? "available" : "unavailable"}</li></ul><button className="btn gold" onClick={restart}>Start another life</button></section></div></main>;
  }

  return (
    <main className="app-shell">
      <div className="container">
        <header className="hero"><div><div className="eyebrow">Sunflower · code-first living slice</div><h1>Day {game.day}</h1><p>Objective: <strong>{game.objective}</strong></p></div><button className="btn ghost" onClick={restart}>New Game</button></header>
        <div className="sticky-status"><span>{PHASE_COPY[phase].title}</span><span>{SARDINE} {player.sardines}</span><span>{game.actionsRemaining} time actions</span>{game.playerState.form !== "human" && <span>{FORMS[game.playerState.form].icon} {FORMS[game.playerState.form].label}</span>}</div>
        <div className="phase-strip">{PHASES.map((id) => <div className={`phase-node ${id === phase ? "active" : ""}`} key={id}><span>{PHASE_COPY[id].icon}</span><small>{PHASE_COPY[id].title}</small></div>)}</div>
        <CurrentState game={game} />
        <SunMomentPanel game={game} onResist={() => setGame((current) => resistSunMoment(current))} onLateEdit={(index, order) => setGame((current) => applyLateOrderEdit(current, index, order))} />
        <details className="notebook-drawer"><summary>HOW THIS WORKS</summary><div className="notebook-stack">Sunrise → Morning → Noon → Afternoon → Sunset. Morning and Afternoon give scarce time actions. Talk spends time on a person; Investigate spends it on facts. Written Morning orders are not trades until Noon settles once. After Noon, the Public Tape shows what actually happened.</div></details>

        <section className="player-bar"><div className="player-balance"><strong>{player.sardines}🥫</strong><span>cash</span></div><div className="chips">{player.inventory.map((item, index) => <span className="chip" key={`${item}-${index}`}>{label(item)}</span>)}</div></section>
        <BarPanel game={game} />

        {game.flags.sunflowerAcquired && <section className="card flower-reveal"><div className="section-title">🌻 You got it.</div><p><strong>Nothing happens.</strong></p><p>The sunflower remains on your side of the desk. The market and your life continue.</p><p className="muted">Objective: {game.objective}</p></section>}

        {game.playerState.form !== "human" && <section className="card access-sheet"><div className="section-title">The market recognises you differently</div><p>{FORMS[game.playerState.form].icon} {FORMS[game.playerState.form].label} · legal identity {game.playerState.legalIdentity.status}</p><p className="muted">Formal market: {canAccessVenue(game, "formalMarket") ? "access available through a proxy" : "direct access unavailable"}. Your memory continues, but your former estate is not automatically yours.</p></section>}

        <InboundOffers game={game} onAccept={(id) => setGame((current) => acceptInboundOffer(current, id))} onDecline={(id) => setGame((current) => declineInboundOffer(current, id))} />
        <EventPanel game={game} setGame={setGame} />

        {phase === "morning" && <div className="mode-switch"><button className={`btn ${mode === "learn" ? "gold" : "ghost"}`} onClick={() => setMode("learn")}>Learn</button><button className={`btn ${mode === "trade" ? "gold" : "ghost"}`} onClick={() => setMode("trade")}>Trade</button></div>}

        {((phase === "morning" && mode === "learn") || phase === "afternoon") && <LearnPanel
          game={game}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onTalk={(id) => setGame((current) => performFreeAction(current, "talk", id))}
          onInvestigate={(id) => setGame((current) => performFreeAction(current, "investigate", id))}
          onGift={(id, item) => setGame((current) => giveItem(current, id, item))}
          onSellInfo={(infoId, buyerId) => setGame((current) => sellInformation(current, infoId, buyerId))}
          onSellExclusive={(infoId, buyerId) => setGame((current) => sellInformationExclusive(current, infoId, buyerId))}
          onShareInfo={(infoId, buyerId) => setGame((current) => shareInformationAsFavor(current, infoId, buyerId))}
          onRepay={(id) => setGame((current) => repayObligation(current, id))}
          onProxy={(id) => setGame((current) => requestMarketProxy(current, id))}
          onFuture={() => setGame((current) => acceptFutureDelivery(current))}
          onFulfillFuture={(id) => setGame((current) => fulfillFutureDelivery(current, id))}
          onRelationshipLoan={() => setGame((current) => requestRelationshipLoan(current))}
          onSecuredLoan={(item) => setGame((current) => requestSecuredLoan(current, item))}
          onBuyClaim={(id) => setGame((current) => buyJuanClaim(current, id))}
          onBuyback={(id) => setGame((current) => acceptJuanBuyback(current, id))}
        />}

        {phase === "morning" && mode === "trade" && <TradePanel game={game} orders={orders} setOrders={setOrders} />}
        {phase === "noon" && <NoonPanel game={game} />}
        {phase !== "noon" && <TapeArchive game={game} />}
        {phase === "sunset" && <section className="card"><div className="section-title">Sunset settlement</div><p>Closing the day settles food, promises, perishability and ordinary business activity.</p></section>}
        <DueMatters game={game} onResolve={(id, action) => setGame((current) => resolveDuePrivateMatter(current, id, action))} />

        {!!(game.information?.length || game.learningNotes?.length) && <details className="notebook-drawer"><summary>Notebook · {(game.information?.length || 0) + (game.learningNotes?.length || 0)} saved note(s){game.badges?.length ? ` · ${game.badges.length} badge(s)` : ""}</summary>{[...(game.information || [])].reverse().map((note) => <div className="mini-card" key={note.id}><strong>{note.text}</strong><p className="muted">Source: {note.personallyVerified ? "personally verified" : note.source} · confidence {note.confidence} · {note.freshness}</p></div>)}{(game.badges || []).map((badge) => <div className="mini-card note-card" key={badge.id}><strong>{badge.title}</strong><p>{badge.summary}</p></div>)}{game.learningNotes.map((note) => <div className="mini-card" key={note.id}>
          <strong>? {note.title}</strong>
          <p><small>WHAT HAPPENED</small></p>
          {(note.occurrences?.length ? note.occurrences : [{ day: note.day, whatHappened: "This concept was discovered in an older save before occurrence links were recorded." }]).map((occurrence, index) => <p key={`${note.id}-${index}`}><strong>Day {occurrence.day}{occurrence.phase ? ` · ${PHASE_COPY[occurrence.phase]?.title || occurrence.phase}` : ""}</strong><br />{occurrence.whatHappened}</p>)}
          <p><small>WHAT PEOPLE CALL THIS</small></p><div>{note.title}</div>
          <p><small>WHY IT MATTERS</small></p><div>{note.text}</div>
        </div>)}</details>}
        {!game.pendingEvents?.length && <div className="bottom-action"><button className="btn gold primary-action" disabled={(phase === "sunset" && duePrivateMatters(game).length > 0) || game.sunMoment?.lateEditAvailable} onClick={primary}>{phase === "sunrise" ? "Continue into Morning — gain 2 actions" : phase === "morning" ? "Lock orders & pause before Noon" : phase === "noon" && !game.marketResolved ? "Continue to Octopus Clearing" : phase === "noon" ? "Leave Noon — gain 2 actions" : phase === "afternoon" ? "Go to Sunset pause" : "Close the day & settle"}</button></div>}
      </div>
    </main>
  );
}

function WorkbenchPanel({ title, children, open = false }) { return <details className="card workbench-card" open={open}><summary className="section-title">{title}</summary>{children}</details>; }
const pretty=x=>x.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
function Diagnosis({world}){const d=diagnosePlayer(world);return <main className="app-shell diagnosis"><div className="container"><header className="hero"><div><div className="eyebrow">SUNFLOWER</div><h1>YOU WENT HOME</h1><p>Day {d.outcome.dayHome} · {d.outcome.route} route</p></div></header><section className="card"><h2>{d.archetype}</h2><p>{d.evidenceCount} pieces of run evidence support this reading. It is not a moral or total score.</p></section><div className="diagnosis-grid"><section className="card"><h2>Process</h2>{d.radar.map(x=><div className="meter" key={x.key}><span>{x.label}</span><strong>{x.score??'—'}</strong><small>{x.confidence}</small>{x.score!==null&&<i style={{width:`${x.score}%`}}/>}</div>)}</section><section className="card"><h2>Style</h2>{d.style.map(x=><div className="style-row" key={x.key}><span>{x.labels[0]}</span><b>{x.value===null?'not enough evidence':`${x.value>0?'+':''}${x.value}`}</b><span>{x.labels[1]}</span></div>)}<h3>Return footprint</h3>{Object.entries(d.returnFootprint).map(([k,v])=><p key={k}>{k}: {v}</p>)}</section></div><section className="card"><h2>Market Scars</h2>{d.scars.length?d.scars.map(s=><article key={s.name}><strong>{s.name}</strong><p>{s.explanation}</p><small>{s.evidenceIds.join(', ')}</small></article>):<p>No evidence-backed Scar dominated this run.</p>}</section><section className="card"><h2>Defining cases</h2>{d.definingCases.map(e=><article className="news-item" key={e.id}><strong>Day {e.day} · {pretty(e.situation||e.type)}</strong><p>{e.summary}</p><small>{e.location} · evidence {e.id}</small></article>)}</section><section className="card"><h2>Outcome</h2><p>Cash: {d.outcome.startingCash}🥫 → {d.outcome.endingCash}🥫 · low {d.outcome.lowestCash}🥫 · maximum locked {d.outcome.maxLocked}🥫</p><p>Commitments fulfilled {d.outcome.fulfilled} · breached {d.outcome.breached}</p></section></div></main>}
export default function AppCore(){
 const [world,setWorld]=useState(()=>createHarbourWorld()); const [tab,setTab]=useState('places'); const [tradeItem,setTradeItem]=useState('Fresh Mackerel'); const [hotspot,setHotspot]=useState(null);
 const pg=world.playerGame,p=world.actors.player,actions=visibleActions(world),sceneActions=visibleActions(world).filter(a=>!a.hiddenOnly),reserved=world.market.reservations.filter(r=>r.actorId==='player'),lockedCommitments=pg.commitments.filter(x=>x.status==='open').reduce((n,x)=>n+(x.lockedCash||0),0),reservedOrders=reserved.filter(r=>r.kind==='cash').reduce((n,r)=>n+r.amount,0);
 const scene=sceneSnapshot(world,pg.location);const hotspotKinds={'handling bench':['assemble_onewheel'],'onewheel parts':['buy_part'],'auction lot':['auction_inspect','auction_bid','auction_walk'],'labels':['auction_inspect'],'provenance documents':['auction_provenance'],'cargo manifest':['buy_part'],'wrapped parcel':['lime_inspect','lime_deliver','lime_refuse'],'open tab':['joel_hear_supper','joel_patronage','joel_help'],'bar':['joel_supply_orgeat'],'hidden toad':['collect_toad']};const hotspotActions=hotspot?(scene.people.includes(hotspot)?actions.filter(a=>a.id==='meet'&&a.payload.actor===hotspot):actions.filter(a=>(hotspotKinds[hotspot]||[]).includes(a.id))):[];const act=a=>setWorld(w=>performPlayerAction(w,a.id,a.payload));useEffect(()=>{const shortcuts={n:'notebook',p:'phone',g:'newspaper',l:'ledger'};const key=e=>{if(e.key==='Escape'){setHotspot(null);setTab('places')}else if(shortcuts[e.key.toLowerCase()]&&!e.metaKey&&!e.ctrlKey){setTab(shortcuts[e.key.toLowerCase()]);e.preventDefault()}else if(/^[1-9]$/.test(e.key)&&tab==='places'){const a=sceneActions[Number(e.key)-1];if(a&&!a.disabled)act(a)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[tab,sceneActions]);
 if(world.playerGame.home)return <Diagnosis world={world}/>;
 return <main className="app-shell spine-shell"><div className="container spine-container">
 <header className="hero"><div><div className="eyebrow">Sunflower · {LOCATIONS[pg.location].name}</div><h1>Day {world.day+1}</h1><p>Get a Sunflower. Then decide when to go home.</p></div><button className="btn ghost" onClick={()=>setWorld(createHarbourWorld())}>New game</button></header>
 <div className="sticky-status"><span>🥫 {p.cash} total</span><span>{availableCash(world,'player')} available</span><span>{world.attention.budget-world.attention.used} attention</span><span>{pg.commitments.filter(x=>x.status==='open').length} commitments</span></div>
 <nav className="game-tabs">{['places','newspaper','phone','notebook','ledger','inventory','clearing'].map(x=><button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}>{pretty(x)}</button>)}</nav>
 {tab==='places'&&<><section className={`scene card scene-${pg.location}`}><header><div><div className="eyebrow">Now · {LOCATIONS[pg.location].name}</div><h2>{LOCATIONS[pg.location].description}</h2></div></header><SceneStage scene={scene} selected={hotspot} onSelect={setHotspot}/><ConsequenceStrip world={world}/>{hotspot&&<div className="hotspot-focus"><strong>{pretty(hotspot)}</strong><p>{scene.people.includes(hotspot)?'Present here now.':'Ownership, custody, timing and location determine its legal uses.'}</p>{hotspotActions.length?hotspotActions.map((a,i)=><button className="btn" disabled={a.disabled} onClick={()=>act(a)} key={`${a.id}-${i}`}>{a.label}{a.reason&&<small>{a.reason}</small>}</button>):<small>No consequential use is available from this object now.</small>}</div>}{scene.traces.map((t,i)=><p className="scene-trace" key={`${t.day}-${i}`}>Earlier: {t.summary}</p>)}<div className="action-grid">{sceneActions.map((a,i)=><button key={a.id+i} className="btn" disabled={a.disabled} title={a.reason||''} onClick={()=>act(a)}><kbd>{i+1}</kbd> {a.label}{a.reason&&<small>{a.reason}</small>}</button>)}</div>{pg.lastBlock&&<p className="blocked">{pg.lastBlock}</p>}</section><section className="place-grid" aria-label="Go somewhere else">{Object.entries(LOCATIONS).filter(([id])=>id!==pg.location).map(([id,x])=><button className="place-card" onClick={()=>{setHotspot(null);setWorld(w=>visitLocation(w,id))}} key={id}><strong>{x.name}</strong><span>{x.description}</span></button>)}</section></>}
 {tab==='newspaper'&&<WorkbenchPanel title="The Harbour Gazette" open>{world.newspaper.slice().reverse().map(n=><article className="news-item" key={n.id}><strong>{n.headline}</strong><p>{n.report}</p><small>Public report · day {n.day} · may be delayed or incomplete</small></article>)}</WorkbenchPanel>}
 {tab==='phone'&&<WorkbenchPanel title="Contacts" open>{['aspen','joel','wong','juan','yasmin','dima','sonya'].map(id=><div className="contact-row" key={id}><span>{pretty(id)}</span>{p.contacts.includes(id)?<button className="btn ghost" onClick={()=>setWorld(w=>phoneContact(w,id,'Following up on our last conversation.'))}>Send narrow follow-up</button>:<small>Meet in person first</small>}</div>)}{world.production?.toadChat&&<article className="mini-card"><strong>🐸 group</strong>{world.production.toadChat.messages.map((m,i)=><p key={i}>{m}</p>)}</article>}<p className="muted">Calls can coordinate and ask. They cannot inspect, deliver, attend or transfer possession.</p></WorkbenchPanel>}
 {tab==='notebook'&&<WorkbenchPanel title={`Notebook · ${pg.notebook.length} useful records`} open>{world.evidence.filter(e=>pg.notebook.includes(e.id)).slice().reverse().map(e=><details className="news-item" key={e.id}><summary><strong>{e.summary||pretty(e.type)}</strong></summary><p>Day {e.day} · {pretty(e.location||'harbour')} · source {pretty(e.source||'system')}</p><p>{e.situation?`May matter to ${pretty(e.situation)}.`:'A contemporaneous record; no route conclusion is implied.'}</p><small>Confidence {e.confidence??'recorded'} · freshness {e.freshness||'recorded'} · {e.id}</small></details>)}</WorkbenchPanel>}
 {tab==='ledger'&&<WorkbenchPanel title="Ledger / commitments" open><div className="ledger-summary"><p><strong>Total cash</strong> {p.cash}🥫</p><p><strong>Available now</strong> {availableCash(world,'player')}🥫</p><p><strong>Reserved for public orders</strong> {reservedOrders}🥫</p><p><strong>Locked by commitments</strong> {lockedCommitments}🥫</p></div><p className="muted">Available cash is total cash minus public-order reservations and live commitments.</p>{pg.commitments.map(c=><article className="mini-card" key={c.id}><strong>{c.title}</strong><p>{c.status} · deadline day {c.dueDay} · {pretty(c.location)}</p></article>)}<h3>Claims</h3>{world.claims.filter(c=>c.holderId==='player'||c.issuerId==='player').map(c=><p key={c.id}>{c.type} · face {c.face} · {c.status}</p>)}</WorkbenchPanel>}
 {tab==='inventory'&&<WorkbenchPanel title="Inventory / assets" open>{p.inventory.map(u=><article className="mini-card" key={u.unitId}><strong>{u.kind}</strong><p>{GOODS[u.kind]?.mode||'PHYSICAL'} · owned by you · custody with you</p><small>{u.pledgedTo?`Pledged to ${pretty(u.pledgedTo)} · not freely transferable`:u.opened?`Opened · ${u.remaining} servings remain`:'Physical unit'} · cost basis {u.costBasis}🥫</small></article>)}{!p.inventory.length&&<p>Nothing in hand.</p>}<h3>Held for somebody else</h3>{world.parcelJobs?.filter(j=>j.custodianId==='player'&&j.status==='in_custody').map(j=><article className="mini-card custody" key={j.id}><strong>{j.itemKind||'Sealed parcel'}</strong><p>You hold this; you do not own it.</p><small>Recipient {j.recipientId} · deadline day {j.deadline}</small></article>)}{!world.parcelJobs?.some(j=>j.custodianId==='player'&&j.status==='in_custody')&&<p className="muted">No third-party property in your custody.</p>}</WorkbenchPanel>}
 {tab==='clearing'&&<WorkbenchPanel title="Octopus Public Clearing" open><div className="trade-controls"><select value={tradeItem} onChange={e=>setTradeItem(e.target.value)}>{['Fresh Mackerel','Lime','Rum','Soda','Packing Paper','Presta Inner Tube'].map(x=><option key={x}>{x}</option>)}</select><button className="btn" onClick={()=>setWorld(w=>placePublicOrder(w,'player','buy',tradeItem,6))}>Bid 6🥫</button><button className="btn" disabled={!p.inventory.some(x=>x.kind===tradeItem)} onClick={()=>setWorld(w=>placePublicOrder(w,'player','sell',tradeItem,5))}>Ask 5🥫</button></div><p>Resources are reserved until fill or expiry. Clearing settles; it does not own client goods or float.</p>{world.market.orders.filter(o=>o.status==='open').map(o=><p key={o.id}>{o.side} {o.quantity} {o.item} @ {o.price} · {o.actorId}</p>)}{world.market.tape.slice(-8).reverse().map(t=><p key={t.id}>{t.item} · {t.price}🥫 · {t.sellerId} → {t.buyerId}</p>)}</WorkbenchPanel>}
 <div className="bottom-action"><button className="btn gold primary-action" onClick={()=>setWorld(w=>advanceHarbourWindow(w))}>End day — let the harbour move</button></div>
 </div></main>;
}
