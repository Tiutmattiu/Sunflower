import React, { useEffect, useMemo, useState } from "react";
import "./index.css";
import {
  FORMS,
  INFO_BASE_PRICE,
  ITEMS,
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

const SAVE_KEY = "sunflower-living-market-v4";
const phases = ["sunrise", "morning", "noon", "afternoon", "sunset"];

function loadGame() {
  try {
    const saved = window.localStorage.getItem(SAVE_KEY);
    if (!saved) return createGame();
    const parsed = JSON.parse(saved);
    if (!parsed?.game?.traders?.player || parsed.version !== 4) return createGame();
    return parsed.game;
  } catch {
    return createGame();
  }
}

function hadSavedGame() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVE_KEY) || "null");
    return Boolean(parsed?.version === 4 && parsed?.game?.traders?.player);
  } catch {
    return false;
  }
}

function itemName(item) {
  if (!item) return "nothing";
  return `${ITEMS[item]?.icon || "📦"} ${item}`;
}

function itemReference(item) {
  const value = ITEMS[item]?.value;
  return Number.isFinite(value) ? `${value}🥫 ref` : "unpriced";
}

function relationshipLabel(value) {
  if (value <= 0) return "stranger";
  if (value === 1) return "recognises you";
  if (value === 2) return "familiar";
  return "knows you well";
}

function phaseButton(game) {
  if (game.phase === "sunrise") return "Begin morning →";
  if (game.phase === "morning") {
    const count = game.playerOrders.filter((order) => order.to && order.wantItem).length;
    return count ? `Lock ${count} order${count === 1 ? "" : "s"} & open noon →` : "Open noon without an order →";
  }
  if (game.phase === "noon" && !game.marketResolved) return "Settle the locked noon market →";
  if (game.phase === "noon") return "Leave noon →";
  if (game.phase === "afternoon") return "Go to sunset →";
  return `Close Day ${game.day} →`;
}

function PhaseStrip({ game }) {
  return (
    <div className="phase-strip" aria-label="Day phases">
      {phases.map((id) => (
        <div key={id} className={`phase-node ${game.phase === id ? "active" : ""}`}>
          <span>{PHASE_COPY[id].icon}</span>
          <small>{PHASE_COPY[id].title}</small>
        </div>
      ))}
    </div>
  );
}

function RightNow({ game }) {
  let text = "";
  if (game.phase === "sunrise") text = "No trade has started. Open the morning when you are ready.";
  if (game.phase === "morning") text = game.actionsRemaining > 0
    ? `Learn spends time. Trade only writes orders. ${game.actionsRemaining} time action${game.actionsRemaining === 1 ? "" : "s"} left before noon.`
    : "Your morning time is spent. You may still edit written orders before locking noon.";
  if (game.phase === "noon" && !game.marketResolved) text = "Orders are locked. Nothing has traded yet. Settle once when you are ready.";
  if (game.phase === "noon" && game.marketResolved) text = "Noon has settled. Read your result before leaving the market.";
  if (game.phase === "afternoon") text = game.actionsRemaining > 0
    ? `The public tape now exists. You have ${game.actionsRemaining} follow-up action${game.actionsRemaining === 1 ? "" : "s"}.`
    : "The afternoon is finished. Go to sunset when you are ready.";
  if (game.phase === "sunset") text = "Closing the day settles food, obligations, perishables and business activity.";
  return <section className="now-card"><strong>Right now</strong><span>{text}</span></section>;
}

