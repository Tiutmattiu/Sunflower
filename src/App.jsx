import React, { useMemo, useState } from "react";
import "./index.css";
import { ITEMS, NPC_PROFILES, PHASE_COPY, SARDINE } from "./gameData";
import {
  advancePhase,
  createGame,
  labelShort,
  netWorth,
  performFreeAction,
  resetOrders,
  resolveEvent,
  resolveNoonMarket,
  unique,
} from "./gameEngine";
import { visibleMarketBoard } from "./npcAI";

function itemLabel(item) {
  if (!item) return "nothing";
  const data = ITEMS[item];
  return `${data?.icon || "📦"} ${item} · ${data?.value ?? 0}`;
}

function visibleStockForPlayer(game, trader) {
  if (trader.id === "player") return trader.inventory;

  const publicStock = (NPC_PROFILES[trader.id]?.publicStock || [])
    .filter((item) => trader.inventory.includes(item));
  const known = [...publicStock];

  // A public trade makes the buyer's newly acquired item market knowledge.
  game.history.forEach((trade) => {
    if (trade.from === trader.id && trader.inventory.includes(trade.item)) known.push(trade.item);
  });

  // First-pass investigation rule: spending time on a trader reveals one otherwise hidden holding.
  // Later this will become source/confidence-based knowledge rather than a binary reveal.
  if (game.intel[`${trader.id}:clue`]) {
    const hidden = trader.inventory.find((item) => !known.includes(item));
    if (hidden) known.push(hidden);
  }

  return unique(known);
}

function PhaseStrip({ game }) {
  const phases = ["sunrise", "morning", "noon", "afternoon", "sunset"];
  return (
    <div className="phase-strip" aria-label="Day phases">
      {phases.map((phase) => {
        const meta = PHASE_COPY[phase];
        return (
          <div key={phase} className={`phase-node ${game.phase === phase ? "active" : ""}`}>
            <span>{meta.icon}</span>
            <small>{meta.title}</small>
          </div>
        );
      })}
    </div>
  );
}

