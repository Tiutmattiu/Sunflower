import React, { useEffect, useMemo, useState } from "react";
import "./index.css";
import { ITEMS, NPC_PROFILES, PHASE_COPY, SARDINE } from "./gameData";
import {
  acceptInboundOffer,
  advancePhase,
  createGame,
  currentObligations,
  declineInboundOffer,
  giveItem,
  informationBuyers,
  informationPrice,
  knownItemsForTrader,
  performFreeAction,
  repayObligation,
  requestMarketProxy,
  resetOrders,
  resolveEvent,
  resolveNoonMarket,
  sellInformation,
  shareInformationAsFavor,
} from "./livingGame";
import { sellerAsk, visibleMarketBoard } from "./npcAI";

const SAVE_KEY = "sunflower-living-market-v5";
const PHASES = ["sunrise", "morning", "noon", "afternoon", "sunset"];

function loadGame() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVE_KEY) || "null");
    if (parsed?.version === 5 && parsed?.game?.traders?.player) return parsed.game;
  } catch {
    // Local persistence is convenience only.
  }
  return createGame();
}

function label(item) {
  return item ? `${ITEMS[item]?.icon || "□"} ${item}` : "nothing";
}

function publicListings(game) {
  const rows = [];
  Object.entries(NPC_PROFILES).forEach(([sellerId, profile]) => {
    const seller = game.traders[sellerId];
    if (!seller) return;
    const dynamic = [
      ...(profile.publicStock || []),
      ...(sellerId === "bar" && seller.inventory.includes("Mai Tai") ? ["Mai Tai"] : []),
      ...(sellerId === "mechanic" && seller.inventory.includes("Built Onewheel") ? ["Built Onewheel"] : []),
    ];
    [...new Set(dynamic)].forEach((item) => {
      if (!seller.inventory.includes(item)) return;
      rows.push({ sellerId, item, ask: sellerAsk(game, sellerId, item) });
    });
  });
  return rows;
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

function LearnPanel({ game, selectedId, setSelectedId, onTalk, onInvestigate, onGift, onSellInfo, onShareInfo, onRepay, onProxy }) {
  const people = Object.values(game.traders).filter((trader) => trader.id !== "player");
  const target = game.traders[selectedId] || people[0];
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0;
  const info = [...(game.information || [])].reverse();
  const obligations = currentObligations(game);

  return (
    <section className="play-flow">
      <section className="card">
        <div className="section-title">Learn</div>
        <p className="small muted"><strong>Talk</strong> changes the relationship. <strong>Investigate</strong> spends the same scarce time on market facts instead.</p>
        <select value={target.id} onChange={(event) => setSelectedId(event.target.value)}>
          {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
        </select>
        <p><strong>{target.name}</strong> · {relationshipWord(game.relationships[target.id] || 0)}</p>
        <p className="small muted">You can currently confirm: {knownItemsForTrader(game, target.id).map(label).join(", ") || "nothing specific"}.</p>
        <div className="inline-actions">
          <button className="btn" disabled={!active} onClick={() => onTalk(target.id)}>Talk</button>
          <button className="btn" disabled={!active} onClick={() => onInvestigate(target.id)}>Investigate</button>
          {game.playerState.form === "animal" && target.id === "bar" && (game.relationships.bar || 0) >= 2 && (
            <button className="btn" disabled={!active} onClick={() => onProxy(target.id)}>Ask Apprentice to proxy formal market</button>
          )}
        </div>
        {game.lastInteraction?.targetId === target.id && <div className="intel-note">{game.lastInteraction.text}{game.lastInteraction.note ? ` — ${game.lastInteraction.note}` : ""}</div>}
      </section>

      <section className="card">
        <div className="section-title">Give something instead of selling it</div>
        <p className="small muted">A gift consumes a time action and turns a good into relationship capital. It is not a market settlement.</p>
        <div className="chips">
          {game.traders.player.inventory.map((item, index) => (
            <button className="btn ghost" disabled={!active} key={`${item}-${index}`} onClick={() => onGift(target.id, item)}>Give {label(item)}</button>
          ))}
        </div>
      </section>

      {!!info.length && <section className="card">
        <div className="section-title">Your information</div>
        <div className="stack">
          {info.map((note) => {
            const buyers = informationBuyers(game, note).filter((id) => !(note.knownBy || []).includes(id));
            return (
              <div className="mini-card" key={note.id}>
                <div>{note.text}</div>
                <div className="small muted">{note.precision} · {note.confidence} · {note.freshness} · known by {(note.knownBy || ["player"]).length} actor(s)</div>
                {buyers.map((buyerId) => (
                  <div className="inline-actions" key={`${note.id}-${buyerId}`}>
                    <button className="btn" disabled={!active} onClick={() => onSellInfo(note.id, buyerId)}>Sell to {game.traders[buyerId].name} · {informationPrice(game, note, buyerId)}🥫</button>
                    <button className="btn ghost" disabled={!active} onClick={() => onShareInfo(note.id, buyerId)}>Tell as a favour</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>}

      {!!obligations.length && <section className="card">
        <div className="section-title">Open promises</div>
        {obligations.map((obligation) => (
          <div className="mini-card" key={obligation.id}>
            {obligation.amount}🥫 owed to {game.traders[obligation.creditorId]?.name || obligation.creditorId} · due Day {obligation.dueDay}
            <button className="btn" disabled={!active || game.traders.player.sardines < obligation.amount} onClick={() => onRepay(obligation.id)}>Repay</button>
          </div>
        ))}
      </section>}
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
      <section className="card">
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

      <section className="card">
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
        {visibleMarketBoard(game).map((bid, index) => <div key={`${bid.from}-${bid.wantItem}-${index}`}>{game.traders[bid.from].name}: {bid.sardines}🥫 for {bid.wantItem}</div>)}
      </details>
    </section>
  );
}

function NoonPanel({ game }) {
  if (!game.marketResolved) {
    return (
      <section className="card">
        <div className="section-title">Locked. Not settled.</div>
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
        <div className="section-title">Your Noon result</div>
        {bought.map((trade, index) => <div className="mini-card" key={`b-${index}`}>Bought {label(trade.wantItem)} from {game.traders[trade.to]?.name} for {trade.sardines}🥫.</div>)}
        {sold.map((trade, index) => <div className="mini-card" key={`s-${index}`}>Sold {label(trade.wantItem)} to {game.traders[trade.from]?.name} for {trade.sardines}🥫.</div>)}
        {game.rejected.map((order, index) => <div className="mini-card" key={`r-${index}`}><strong>Did not fill:</strong> {label(order.wantItem)} · {order.reason}</div>)}
        {!bought.length && !sold.length && !game.rejected.length && <p>Nothing on your side settled.</p>}
      </section>
      <details className="advanced-details" open>
        <summary>Public tape · {game.history.filter((trade) => trade.day === game.day).length}</summary>
        {game.history.filter((trade) => trade.day === game.day).map((trade) => <div key={trade.id}>{game.traders[trade.from]?.name} bought {label(trade.item)} from {game.traders[trade.to]?.name} for {trade.sardines}🥫.</div>)}
      </details>
    </section>
  );
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

export default function AppCore() {
  const [game, setGame] = useState(loadGame);
  const [mode, setMode] = useState("learn");
  const [selectedId, setSelectedId] = useState("dog");

  useEffect(() => {
    try { window.localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 5, game })); } catch { /* ignore */ }
  }, [game]);

  const orders = game.playerOrders || resetOrders();
  const phase = game.phase;
  const player = game.traders.player;

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
    setSelectedId("dog");
  }

  if (game.ended) {
    return <main className="app-shell"><div className="container"><section className="end-box"><h2>This prototype life ended.</h2><p>{game.finalText}</p>{game.style && <p><strong>{game.style.name}</strong> — {game.style.description}</p>}<button className="btn gold" onClick={restart}>Start another life</button></section></div></main>;
  }

  return (
    <main className="app-shell">
      <div className="container">
        <header className="hero"><div><div className="eyebrow">Sunflower · code-first living slice</div><h1>Day {game.day}</h1><p>Objective: <strong>{game.objective}</strong></p></div><button className="btn ghost" onClick={restart}>New Game</button></header>
        <div className="sticky-status"><span>{PHASE_COPY[phase].title}</span><span>{SARDINE} {player.sardines}</span><span>{game.actionsRemaining} time actions</span></div>
        <div className="phase-strip">{PHASES.map((id) => <div className={`phase-node ${id === phase ? "active" : ""}`} key={id}><span>{PHASE_COPY[id].icon}</span><small>{PHASE_COPY[id].title}</small></div>)}</div>

        <section className="player-bar"><div className="player-balance"><strong>{player.sardines}🥫</strong><span>cash</span></div><div className="chips">{player.inventory.map((item, index) => <span className="chip" key={`${item}-${index}`}>{label(item)}</span>)}</div></section>

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
          onShareInfo={(infoId, buyerId) => setGame((current) => shareInformationAsFavor(current, infoId, buyerId))}
          onRepay={(id) => setGame((current) => repayObligation(current, id))}
          onProxy={(id) => setGame((current) => requestMarketProxy(current, id))}
        />}

        {phase === "morning" && mode === "trade" && <TradePanel game={game} orders={orders} setOrders={setOrders} />}
        {phase === "noon" && <NoonPanel game={game} />}
        {phase === "sunset" && <section className="card"><div className="section-title">Sunset settlement</div><p>Closing the day settles food, promises, perishability and ordinary business activity.</p></section>}

        {!!game.learningNotes?.length && <details className="advanced-details"><summary>Things the market has taught you · {game.learningNotes.length}</summary>{game.learningNotes.map((note) => <div className="mini-card" key={note.id}><strong>{note.title}</strong><div>{note.text}</div><small>Day {note.day}</small></div>)}</details>}
        <details className="advanced-details"><summary>Developer details</summary><div>Inbound offers: {(game.inboundOffers || []).length}</div><div>Information objects: {(game.information || []).length}</div><div>Public trades: {game.history.length}</div></details>

        {!game.pendingEvents?.length && <div className="bottom-action"><button className="btn gold primary-action" onClick={primary}>{phase === "sunrise" ? "Begin morning" : phase === "morning" ? "Lock orders & open Noon" : phase === "noon" && !game.marketResolved ? "Settle Noon" : phase === "noon" ? "Leave Noon" : phase === "afternoon" ? "Go to sunset" : "Close the day"}</button></div>}
      </div>
    </main>
  );
}