function PlayerDesk({ game }) {
  const player = game.traders.player;
  const edible = player.inventory.find((item) => (ITEMS[item]?.foodUnits || 0) >= SUSTENANCE_PER_DAY);
  return (
    <section className="player-bar">
      <div className="player-balance"><strong>{SARDINE} {player.sardines}</strong><span>cash</span></div>
      <div className="player-inventory">
        <span className="small muted">On your side of the desk</span>
        <div className="chips">
          {player.inventory.length
            ? player.inventory.map((item, index) => <span className="chip" key={`${item}-${index}`}>{itemName(item)}</span>)
            : <span className="muted">nothing</span>}
        </div>
      </div>
      {(game.phase === "sunset" || player.sardines <= 2) && (
        <div className="tonight-note small">
          Tonight: {edible ? `${itemName(edible)} can feed you.` : player.sardines ? "you can open 1🥫 as food." : "you will need food or credit."}
        </div>
      )}
    </section>
  );
}

function PeopleStrip({ game, selectedId, onSelect }) {
  return (
    <div className="avatar-row" aria-label="People in the harbour">
      {Object.values(game.traders).filter((trader) => trader.id !== "player").map((trader) => (
        <button key={trader.id} className={`avatar ${selectedId === trader.id ? "selected" : ""}`} onClick={() => onSelect(trader.id)}>
          <div className="avatar-icon">{trader.icon}</div>
          <div className="avatar-name">{trader.name}</div>
        </button>
      ))}
    </div>
  );
}

function PersonDesk({ game, selectedId, onAction, onProxy }) {
  const trader = game.traders[selectedId];
  const visible = knownItemsForTrader(game, selectedId);
  const relationship = game.relationships[selectedId] || 0;
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0;
  const proxyAvailable = active && game.playerState.form === "animal" && selectedId === "bar" && relationship >= 2 && !canAccessVenue(game, "formalMarket");
  const interaction = game.lastInteraction?.targetId === selectedId ? game.lastInteraction : null;

  return (
    <section className="focus-desk">
      <section className="card detail-card">
        <div className="detail-head">
          <div className="big-icon">{trader.icon}</div>
          <div className="detail-copy">
            <h2>{trader.name}</h2>
            <div className="muted">{trader.role}</div>
            <div className="small muted">With you: {relationshipLabel(relationship)}</div>
          </div>
        </div>
        <div className="section-title">What you can actually confirm</div>
        <div className="chips">
          {visible.length ? visible.map((item) => <span className="chip" key={item}>{itemName(item)}</span>) : <span className="muted">Nothing yet.</span>}
        </div>
      </section>

      <section className="card action-card">
        <div className="section-title">Choose how to spend time</div>
        <div className="verb-explainer">
          <div><strong>Talk</strong><span>Know the person. Builds a relationship. What they volunteer depends on who they are and how well they know you.</span></div>
          <div><strong>Investigate</strong><span>Look for trade-relevant facts. Better for holdings, needs, deadlines and anomalies; it does not make you closer.</span></div>
        </div>
        <div className="action-grid">
          <button className="btn" disabled={!active} onClick={() => onAction("talk", selectedId)}>Talk to {trader.name}</button>
          <button className="btn" disabled={!active} onClick={() => onAction("investigate", selectedId)}>Investigate {trader.name}</button>
          {proxyAvailable && <button className="btn" onClick={() => onProxy(selectedId)}>Ask for market proxy · {PROXY_FEE}🥫</button>}
        </div>
        <div className="small muted action-count">Time actions left: {game.actionsRemaining}</div>
      </section>

      {interaction && (
        <section className={`card interaction-result ${interaction.action === "investigate" ? "investigation-result" : "conversation-result"}`}>
          <div className="section-title">{interaction.action === "talk" ? "Conversation" : interaction.action === "investigate" ? "What you found" : "What happened"}</div>
          <p>{interaction.text}</p>
          {interaction.note && <div className="intel-note">{interaction.note}</div>}
        </section>
      )}
    </section>
  );
}