function Avatar({ trader, selected, onClick }) {
  return (
    <button className={`avatar ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="avatar-icon">{trader.icon}</div>
      <div className="avatar-name">{trader.name}</div>
      <div className="avatar-money">{SARDINE} {trader.sardines}</div>
    </button>
  );
}

function TraderDetail({ trader, profile, relationship, intel, visibleStock }) {
  return (
    <section className="card detail-card">
      <div className="detail-head">
        <div className="big-icon">{trader.icon}</div>
        <div className="detail-copy">
          <h2>{trader.name}</h2>
          <div className="muted">{trader.role}</div>
          {profile && <div className="tag">Observed style: {intel?.style || "not yet understood"}</div>}
          {profile && <div className="small muted">Familiarity: {relationship}</div>}
        </div>
      </div>
      <div className="section-title">What you know they have</div>
      <div className="chips">
        {visibleStock.length
          ? visibleStock.map((item) => <span className="chip" key={`${trader.id}-${item}`}>{itemLabel(item)}</span>)
          : <span className="muted">Nothing confirmed. Their real inventory may be larger.</span>}
      </div>
      {intel?.clue && <div className="intel-note">📝 {intel.clue}</div>}
    </section>
  );
}

function OrderRow({ index, order, setOrder, traders, visibleByTrader, playerInventory, usedItems, disabled }) {
  const target = traders[order.to];
  const targetStock = order.to ? (visibleByTrader[order.to] || []) : [];
  return (
    <div className="offer-row">
      <select
        value={order.to}
        disabled={disabled}
        onChange={(event) => setOrder(index, { to: event.target.value, wantItem: "", offerItem: "", sardines: 0 })}
      >
        <option value="">Counterparty</option>
        {Object.values(traders).filter((trader) => trader.id !== "player").map((trader) => (
          <option key={trader.id} value={trader.id}>{trader.icon} {trader.name}</option>
        ))}
      </select>
      <select
        value={order.wantItem}
        disabled={disabled || !target}
        onChange={(event) => setOrder(index, { ...order, wantItem: event.target.value })}
      >
        <option value="">Want</option>
        {targetStock.map((item) => <option key={item} value={item}>{itemLabel(item)}</option>)}
      </select>
      <select
        value={order.offerItem}
        disabled={disabled}
        onChange={(event) => setOrder(index, { ...order, offerItem: event.target.value })}
      >
        <option value="">No barter item</option>
        {playerInventory
          .filter((item) => !usedItems.includes(item) || item === order.offerItem)
          .map((item) => <option key={item} value={item}>{itemLabel(item)}</option>)}
      </select>
      <label className="sardine-input">
        <span>🥫</span>
        <input
          type="number"
          min="0"
          disabled={disabled}
          value={order.sardines}
          onChange={(event) => setOrder(index, { ...order, sardines: Math.max(0, Number(event.target.value || 0)) })}
        />
      </label>
    </div>
  );
}

function MarketBoard({ game }) {
  const board = visibleMarketBoard(game);
  return (
    <section className="card market-card">
      <div className="section-title">Noon board · committed before opening</div>
      <p className="muted board-note">These are real NPC intentions for today. They will not be rerolled when you clear the market.</p>
      <div className="stack">
        {board.length ? board.map((order, index) => (
          <div className="mini-card" key={`${order.from}-${order.wantItem}-${index}`}>
            <div><strong>{game.traders[order.from].icon} {game.traders[order.from].name}</strong> bids {order.sardines}🥫 for {labelShort(order.wantItem)}</div>
          </div>
        )) : <div className="muted">No NPC order clears at current prices. That is also market information.</div>}
      </div>
    </section>
  );
}

function TransactionTape({ game }) {
  const tape = [...game.history].reverse().slice(0, 12);
  return (
    <section className="card">
      <div className="section-title">Public tape</div>
      <div className="stack">
        {tape.length ? tape.map((trade) => (
          <div className="tape-row" key={trade.id}>
            <span>D{trade.day}</span>
            <span>{game.traders[trade.from]?.icon} → {game.traders[trade.to]?.icon}</span>
            <span>{labelShort(trade.item)}</span>
            <span>{trade.paymentItem ? `${labelShort(trade.paymentItem)} + ` : ""}{trade.sardines}🥫</span>
          </div>
        )) : <div className="muted">No public trades yet.</div>}
      </div>
    </section>
  );
}

function EventPanel({ game, onChoose }) {
  const [bid, setBid] = useState(16);
  if (!game.pendingEvents.length) return null;
  const event = game.pendingEvents[0];
  return (
    <section className="event-box">
      <div className="eyebrow">A lead became actionable</div>
      <h2>{event.title}</h2>
      <p>{event.text}</p>
      {event.id === "auction" && (
        <label className="bid-box">
          Your bid
          <input type="number" min="0" value={bid} onChange={(e) => setBid(Number(e.target.value || 0))} />
          <span>🥫</span>
        </label>
      )}
      <div className="event-actions">
        {event.actions.map((action) => (
          <button
            className={`btn ${action === event.actions[0] ? "gold" : "ghost"}`}
            key={action}
            onClick={() => onChoose(event.id, action, bid)}
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}

function ActionPanel({ game, selectedId, onAction }) {
  const selected = game.traders[selectedId];
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0 && selectedId !== "player";
  return (
    <section className="card">
      <div className="section-title">Free-time actions</div>
      <p className="muted">Morning and afternoon are free-form, but not infinite. Each meaningful action consumes time.</p>
      <div className="action-grid">
        <button className="btn" disabled={!active} onClick={() => onAction("talk", selectedId)}>
          Talk to {selectedId === "player" ? "someone" : selected.name}
        </button>
        <button className="btn" disabled={!active} onClick={() => onAction("investigate", selectedId)}>
          Investigate {selectedId === "player" ? "someone" : selected.name}
        </button>
      </div>
      <div className="small muted action-count">Time slots left this phase: {game.actionsRemaining}</div>
    </section>
  );
}

function LeadsPanel({ game }) {
  const entries = Object.entries(game.intel);
  return (
    <section className="card">
      <div className="section-title">Leads</div>
      <div className="stack">
        {entries.length ? entries.map(([key, value]) => (
          <div className="mini-card" key={key}>{value}</div>
        )) : <div className="muted">You do not know enough yet to call anything a lead.</div>}
      </div>
    </section>
  );
}

function phaseButton(game) {
  if (game.phase === "sunrise") return "Begin morning →";
  if (game.phase === "morning") return "Commit orders & go to noon →";
  if (game.phase === "noon" && !game.marketResolved) return "Clear the noon market";
  if (game.phase === "noon") return "Leave the market →";
  if (game.phase === "afternoon") return "Go to sunset →";
  return `Close Day ${game.day} →`;
}

export default function App() {
  const [game, setGame] = useState(() => createGame());
  const traders = game.traders;
  const player = traders.player;
  const selected = traders[game.selected] || player;
  const phase = PHASE_COPY[game.phase];
  const usedItems = game.playerOrders.map((order) => order.offerItem).filter(Boolean);
  const plannedSardines = game.playerOrders.reduce((sum, order) => sum + Number(order.sardines || 0), 0);

  const visibleByTrader = useMemo(() => Object.fromEntries(
    Object.values(traders).map((trader) => [trader.id, visibleStockForPlayer(game, trader)])
  ), [game, traders]);

  const selectedIntel = useMemo(() => ({
    style: game.intel[`${selected.id}:style`],
    clue: game.intel[`${selected.id}:clue`],
  }), [game.intel, selected.id]);

  function setSelected(id) {
    setGame((current) => ({ ...current, selected: id }));
  }

  function updateOrder(index, next) {
    setGame((current) => {
      const orders = [...current.playerOrders];
      orders[index] = next;
      return { ...current, playerOrders: orders };
    });
  }

  function handlePrimaryAction() {
    if (game.ended || game.pendingEvents.length) return;
    if (game.phase === "morning") {
      const chosen = game.playerOrders.map((order) => order.offerItem).filter(Boolean);
      if (chosen.length !== unique(chosen).length) {
        window.alert("You cannot commit the same payment item to two noon orders.");
        return;
      }
      if (plannedSardines > player.sardines) {
        window.alert("Your committed noon orders require more sardines than you currently have.");
        return;
      }
    }

    if (game.phase === "noon" && !game.marketResolved) {
      setGame((current) => resolveNoonMarket(current));
      return;
    }
    setGame((current) => advancePhase(current));
  }

  function handleFreeAction(action, targetId) {
    setGame((current) => performFreeAction(current, action, targetId));
  }

  function handleEvent(id, action, bid) {
    setGame((current) => resolveEvent(current, id, action, bid));
  }

  function restart() {
    setGame(createGame());
  }

  function clearOrders() {
    setGame((current) => ({ ...current, playerOrders: resetOrders() }));
  }

  return (
    <main className="app-shell">
      <div className="container">
        <header className="hero">
          <div>
            <div className="eyebrow">Sunflower · living market prototype</div>
            <h1>🌻 Day {game.day} / {game.maxDays}</h1>
            <p>{phase.icon} <strong>{phase.title}</strong> — {phase.subtitle}</p>
          </div>
          <button className="btn ghost" onClick={restart}>New Game</button>
        </header>

        <div className="sticky-status">
          <span>Day {game.day}</span>
          <span>{phase.icon} {phase.title}</span>
          <span>{SARDINE} {player.sardines}</span>
          <span>NW {netWorth(player)}</span>
        </div>

        <PhaseStrip game={game} />

        {game.ended && (
          <section className={`end-box ${game.winner ? "win-box" : "lose-box"}`}>
            <h2>{game.winner ? "🌻 You acquired the sunflower." : "The final sunset passed."}</h2>
            <p>{game.finalText}</p>
            {game.style && <div className="style-box"><strong>{game.style.name}</strong><p>{game.style.description}</p></div>}
          </section>
        )}

        <EventPanel game={game} onChoose={handleEvent} />

        <section className="main-layout">
          <div className="left-col">
            <div className="avatar-row">
              {Object.values(traders).map((trader) => (
                <Avatar
                  key={trader.id}
                  trader={trader}
                  selected={selected.id === trader.id}
                  onClick={() => setSelected(trader.id)}
                />
              ))}
            </div>

            <TraderDetail
              trader={selected}
              profile={NPC_PROFILES[selected.id]}
              relationship={game.relationships[selected.id] || 0}
              intel={selectedIntel}
              visibleStock={visibleByTrader[selected.id] || []}
            />

            {!game.ended && <ActionPanel game={game} selectedId={selected.id} onAction={handleFreeAction} />}

            <MarketBoard game={game} />

            {!game.ended && game.phase === "morning" && (
              <section className="card order-card">
                <div className="section-title">Your noon orders</div>
                <p className="muted board-note">Prototype rule: up to three committed offers. You can only target stock you have actually confirmed.</p>
                <div className="stack">
                  {game.playerOrders.map((order, index) => (
                    <OrderRow
                      key={index}
                      index={index}
                      order={order}
                      setOrder={updateOrder}
                      traders={traders}
                      visibleByTrader={visibleByTrader}
                      playerInventory={player.inventory}
                      usedItems={usedItems}
                      disabled={game.phase !== "morning"}
                    />
                  ))}
                </div>
                <div className="order-footer">
                  <span className="small muted">Committed cash: {plannedSardines} / {player.sardines}🥫</span>
                  <button className="btn ghost" onClick={clearOrders}>Clear</button>
                </div>
              </section>
            )}

            {game.phase === "noon" && !game.marketResolved && (
              <section className="card noon-callout">
                <div className="section-title">The market is open</div>
                <p>Your morning orders and the NPC orders above are now committed. Clearing moves actual inventory and sardines.</p>
              </section>
            )}

            <TransactionTape game={game} />

            {!!game.rejected.length && (
              <section className="card">
                <div className="section-title">Orders that did not clear</div>
                <div className="stack">
                  {game.rejected.map((order, index) => (
                    <div className="mini-card" key={index}>
                      {labelShort(order.wantItem)} from {traders[order.to]?.name}
                      <div className="small muted">{order.reason}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="right-col">
            <LeadsPanel game={game} />

            <section className="card">
              <div className="section-title">Today so far</div>
              <div className="stat-grid">
                <div><span>Public trades</span><strong>{game.history.filter((trade) => trade.day === game.day).length}</strong></div>
                <div><span>Free-time slots</span><strong>{game.actionsRemaining}</strong></div>
                <div><span>Known clues</span><strong>{Object.keys(game.intel).length}</strong></div>
                <div><span>Market heat</span><strong>{Object.values(game.heat).reduce((sum, n) => sum + n, 0)}</strong></div>
              </div>
            </section>

            <section className="card log-card">
              <div className="section-title">Harbour log</div>
              <div className="log-stack">
                {game.log.map((line, index) => <div className="log-line" key={`${line}-${index}`}>{line}</div>)}
              </div>
            </section>
          </aside>
        </section>

        {!game.ended && !game.pendingEvents.length && (
          <div className="bottom-action">
            <button className="btn gold primary-action" onClick={handlePrimaryAction}>
              {phaseButton(game)}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
