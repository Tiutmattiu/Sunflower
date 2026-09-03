import React, { useMemo, useState } from "react";
import "./index.css";
import {
  FORMS,
  INFO_BASE_PRICE,
  ITEMS,
  NPC_PROFILES,
  PHASE_COPY,
  PROXY_FEE,
  SARDINE,
  SUSTENANCE_PER_DAY,
} from "./gameData";
import {
  advancePhase,
  canAccessVenue,
  createGame,
  currentObligations,
  informationBuyers,
  knownItemsForTrader,
  labelShort,
  netWorth,
  performFreeAction,
  repayObligation,
  requestMarketProxy,
  resetOrders,
  resolveEvent,
  resolveNoonMarket,
  sellInformation,
  unique,
} from "./gameEngine";
import { visibleMarketBoard, visibleSellListings } from "./npcAI";

function itemName(item) {
  if (!item) return "nothing";
  return `${ITEMS[item]?.icon || "📦"} ${item}`;
}

function itemWithReference(item) {
  if (!item) return "nothing";
  const data = ITEMS[item];
  const price = Number.isFinite(data?.value) ? `ref ${data.value}🥫` : "unpriced";
  return `${data?.icon || "📦"} ${item} · ${price}`;
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

function NowPanel({ game }) {
  let text = "";
  if (game.phase === "sunrise") {
    text = "Start the morning. Before noon you can learn about people or prepare a trade.";
  } else if (game.phase === "morning") {
    text = game.actionsRemaining > 0
      ? `Before noon: learn or trade. You have ${game.actionsRemaining} time action${game.actionsRemaining === 1 ? "" : "s"} left.`
      : "Your morning time is spent. Review any order you want to place, then go to noon.";
  } else if (game.phase === "noon" && !game.marketResolved) {
    text = "Everything is committed. Clear the market once; competing orders are settled together.";
  } else if (game.phase === "noon") {
    text = "The market cleared. Read what actually traded, then leave the market.";
  } else if (game.phase === "afternoon") {
    text = game.actionsRemaining > 0
      ? `The tape is public now. You have ${game.actionsRemaining} time action${game.actionsRemaining === 1 ? "" : "s"} to follow up.`
      : "You are done for the afternoon. Go to sunset when you are ready.";
  } else {
    text = "The trading day is over. Food, obligations and perishables settle when you close the day.";
  }

  return (
    <section className="now-card" aria-live="polite">
      <strong>What now?</strong>
      <span>{text}</span>
    </section>
  );
}

function PlayerBar({ game }) {
  const player = game.traders.player;
  const edibleItems = player.inventory.filter((item) => (ITEMS[item]?.foodUnits || 0) >= SUSTENANCE_PER_DAY);
  const showTonight = game.phase === "sunset" || player.sardines <= 2;

  return (
    <section className="player-bar">
      <div className="player-balance"><strong>{SARDINE} {player.sardines}</strong><span>cash</span></div>
      <div className="player-inventory">
        <span className="small muted">You have</span>
        <div className="chips">
          {player.inventory.length
            ? player.inventory.map((item, index) => <span className="chip" key={`${item}-${index}`}>{itemName(item)}</span>)
            : <span className="muted">nothing in your hands</span>}
        </div>
      </div>
      {showTonight && (
        <div className="tonight-note small">
          Tonight: {edibleItems.length
            ? `${itemName(edibleItems[0])} can feed you.`
            : player.sardines >= SUSTENANCE_PER_DAY
              ? `${SUSTENANCE_PER_DAY}🥫 can be opened as food.`
              : "you will need food or credit."}
        </div>
      )}
    </section>
  );
}

function Avatar({ trader, selected, onClick }) {
  return (
    <button className={`avatar ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="avatar-icon">{trader.icon}</div>
      <div className="avatar-name">{trader.name}</div>
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
          {relationship > 0 && <div className="small muted">Familiarity: {relationship}</div>}
          {profile && intel?.style && <div className="tag">Observed style: {intel.style}</div>}
        </div>
      </div>
      <div className="section-title">What you know they have</div>
      <div className="chips">
        {visibleStock.length
          ? visibleStock.map((item) => <span className="chip" key={`${trader.id}-${item}`}>{itemName(item)}</span>)
          : <span className="muted">Nothing confirmed. Their real inventory may be larger.</span>}
      </div>
      {intel?.clue && <div className="intel-note">📝 {intel.clue}</div>}
    </section>
  );
}

function ActionPanel({ game, selectedId, onAction, onProxy }) {
  const selected = game.traders[selectedId];
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0;
  const proxyAvailable = active &&
    game.playerState.form === "animal" &&
    selectedId === "bar" &&
    (game.relationships.bar || 0) >= 2 &&
    !canAccessVenue(game, "formalMarket");

  return (
    <section className="card action-card">
      <div className="section-title">Spend time on {selected.name}</div>
      <div className="action-grid">
        <button className="btn" disabled={!active} onClick={() => onAction("talk", selectedId)}>
          Talk
        </button>
        <button className="btn" disabled={!active} onClick={() => onAction("investigate", selectedId)}>
          Investigate
        </button>
        {proxyAvailable && (
          <button className="btn" onClick={() => onProxy(selectedId)}>
            Ask for market proxy · {PROXY_FEE}🥫
          </button>
        )}
      </div>
      <div className="small muted action-count">Time actions left: {game.actionsRemaining}</div>
    </section>
  );
}

function LeadsPanel({ game, onSell }) {
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0;
  const entries = [...game.information].reverse();
  if (!entries.length) return null;

  return (
    <section className="card">
      <div className="section-title">What you have learned</div>
      <div className="stack">
        {entries.map((info) => {
          const buyers = informationBuyers(game, info);
          return (
            <div className="mini-card" key={info.id}>
              <div>{info.text}</div>
              <details className="micro-details">
                <summary>How solid is this?</summary>
                <div className="small muted">
                  precision {info.precision} · confidence {info.confidence} · {info.source} · observed D{info.observedDay}
                  {info.exclusive ? " · probably exclusive" : ""}
                </div>
              </details>
              {!!buyers.length && (
                <div className="action-grid">
                  {buyers.map((buyerId) => (
                    <button
                      className="btn"
                      key={`${info.id}-${buyerId}`}
                      disabled={!active}
                      onClick={() => onSell(info.id, buyerId)}
                    >
                      Sell this lead to {game.traders[buyerId].name} · {INFO_BASE_PRICE}🥫
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MarketBoard({ game }) {
  const bids = visibleMarketBoard(game);
  const listings = visibleSellListings(game);
  const grouped = listings.reduce((acc, listing) => {
    if (!acc[listing.sellerId]) acc[listing.sellerId] = [];
    acc[listing.sellerId].push(listing);
    return acc;
  }, {});

  return (
    <section className="card market-card">
      <div className="section-title">Today's public stalls</div>
      <div className="seller-lines">
        {Object.entries(grouped).length ? Object.entries(grouped).map(([sellerId, sellerListings]) => {
          const seller = game.traders[sellerId];
          return (
            <div className="seller-line" key={sellerId}>
              <strong>{seller.icon} {seller.name}</strong>
              <div className="market-chips">
                {sellerListings.map((listing) => (
                  <span className="market-chip" key={`${sellerId}-${listing.item}`}>
                    {itemName(listing.item)} <b>{listing.ask}🥫</b>
                  </span>
                ))}
              </div>
            </div>
          );
        }) : <div className="muted">Nothing is publicly listed right now.</div>}
      </div>

      <details className="market-disclosure" open={game.phase === "noon"}>
        <summary>Other traders' announced bids ({bids.length})</summary>
        <div className="stack disclosure-stack">
          {bids.length ? bids.map((order, index) => (
            <div className="mini-card" key={`${order.from}-${order.wantItem}-${index}`}>
              <strong>{game.traders[order.from].icon} {game.traders[order.from].name}</strong> bids {order.sardines}🥫 for {itemName(order.wantItem)}
            </div>
          )) : <div className="muted">No announced NPC buy bids at current prices and knowledge.</div>}
        </div>
      </details>
    </section>
  );
}

function OrderRow({ index, order, setOrder, traders, visibleByTrader, playerInventory, usedItems, disabled }) {
  const target = traders[order.to];
  const targetStock = order.to ? (visibleByTrader[order.to] || []) : [];

  return (
    <div className="order-box">
      <div className="order-number">Order {index + 1}</div>
      <div className="order-fields-simple">
        <label>
          <span>Buy from</span>
          <select
            value={order.to}
            disabled={disabled}
            onChange={(event) => setOrder(index, { to: event.target.value, wantItem: "", offerItem: "", sardines: 0 })}
          >
            <option value="">Choose seller</option>
            {Object.values(traders).filter((trader) => trader.id !== "player").map((trader) => (
              <option key={trader.id} value={trader.id}>{trader.icon} {trader.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Item</span>
          <select
            value={order.wantItem}
            disabled={disabled || !target}
            onChange={(event) => setOrder(index, { ...order, wantItem: event.target.value })}
          >
            <option value="">Choose item</option>
            {targetStock.map((item) => <option key={item} value={item}>{itemWithReference(item)}</option>)}
          </select>
        </label>
        <label>
          <span>Cash bid</span>
          <div className="cash-field">
            <span>🥫</span>
            <input
              type="number"
              min="0"
              disabled={disabled}
              value={order.sardines}
              onChange={(event) => setOrder(index, { ...order, sardines: Math.max(0, Number(event.target.value || 0)) })}
            />
          </div>
        </label>
      </div>
      <details className="micro-details barter-details">
        <summary>Optional: add one barter item</summary>
        <select
          aria-label={`Order ${index + 1} payment item`}
          value={order.offerItem}
          disabled={disabled}
          onChange={(event) => setOrder(index, { ...order, offerItem: event.target.value })}
        >
          <option value="">No barter item</option>
          {unique(playerInventory)
            .filter((item) => item === order.offerItem ||
              playerInventory.filter((held) => held === item).length > usedItems.filter((used) => used === item).length)
            .map((item) => <option key={item} value={item}>{itemWithReference(item)}</option>)}
        </select>
      </details>
    </div>
  );
}

function OrderPanel({ game, traders, visibleByTrader, player, usedItems, plannedSardines, updateOrder, clearOrders, visibleOrderCount, setVisibleOrderCount }) {
  return (
    <section className="card order-card">
      <div className="section-title">Your noon order</div>
      <p className="muted board-note">Pick something publicly known, then choose what you are willing to pay. If someone else wants the same unit, the seller compares offers at noon.</p>
      <div className="stack">
        {game.playerOrders.slice(0, visibleOrderCount).map((order, index) => (
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
        <span className="small muted">Cash committed: {plannedSardines} / {player.sardines}🥫</span>
        <div className="inline-actions">
          {visibleOrderCount < 3 && (
            <button className="btn ghost" onClick={() => setVisibleOrderCount((count) => Math.min(3, count + 1))}>
              Add another order
            </button>
          )}
          <button className="btn ghost" onClick={clearOrders}>Clear</button>
        </div>
      </div>
    </section>
  );
}

function TransactionTape({ game }) {
  const tape = [...game.history].reverse().slice(0, 8);
  if (!tape.length) return null;

  return (
    <section className="card">
      <div className="section-title">What actually traded</div>
      <div className="stack">
        {tape.map((trade) => (
          <div className="tape-row" key={trade.id}>
            <span>D{trade.day}</span>
            <span title="Goods move from seller to buyer">{game.traders[trade.to]?.icon} → {game.traders[trade.from]?.icon}</span>
            <span>{labelShort(trade.item)}</span>
            <span>{trade.paymentItem ? `${labelShort(trade.paymentItem)} + ` : ""}{trade.sardines}🥫</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ObligationsPanel({ game, onRepay }) {
  const obligations = currentObligations(game);
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0;
  if (!obligations.length) return null;

  return (
    <section className="card">
      <div className="section-title">Promises you owe</div>
      <div className="stack">
        {obligations.map((obligation) => {
          const creditor = game.traders[obligation.creditorId];
          return (
            <div className="mini-card" key={obligation.id}>
              <div><strong>{obligation.amount}🥫</strong> owed to {creditor?.name || obligation.creditorId}</div>
              <div className="small muted">due D{obligation.dueDay} · {obligation.status}</div>
              <button
                className="btn"
                disabled={!active || game.traders.player.sardines < obligation.amount}
                onClick={() => onRepay(obligation.id)}
              >
                Repay · {obligation.amount}🥫
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AccessPanel({ game }) {
  const form = FORMS[game.playerState.form];
  const exceptional = game.playerState.form !== "human" ||
    game.playerState.legalIdentity.status !== "recognized" ||
    game.estates.length > 0 ||
    !canAccessVenue(game, "formalMarket");
  if (!exceptional) return null;

  return (
    <section className="card">
      <div className="section-title">Your current access</div>
      <div className="stack">
        <div className="mini-card">{form.icon} {form.label} · legal identity {game.playerState.legalIdentity.status}</div>
        <div className="mini-card">Public Market: {canAccessVenue(game, "formalMarket") ? "direct access" : "proxy required"}</div>
        {!!game.estates.length && <div className="mini-card">Former estates remembered but not currently claimable: {game.estates.length}</div>}
      </div>
    </section>
  );
}

function EventPanel({ game, onChoose }) {
  const [bid, setBid] = useState(52);
  if (!game.pendingEvents.length) return null;
  const event = game.pendingEvents[0];

  return (
    <section className="event-box">
      <div className="eyebrow">Something became possible</div>
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

function phaseButton(game) {
  if (game.phase === "sunrise") return "Begin morning →";
  if (game.phase === "morning") return "Go to noon →";
  if (game.phase === "noon" && !game.marketResolved) return "Clear the noon market";
  if (game.phase === "noon") return "Leave the market →";
  if (game.phase === "afternoon") return "Go to sunset →";
  return `Close Day ${game.day} →`;
}

export default function App() {
  const [game, setGame] = useState(() => createGame());
  const [morningView, setMorningView] = useState("learn");
  const [visibleOrderCount, setVisibleOrderCount] = useState(1);
  const traders = game.traders;
  const player = traders.player;
  const selectedId = game.selected && game.selected !== "player" ? game.selected : "dog";
  const selected = traders[selectedId];
  const phase = PHASE_COPY[game.phase];
  const form = FORMS[game.playerState.form];
  const usedItems = game.playerOrders.map((order) => order.offerItem).filter(Boolean);
  const plannedSardines = game.playerOrders.reduce((sum, order) => sum + Number(order.sardines || 0), 0);
  const obligations = currentObligations(game);

  const visibleByTrader = useMemo(() => Object.fromEntries(
    Object.values(traders).map((trader) => [trader.id, knownItemsForTrader(game, trader.id)])
  ), [game, traders]);

  const selectedIntel = useMemo(() => {
    const styleInfo = game.information.find((info) => info.subjectId === selected.id && info.claimType === "style");
    const pressureInfo = [...game.information].reverse().find((info) => info.subjectId === selected.id && info.claimType === "pressure");
    return {
      style: styleInfo?.text?.replace(`${selected.name} trades like a `, "").replace(/\.$/, "") || game.intel[`${selected.id}:style`],
      clue: pressureInfo?.text || game.intel[`${selected.id}:clue`],
    };
  }, [game.information, game.intel, selected.id, selected.name]);

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
      if (chosen.some((item) => chosen.filter((payment) => payment === item).length > player.inventory.filter((held) => held === item).length)) {
        window.alert("You cannot commit more copies of a payment item than you own.");
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
    if (game.phase === "sunset") {
      setMorningView("learn");
      setVisibleOrderCount(1);
    }
  }

  function handleFreeAction(action, targetId) {
    setGame((current) => performFreeAction(current, action, targetId));
  }

  function handleSellInformation(infoId, buyerId) {
    setGame((current) => sellInformation(current, infoId, buyerId));
  }

  function handleProxy(targetId) {
    setGame((current) => requestMarketProxy(current, targetId));
  }

  function handleRepay(obligationId) {
    setGame((current) => repayObligation(current, obligationId));
  }

  function handleEvent(id, action, bid) {
    setGame((current) => resolveEvent(current, id, action, bid));
  }

  function restart() {
    setGame(createGame());
    setMorningView("learn");
    setVisibleOrderCount(1);
  }

  function clearOrders() {
    setGame((current) => ({ ...current, playerOrders: resetOrders() }));
    setVisibleOrderCount(1);
  }

  const showPeople = game.phase === "morning" && morningView === "learn" || game.phase === "afternoon";
  const showTradePrep = game.phase === "morning" && morningView === "trade";
  const showMarket = showTradePrep || game.phase === "noon";
  const showTape = game.phase === "noon" && game.marketResolved || game.phase === "afternoon" || game.phase === "sunset";

  if (game.ended) {
    return (
      <main className="app-shell">
        <div className="container end-container">
          <header className="hero compact-hero">
            <div>
              <div className="eyebrow">Sunflower · living market prototype</div>
              <h1>🌇 Day {game.day}</h1>
            </div>
            <button className="btn ghost" onClick={restart}>New Game</button>
          </header>
          <section className={`end-box ${game.winner ? "win-box" : "lose-box"}`}>
            <h2>This prototype life ended.</h2>
            <p>{game.finalText}</p>
            {game.style && <div className="style-box"><strong>{game.style.name}</strong><p>{game.style.description}</p></div>}
          </section>
          <section className="card end-summary">
            <div className="section-title">What you ended with</div>
            <div className="chips">
              <span className="chip">{SARDINE} {player.sardines}</span>
              {player.inventory.map((item, index) => <span className="chip" key={`${item}-${index}`}>{itemName(item)}</span>)}
            </div>
          </section>
          <button className="btn gold restart-large" onClick={restart}>Start another life →</button>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="container">
        <header className="hero compact-hero">
          <div>
            <div className="eyebrow">Sunflower · living market prototype</div>
            <h1>🌻 Day {game.day}</h1>
            <p className="muted small">Objective: <strong>{game.objective}</strong></p>
          </div>
          <button className="btn ghost" onClick={restart}>New Game</button>
        </header>

        <div className="sticky-status">
          <span>Day {game.day}</span>
          <span>{phase.icon} {phase.title}</span>
          <span>{SARDINE} {player.sardines}</span>
          {game.playerState.form !== "human" && <span>{form.icon} {form.label}</span>}
        </div>

        <PhaseStrip game={game} />
        <NowPanel game={game} />
        <PlayerBar game={game} />

        {game.flags.sunflowerAcquired && (
          <section className="card noon-callout">
            <div className="section-title">🌻 You have a sunflower.</div>
            <p><strong>Nothing happens.</strong> It is in your inventory. You are still here.</p>
            <p className="muted">Objective: {game.objective}</p>
          </section>
        )}

        <EventPanel game={game} onChoose={handleEvent} />

        {game.phase === "morning" && (
          <div className="mode-switch" role="group" aria-label="Morning activity">
            <button className={`btn ${morningView === "learn" ? "gold" : "ghost"}`} onClick={() => setMorningView("learn")}>Learn</button>
            <button className={`btn ${morningView === "trade" ? "gold" : "ghost"}`} onClick={() => setMorningView("trade")}>Trade</button>
          </div>
        )}

        {showPeople && (
          <section className="play-flow">
            <div className="avatar-row" aria-label="People in the harbour">
              {Object.values(traders).filter((trader) => trader.id !== "player").map((trader) => (
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
            <ActionPanel game={game} selectedId={selected.id} onAction={handleFreeAction} onProxy={handleProxy} />
            <LeadsPanel game={game} onSell={handleSellInformation} />
            <ObligationsPanel game={game} onRepay={handleRepay} />
            <AccessPanel game={game} />
          </section>
        )}

        {showMarket && (
          <section className="play-flow">
            <MarketBoard game={game} />
            {showTradePrep && (
              <OrderPanel
                game={game}
                traders={traders}
                visibleByTrader={visibleByTrader}
                player={player}
                usedItems={usedItems}
                plannedSardines={plannedSardines}
                updateOrder={updateOrder}
                clearOrders={clearOrders}
                visibleOrderCount={visibleOrderCount}
                setVisibleOrderCount={setVisibleOrderCount}
              />
            )}
            {game.phase === "noon" && !game.marketResolved && (
              <section className="card noon-callout">
                <div className="section-title">The market is ready to clear</div>
                <p>Your order and the announced NPC bids are now fixed for this noon.</p>
              </section>
            )}
          </section>
        )}

        {showTape && <TransactionTape game={game} />}

        {!!game.rejected.length && game.phase === "noon" && (
          <section className="card">
            <div className="section-title">Your orders that did not clear</div>
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

        {game.phase === "sunset" && (
          <section className="sunset-summary card">
            <div className="section-title">Before sleep</div>
            <p className="muted">Closing the day will settle food, obligations, perishables and tomorrow's business arrivals.</p>
            {!!obligations.length && <p>You currently owe {obligations.reduce((sum, item) => sum + item.amount, 0)}🥫.</p>}
          </section>
        )}

        <details className="advanced-details">
          <summary>More details</summary>
          <div className="advanced-inner">
            <div>Net worth by current reference prices: {netWorth(player)}🥫</div>
            <div>Known information objects: {game.information.length}</div>
            <div>Public trades recorded: {game.history.length}</div>
            <div>Legal identity: {game.playerState.legalIdentity.status}</div>
            <details className="log-details">
              <summary>Harbour log</summary>
              <div className="log-stack">
                {game.log.map((line, index) => <div className="log-line" key={`${line}-${index}`}>{line}</div>)}
              </div>
            </details>
          </div>
        </details>

        {!game.pendingEvents.length && (
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