function Notebook({ game, onSell }) {
  if (!game.information.length) return null;
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0;
  return (
    <details className="notebook-drawer">
      <summary>Your notebook · {game.information.length} note{game.information.length === 1 ? "" : "s"}</summary>
      <div className="stack notebook-stack">
        {[...game.information].reverse().map((info) => {
          const buyers = informationBuyers(game, info);
          return (
            <div className="mini-card note-card" key={info.id}>
              <div>{info.text}</div>
              <div className="small muted">{info.precision} precision · {info.confidence} confidence · {info.freshness} · source: {info.source}</div>
              {!!buyers.length && <div className="action-grid">{buyers.map((buyerId) => (
                <button className="btn" disabled={!active} key={`${info.id}-${buyerId}`} onClick={() => onSell(info.id, buyerId)}>
                  Sell this lead to {game.traders[buyerId].name} · {INFO_BASE_PRICE}🥫
                </button>
              ))}</div>}
            </div>
          );
        })}
      </div>
    </details>
  );
}

function SellerStrip({ game, selectedId, onSelect }) {
  const listings = visibleSellListings(game);
  const sellers = unique(listings.map((listing) => listing.sellerId));
  return (
    <div className="seller-tabs" aria-label="Public sellers">
      {sellers.map((id) => {
        const trader = game.traders[id];
        const count = listings.filter((listing) => listing.sellerId === id).length;
        return <button key={id} className={`seller-tab ${selectedId === id ? "selected" : ""}`} onClick={() => onSelect(id)}>{trader.icon} {trader.name}<small>{count} listed</small></button>;
      })}
    </div>
  );
}

function StallSheet({ game, sellerId, onBid }) {
  const seller = game.traders[sellerId];
  const listings = visibleSellListings(game).filter((listing) => listing.sellerId === sellerId);
  return (
    <section className="card market-card">
      <div className="section-title">{seller.icon} {seller.name}'s public stall</div>
      <p className="muted small">Only publicly offered stock appears here. A price marked <strong>ask</strong> is the cash price the seller is currently posting.</p>
      <div className="listing-stack">
        {listings.length ? listings.map((listing) => (
          <div className="listing-row" key={listing.item}>
            <div><strong>{itemName(listing.item)}</strong><small>{itemReference(listing.item)}</small></div>
            <div className="listing-price">ask <strong>{listing.ask}🥫</strong></div>
            <button className="btn write-bid" onClick={() => onBid(listing)}>Write bid</button>
          </div>
        )) : <div className="muted">Nothing publicly listed.</div>}
      </div>
    </section>
  );
}

function OrderSlip({ game, order, index, updateOrder, usedItems }) {
  const targetStock = order.to ? knownItemsForTrader(game, order.to) : [];
  const publicListing = visibleSellListings(game).find((listing) => listing.sellerId === order.to && listing.item === order.wantItem);
  const cashOnlyBelowAsk = publicListing && !order.offerItem && Number(order.sardines || 0) < publicListing.ask;
  const cashOnlyMeetsAsk = publicListing && !order.offerItem && Number(order.sardines || 0) >= publicListing.ask;

  return (
    <div className="order-box">
      <div className="order-number">Order {index + 1}</div>
      <div className="order-fields-simple">
        <label><span>Seller</span><select value={order.to} onChange={(event) => updateOrder(index, { to: event.target.value, wantItem: "", offerItem: "", sardines: 0 })}>
          <option value="">Choose seller</option>
          {Object.values(game.traders).filter((trader) => trader.id !== "player").map((trader) => <option key={trader.id} value={trader.id}>{trader.icon} {trader.name}</option>)}
        </select></label>
        <label><span>Item</span><select value={order.wantItem} disabled={!order.to} onChange={(event) => updateOrder(index, { ...order, wantItem: event.target.value })}>
          <option value="">Choose item</option>
          {targetStock.map((item) => <option key={item} value={item}>{itemName(item)} · {itemReference(item)}</option>)}
        </select></label>
        <label><span>Your cash bid</span><div className="cash-field"><span>🥫</span><input type="number" min="0" value={order.sardines} onChange={(event) => updateOrder(index, { ...order, sardines: Math.max(0, Number(event.target.value || 0)) })} /></div></label>
      </div>
      {publicListing && <p className="small muted">Posted ask: <strong>{publicListing.ask}🥫</strong>.</p>}
      {cashOnlyBelowAsk && <div className="order-warning">Below the posted ask. On cash alone this order will be rejected before it competes.</div>}
      {cashOnlyMeetsAsk && <div className="order-ok">Cash meets the current ask. The unit is still not yours: another eligible order may beat or tie yours at Noon.</div>}
      <details className="micro-details barter-details"><summary>Optional barter item</summary><select value={order.offerItem} onChange={(event) => updateOrder(index, { ...order, offerItem: event.target.value })}>
        <option value="">No barter item</option>
        {unique(game.traders.player.inventory)
          .filter((item) => item === order.offerItem || game.traders.player.inventory.filter((held) => held === item).length > usedItems.filter((used) => used === item).length)
          .map((item) => <option key={item} value={item}>{itemName(item)} · {itemReference(item)}</option>)}
      </select><p className="small muted">A seller can value your barter item above or below its reference price. Their private valuation is not shown.</p></details>
    </div>
  );
}

function OrderWriter({ game, updateOrder, clearOrders, visibleOrderCount, setVisibleOrderCount }) {
  const usedItems = game.playerOrders.map((order) => order.offerItem).filter(Boolean);
  const committedCash = game.playerOrders.reduce((sum, order) => sum + Number(order.sardines || 0), 0);
  return (
    <section className="card order-card">
      <div className="section-title">Your order sheet</div>
      <p className="board-note"><strong>Nothing trades while you write this.</strong> The sheet becomes binding only when you lock the morning and open Noon.</p>
      <div className="stack">{game.playerOrders.slice(0, visibleOrderCount).map((order, index) => (
        <OrderSlip key={index} game={game} order={order} index={index} updateOrder={updateOrder} usedItems={usedItems} />
      ))}</div>
      <div className="order-footer">
        <span className="small muted">Cash written into orders: {committedCash} / {game.traders.player.sardines}🥫</span>
        <div className="inline-actions">
          {visibleOrderCount < 3 && <button className="btn ghost" onClick={() => setVisibleOrderCount((count) => Math.min(3, count + 1))}>Add another order</button>}
          <button className="btn ghost" onClick={clearOrders}>Clear sheet</button>
        </div>
      </div>
    </section>
  );
}

function AnnouncedBids({ game, open = false }) {
  const bids = visibleMarketBoard(game);
  return (
    <details className="market-disclosure" open={open}>
      <summary>Other traders' announced buy orders · {bids.length}</summary>
      <div className="stack disclosure-stack">
        {bids.length ? bids.map((bid, index) => (
          <div className="mini-card" key={`${bid.from}-${bid.wantItem}-${index}`}>{game.traders[bid.from].icon} <strong>{game.traders[bid.from].name}</strong> bids {bid.sardines}🥫 for {itemName(bid.wantItem)}</div>
        )) : <div className="muted">No announced buy orders.</div>}
      </div>
    </details>
  );
}

function LockedOrders({ game }) {
  return (
    <section className="card locked-sheet">
      <div className="lock-stamp">NOT SETTLED</div>
      <div className="section-title">Your locked Noon orders</div>
      {game.lockedPlayerOrders.length ? <div className="stack">{game.lockedPlayerOrders.map((order, index) => (
        <div className="mini-card" key={index}>
          <strong>{itemName(order.wantItem)}</strong> from {game.traders[order.to]?.name}
          <div className="small muted">Your bid: {order.sardines}🥫{order.offerItem ? ` + ${itemName(order.offerItem)}` : ""}{Number.isFinite(order.postedAsk) ? ` · posted ask when locked: ${order.postedAsk}🥫` : ""}</div>
        </div>
      ))}</div> : <p>You locked no order. You can still watch the market settle without you.</p>}
    </section>
  );
}

function publicPaymentText(game, rejected) {
  if (!rejected.winnerId) return null;
  return `${game.traders[rejected.winnerId]?.name || "Another bidder"} paid ${rejected.winnerSardines || 0}🥫${rejected.winnerPaymentItem ? ` + ${itemName(rejected.winnerPaymentItem)}` : ""}.`;
}

function rejectionText(game, order) {
  if (order.reasonCode === "below-ask") {
    if (!order.offerItem && Number.isFinite(order.postedAsk)) return `You offered ${order.sardines}🥫 against a posted ask of ${order.postedAsk}🥫. It was below the seller's public minimum, so the order never entered competition.`;
    if (Number.isFinite(order.postedAsk)) return `The seller valued your cash + barter package below the posted ask of ${order.postedAsk}🥫. Their private value for your barter item is not public.`;
    return "The seller valued your payment package below the minimum they would accept.";
  }
  if (order.reasonCode === "outbid") return `Your order was eligible, but another committed offer got the available unit. ${publicPaymentText(game, order) || ""} Equal seller-valued offers use the day's rotating priority.`;
  if (order.reasonCode === "resource-used") return "Another filled order already used opening cash or the barter item this order needed. Noon does not recycle newly received cash or goods.";
  if (order.reasonCode === "stale-stock") return "Your information was stale: the seller no longer had the item when Noon opened.";
  if (order.reasonCode === "unknown-holding") return "You tried to target a holding that was no longer current enough to treat as known stock.";
  if (order.reasonCode === "no-access") return "Your current legal form cannot settle directly in the formal market. You need recognised access or a proxy.";
  if (order.reasonCode === "unfunded") return "You did not have the opening cash or barter item written into this order.";
  if (order.reasonCode === "invalid") return "The order was malformed and could not enter the market.";
  return order.reason || "This order did not settle.";
}

function NoonResults({ game }) {
  const fills = game.marketOutcome.filter((trade) => trade.from === "player");
  return (
    <section className="card result-sheet">
      <div className="section-title">Your Noon result</div>
      {!fills.length && !game.rejected.length && <p>You submitted no order, so nothing on your sheet could fill.</p>}
      {!!fills.length && <div className="stack result-group"><strong>Filled</strong>{fills.map((trade, index) => (
        <div className="result-row success-result" key={index}>You bought <strong>{itemName(trade.wantItem)}</strong> from {game.traders[trade.to]?.name} for {trade.sardines}🥫{trade.offerItem ? ` + ${itemName(trade.offerItem)}` : ""}.</div>
      ))}</div>}
      {!!game.rejected.length && <div className="stack result-group"><strong>Did not fill</strong>{game.rejected.map((order, index) => (
        <div className="result-row failure-result" key={index}><strong>{itemName(order.wantItem)}</strong> from {game.traders[order.to]?.name}<div>{rejectionText(game, order)}</div></div>
      ))}</div>}
    </section>
  );
}

function PublicTape({ game }) {
  const trades = [...game.history].filter((trade) => trade.day === game.day).reverse();
  if (!trades.length) return null;
  return (
    <details className="tape-drawer" open={game.phase === "afternoon"}>
      <summary>Today's public transaction tape · {trades.length} trade{trades.length === 1 ? "" : "s"}</summary>
      <div className="stack tape-stack">{trades.map((trade) => (
        <div className="tape-row" key={trade.id}>
          <span>{game.traders[trade.to]?.icon} → {game.traders[trade.from]?.icon}</span>
          <span>{labelShort(trade.item)}</span>
          <span>{trade.paymentItem ? `${labelShort(trade.paymentItem)} + ` : ""}{trade.sardines}🥫</span>
        </div>
      ))}</div>
    </details>
  );
}

function Obligations({ game, onRepay }) {
  const obligations = currentObligations(game);
  if (!obligations.length) return null;
  const active = ["morning", "afternoon"].includes(game.phase) && game.actionsRemaining > 0;
  return (
    <section className="card obligation-sheet">
      <div className="section-title">Promises now matter</div>
      <div className="stack">{obligations.map((obligation) => (
        <div className="mini-card" key={obligation.id}>
          <strong>{obligation.amount}🥫 owed to {game.traders[obligation.creditorId]?.name || obligation.creditorId}</strong>
          <div className="small muted">Due Day {obligation.dueDay} · {obligation.status}</div>
          <button className="btn" disabled={!active || game.traders.player.sardines < obligation.amount} onClick={() => onRepay(obligation.id)}>Repay</button>
        </div>
      ))}</div>
    </section>
  );
}

function AccessNotice({ game }) {
  const unusual = game.playerState.form !== "human" || game.playerState.legalIdentity.status !== "recognized" || !canAccessVenue(game, "formalMarket") || game.estates.length;
  if (!unusual) return null;
  const form = FORMS[game.playerState.form];
  return (
    <section className="card access-sheet">
      <div className="section-title">The rules recognise you differently now</div>
      <p>{form.icon} {form.label} · legal identity {game.playerState.legalIdentity.status}</p>
      <p className="muted">Formal market: {canAccessVenue(game, "formalMarket") ? "access available" : "direct access unavailable; a recognised proxy can bridge it"}.</p>
      {!!game.estates.length && <p className="muted">You remember {game.estates.length} former estate{game.estates.length === 1 ? "" : "s"}, but this legal identity cannot simply claim them.</p>}
    </section>
  );
}

function EventDesk({ game, onChoose }) {
  const [bid, setBid] = useState(52);
  if (!game.pendingEvents.length) return null;
  return (
    <section className="opportunity-stack">
      {game.pendingEvents.map((event) => (
        <section className="event-box" key={event.id}>
          <div className="eyebrow">An opportunity became real</div>
          <h2>{event.title}</h2>
          <p>{event.text}</p>
          {event.id === "auction" && <label className="bid-box">Your bid<input type="number" min="0" value={bid} onChange={(e) => setBid(Number(e.target.value || 0))} /><span>🥫</span></label>}
          <div className="event-actions">{event.actions.map((action, index) => (
            <button className={`btn ${index === 0 ? "gold" : "ghost"}`} key={action} onClick={() => onChoose(event.id, action, bid)}>{action}</button>
          ))}</div>
        </section>
      ))}
    </section>
  );
}

function DeveloperDrawer({ game }) {
  return (
    <details className="advanced-details">
      <summary>Developer / notebook details</summary>
      <div className="advanced-inner">
        <div>Known information objects: {game.information.length}</div>
        <div>Public trades recorded: {game.history.length}</div>
        <div>Legal identity: {game.playerState.legalIdentity.status}</div>
        <details className="log-details"><summary>Harbour log</summary><div className="log-stack">{game.log.map((line, index) => <div className="log-line" key={`${line}-${index}`}>{line}</div>)}</div></details>
      </div>
    </details>
  );
}

export default function App() {
  const [game, setGame] = useState(loadGame);
  const [entered, setEntered] = useState(hadSavedGame);
  const [mode, setMode] = useState("learn");
  const [selectedPerson, setSelectedPerson] = useState("dog");
  const [selectedSeller, setSelectedSeller] = useState(() => visibleSellListings(loadGame())[0]?.sellerId || "fishmonger");
  const [visibleOrderCount, setVisibleOrderCount] = useState(1);
  const [uiError, setUiError] = useState("");

  useEffect(() => {
    if (!entered) return;
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 4, game }));
    } catch {
      // Persistence is convenience only; a full storage failure must not stop play.
    }
  }, [game, entered]);

  const player = game.traders.player;
  const writtenOrders = game.playerOrders.filter((order) => order.to && order.wantItem);
  const plannedCash = game.playerOrders.reduce((sum, order) => sum + Number(order.sardines || 0), 0);
  const obligations = currentObligations(game);
  const sellerIds = useMemo(() => unique(visibleSellListings(game).map((listing) => listing.sellerId)), [game]);

  useEffect(() => {
    if (!sellerIds.length) return;
    if (!sellerIds.includes(selectedSeller)) setSelectedSeller(sellerIds[0]);
  }, [sellerIds, selectedSeller]);

  function updateOrder(index, next) {
    setGame((current) => {
      const orders = [...current.playerOrders];
      orders[index] = next;
      return { ...current, playerOrders: orders };
    });
    setUiError("");
  }

  function writeBid(listing) {
    const index = Math.min(visibleOrderCount - 1, 2);
    updateOrder(index, { to: listing.sellerId, wantItem: listing.item, offerItem: "", sardines: listing.ask });
    setMode("trade");
  }

  function clearOrders() {
    setGame((current) => ({ ...current, playerOrders: resetOrders() }));
    setVisibleOrderCount(1);
    setUiError("");
  }

  function handlePrimary() {
    if (game.ended || game.pendingEvents.length) return;
    setUiError("");
    if (game.phase === "morning") {
      const used = game.playerOrders.map((order) => order.offerItem).filter(Boolean);
      const oversubscribedItem = used.find((item) => used.filter((usedItem) => usedItem === item).length > player.inventory.filter((held) => held === item).length);
      if (oversubscribedItem) {
        setUiError(`You wrote ${itemName(oversubscribedItem)} into more orders than you physically own.`);
        return;
      }
      if (plannedCash > player.sardines) {
        setUiError(`Your order sheet commits ${plannedCash}🥫 but you only have ${player.sardines}🥫 at the opening bell.`);
        return;
      }
    }

    if (game.phase === "noon" && !game.marketResolved) {
      setGame((current) => resolveNoonMarket(current));
      return;
    }
    setGame((current) => advancePhase(current));
    if (game.phase === "sunset") {
      setMode("learn");
      setVisibleOrderCount(1);
      setSelectedPerson("dog");
    }
  }

  function restart() {
    const fresh = createGame();
    setGame(fresh);
    setMode("learn");
    setSelectedPerson("dog");
    setSelectedSeller(visibleSellListings(fresh)[0]?.sellerId || "fishmonger");
    setVisibleOrderCount(1);
    setUiError("");
    setEntered(true);
  }

  function enterHarbour() {
    setEntered(true);
  }

  if (!entered) {
    return (
      <main className="start-screen">
        <section className="start-card">
          <div className="start-flower">🌻</div>
          <div className="eyebrow">Sunflower</div>
          <h1>You want a sunflower.</h1>
          <p>You do not know why.</p>
          <p>You only know that it feels like a way home.</p>
          <div className="start-rules">
            <div>You arrive with {SARDINE} {player.sardines} and a few strange things in your pocket.</div>
            <div>The harbour trades once each day, at Noon.</div>
            <div>You are not expected to understand this market yet.</div>
          </div>
          <button className="btn gold start-button" onClick={enterHarbour}>Enter the harbour →</button>
        </section>
      </main>
    );
  }

  if (game.ended) {
    return (
      <main className="app-shell"><div className="container end-container">
        <header className="hero compact-hero"><div><div className="eyebrow">Sunflower · prototype life</div><h1>🌇 Day {game.day}</h1></div></header>
        <section className="end-box"><h2>This prototype life ended.</h2><p>{game.finalText}</p>{game.style && <div className="style-box"><strong>{game.style.name}</strong><p>{game.style.description}</p></div>}</section>
        <section className="card end-summary"><div className="section-title">What remained on your desk</div><div className="chips"><span className="chip">{SARDINE} {player.sardines}</span>{player.inventory.map((item, index) => <span className="chip" key={`${item}-${index}`}>{itemName(item)}</span>)}</div></section>
        <button className="btn gold restart-large" onClick={restart}>Start another life →</button>
      </div></main>
    );
  }

  const showLearn = (game.phase === "morning" && mode === "learn") || game.phase === "afternoon";
  const showTrade = game.phase === "morning" && mode === "trade";

  return (
    <main className="app-shell">
      <div className="container">
        <header className="hero compact-hero">
          <div><div className="eyebrow">Sunflower · living market prototype</div><h1>🌻 Day {game.day}</h1><p className="muted small">Objective: <strong>{game.objective}</strong></p></div>
          <button className="btn ghost" onClick={restart}>New Game</button>
        </header>

        <div className="sticky-status"><span>Day {game.day}</span><span>{PHASE_COPY[game.phase].icon} {PHASE_COPY[game.phase].title}</span><span>{SARDINE} {player.sardines}</span>{game.playerState.form !== "human" && <span>{FORMS[game.playerState.form].icon} {FORMS[game.playerState.form].label}</span>}</div>
        <PhaseStrip game={game} />
        <RightNow game={game} />
        <PlayerDesk game={game} />

        {game.flags.sunflowerAcquired && <section className="card flower-reveal"><div className="section-title">🌻 You have a sunflower.</div><p><strong>Nothing happens.</strong></p><p>It is on your side of the desk. You are still here.</p><p className="muted">Objective: {game.objective}</p></section>}

        <EventDesk game={game} onChoose={(id, action, bid) => setGame((current) => resolveEvent(current, id, action, bid))} />

        {game.phase === "morning" && <div className="mode-switch" role="group" aria-label="Morning activity"><button className={`btn ${mode === "learn" ? "gold" : "ghost"}`} onClick={() => setMode("learn")}>Learn</button><button className={`btn ${mode === "trade" ? "gold" : "ghost"}`} onClick={() => setMode("trade")}>Trade</button></div>}

        {showLearn && <section className="play-flow">
          <PeopleStrip game={game} selectedId={selectedPerson} onSelect={setSelectedPerson} />
          <PersonDesk game={game} selectedId={selectedPerson} onAction={(action, targetId) => setGame((current) => performFreeAction(current, action, targetId))} onProxy={(targetId) => setGame((current) => requestMarketProxy(current, targetId))} />
          <Notebook game={game} onSell={(infoId, buyerId) => setGame((current) => sellInformation(current, infoId, buyerId))} />
          <Obligations game={game} onRepay={(id) => setGame((current) => repayObligation(current, id))} />
          <AccessNotice game={game} />
          {game.phase === "afternoon" && <PublicTape game={game} />}
        </section>}

        {showTrade && <section className="play-flow">
          <SellerStrip game={game} selectedId={selectedSeller} onSelect={setSelectedSeller} />
          {sellerIds.length ? <StallSheet game={game} sellerId={selectedSeller} onBid={writeBid} /> : <section className="card"><p>No public seller is posting stock this morning.</p></section>}
          <OrderWriter game={game} updateOrder={updateOrder} clearOrders={clearOrders} visibleOrderCount={visibleOrderCount} setVisibleOrderCount={setVisibleOrderCount} />
          <AnnouncedBids game={game} />
        </section>}

        {game.phase === "noon" && !game.marketResolved && <section className="play-flow"><LockedOrders game={game} /><AnnouncedBids game={game} open /></section>}
        {game.phase === "noon" && game.marketResolved && <section className="play-flow"><NoonResults game={game} /><PublicTape game={game} /></section>}

        {game.phase === "sunset" && <section className="card sunset-summary"><div className="section-title">Before sleep</div><p>Closing the day will settle tonight's food and any due promises, age perishables, then let ordinary businesses close their books and prepare tomorrow's stock.</p>{!!obligations.length && <p>You currently owe {obligations.reduce((sum, obligation) => sum + obligation.amount, 0)}🥫.</p>}</section>}

        {uiError && <div className="ui-error" role="alert">{uiError}</div>}
        <DeveloperDrawer game={game} />

        {!game.pendingEvents.length && <div className="bottom-action"><button className="btn gold primary-action" onClick={handlePrimary}>{phaseButton(game)}</button></div>}
      </div>
    </main>
  );
}
