# ROLLON Casino — Technical Specification
**Version:** 1.0 | **Date:** March 2026 | **Stack:** React + Node.js + PostgreSQL

---

## 1. Project Overview

ROLLON is a crypto casino platform built as a Telegram WebApp and web SPA. It supports:
- Slot games (BGaming, Pragmatic Play, and 15+ other providers)
- Original in-house games (Mines, Plinko, Aviator, Dice, Flip, Hilo, Limbo, Roulette, Wheel, Keno, Chicken, Dragon Tower, Pump)
- User accounts (Telegram OAuth + Email/Password)
- Crypto deposits/withdrawals via @CryptoBot (USDT, TON, BTC)
- VIP system, bonuses, referrals, prediction markets
- Demo mode (no auth required, 1000 demo balance)

---

## 2. File Structure

```
src/
├── utils/api.ts              ← ALL API calls, token management
├── hooks/
│   ├── useUser.ts            ← Auth state, user object, auto-refresh
│   ├── useGame.ts            ← Game logic (demo/real, startBet/settle/playOnce)
│   └── useLang.ts            ← i18n
├── components/
│   ├── AuthModal.tsx         ← Login/Register modal (email+password)
│   ├── Sidebar.tsx           ← Navigation + user info block
│   ├── Header.tsx            ← Balance display, deposit button
│   └── ...
├── pages/
│   ├── Home.tsx              ← Landing with game sections
│   ├── Games.tsx             ← Full games catalog with filters
│   ├── GameSlot.tsx          ← Slot iframe launcher (/game/slot/:id)
│   ├── Game*.tsx             ← Original games (Mines, Plinko, etc.)
│   ├── Deposit.tsx           ← Crypto deposit via CryptoBot
│   ├── Withdraw.tsx          ← Crypto withdrawal
│   ├── Bets.tsx              ← Bet history
│   ├── Transactions.tsx      ← Transaction history
│   ├── Profile.tsx           ← User profile
│   ├── Referral.tsx          ← Referral program
│   ├── Bonuses.tsx           ← Bonus offers
│   ├── VIPClub.tsx           ← VIP levels
│   └── ...
└── data/
    ├── bng_games.json        ← BGaming catalog (static)
    ├── pp_games.json         ← Pragmatic Play catalog (static)
    └── ...15 providers       ← All game JSON files
```

---

## 3. Frontend Routes

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Home | No | Main page with game sections, banners |
| `/games` | Games | No | Full catalog with tabs (Lobby/Slots/Live/Crash) |
| `/slots` | Slots | No | Slots-only view |
| `/game/slot/:id` | GameSlot | Yes (real) | Slot game iframe launcher |
| `/game/mines` | GameMines | No (demo) | Mines original game |
| `/game/plinko` | GamePlinko | No (demo) | Plinko original game |
| `/game/aviator` | GameAviator | No (demo) | Aviator/crash game |
| `/game/dice` | GameDice | No (demo) | Dice game |
| `/game/flip` | GameFlip | No (demo) | Coin flip game |
| `/game/hilo` | GameHilo | No (demo) | Hi-Lo card game |
| `/game/limbo` | GameLimbo | No (demo) | Limbo multiplier game |
| `/game/roulette` | GameRoulette | No (demo) | Roulette game |
| `/game/wheel` | GameWheel | No (demo) | Wheel of fortune |
| `/game/keno` | GameKeno | No (demo) | Keno game |
| `/game/chicken` | GameChicken | No (demo) | Chicken game |
| `/game/dragon-tower` | GameDragonTower | No (demo) | Dragon Tower game |
| `/game/pump` | GamePump | No (demo) | Pump game |
| `/deposit` | Deposit | Yes | Crypto deposit page |
| `/withdraw` | Withdraw | Yes | Crypto withdrawal page |
| `/bets` | Bets | Yes | Personal bet history |
| `/transactions` | Transactions | Yes | Transaction history |
| `/profile` | Profile | Yes | User profile |
| `/statistics` | Statistics | Yes | Personal stats |
| `/referral` | Referral | Yes | Referral program |
| `/bonuses` | Bonuses | No | Bonus offers |
| `/vip` | VIPClub | No | VIP levels info |
| `/markets` | Markets | No | Prediction markets |
| `/sports` | Sports | No | Sports betting (coming soon) |
| `/support` | SupportChat | No | Support chat |
| `/settings` | Settings | Yes | Account settings |
| `/ambassadors` | Ambassadors | No | Ambassador program |
| `/guest/*` | Same pages | No | Guest variants (no auth gate) |

---

## 4. API Endpoints

### Base URL
```
VITE_API_URL (env) || http://localhost:8000
```

All authenticated requests include:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

### 4.1 Authentication

#### `POST /auth/telegram`
Telegram WebApp login (primary auth method).

**Request:**
```json
{ "init_data": "user=%7B%22id%22%3A722755021...%7D&hash=abc123" }
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "tg_id": 722755021,
    "username": "pavlo",
    "first_name": "Павло",
    "balance": 150.00,
    "total_won": 320.50,
    "total_lost": 200.00,
    "total_deposited": 100.00,
    "total_withdrawn": 0.00,
    "games_played": 47
  }
}
```

**Response 401:**
```json
{ "detail": "Invalid Telegram auth" }
```

Frontend: stores token in `localStorage['rollon_token']`, sets user state.

---

#### `POST /auth/register`
Email/password registration.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "player123",
  "promo": "WELCOME" // optional
}
```

**Response 201:**
```json
{
  "token": "eyJ...",
  "user": { /* same User object */ }
}
```

**Response 400:**
```json
{ "detail": "email вже використовується" }
```

---

#### `POST /auth/login`
Email/password login.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "token": "eyJ...",
  "user": { /* User object */ }
}
```

**Response 401:**
```json
{ "detail": "Невірний email або пароль" }
```

---

#### `GET /user/me`
Get current user data (used for balance refresh every 30s).

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "id": 1,
  "tg_id": 722755021,
  "username": "pavlo",
  "first_name": "Павло",
  "balance": 150.00,
  "total_won": 320.50,
  "total_lost": 200.00,
  "total_deposited": 100.00,
  "total_withdrawn": 0.00,
  "games_played": 47
}
```

---

### 4.2 Game — One-shot (Dice, Flip, Limbo, Wheel, Keno, Roulette)

#### `POST /game/play`
Single round game (result returned immediately).

**Request:**
```json
{
  "game": "dice",
  "bet": 1.00,
  "config": {
    "target": 50.0,
    "over": true
  }
}
```

**Config per game type:**

| game | config fields |
|------|---------------|
| `dice` | `target: number (1-99)`, `over: boolean` |
| `flip` | `choice: "heads"\|"tails"` |
| `limbo` | `target: number (1.01-1000)` |
| `wheel` | `risk: "low"\|"medium"\|"high"` |
| `keno` | `picks: number[] (1-10 numbers from 1-40)` |
| `roulette` | `type: "red"\|"black"\|"green"\|"odd"\|"even"\|"low"\|"high"\|"dozen1"\|"dozen2"\|"dozen3"\|"number"`, `number?: number (0-36)` |

**Response 200:**
```json
{
  "won": true,
  "roll": 73.42,
  "multiplier": 1.9608,
  "payout": 1.9608,
  "new_balance": 151.96
}
```

**Response 400:**
```json
{ "detail": "Insufficient balance" }
```

---

### 4.3 Game — Multi-step (Mines, Plinko, Aviator, Hilo, Chicken, Dragon Tower, Pump)

#### `POST /game/session/start`
Deduct bet, create game session.

**Request:**
```json
{
  "game_type": "mines",
  "bet": 2.50
}
```

**Response 200:**
```json
{
  "session_id": 1042,
  "new_balance": 147.50
}
```

---

#### `POST /game/session/settle`
End session and credit winnings.

**Request:**
```json
{
  "session_id": 1042,
  "multiplier": 2.5
}
```
> `multiplier = 0` means loss (no payout)

**Response 200:**
```json
{
  "win_amount": 6.25,
  "new_balance": 153.75
}
```

---

### 4.4 Provider (Slot games — Transfer Wallet)

#### `POST /provider/launch`
Launch real-money slot game — returns iframe URL.

**Request:**
```json
{
  "game_code": "lucky-lady-charm-deluxe",
  "demo": false,
  "lang": "uk"
}
```

**Response 200:**
```json
{
  "url": "https://static.bgaming-network.com/games/lucky-lady-charm/..."
}
```

---

#### `POST /provider/demo`
Launch demo slot (no auth needed).

**Request:**
```json
{
  "game_code": "lucky-lady-charm-deluxe",
  "lang": "uk"
}
```

**Response 200:**
```json
{
  "url": "https://static.bgaming-network.com/games/.../game.html"
}
```

---

#### `POST /provider/cashout`
Transfer balance back from game provider wallet.

**Request:** `{}` (no body)

**Response 200:**
```json
{
  "amount": 25.00,
  "new_balance": 175.00
}
```

---

#### `GET /provider/games`
Get active games list from provider (for catalog updates).

**Response 200:**
```json
[
  {
    "id": "lucky-lady-charm-deluxe",
    "name": "Lucky Lady Charm Deluxe",
    "provider": "BNG",
    "genre": "slots",
    "rtp": 95.13,
    "image_url": "https://..."
  }
]
```

---

### 4.5 Bets

#### `GET /bets/all`
All platform bets (for "Останні ставки / Великі виграші" section).

**Response 200:**
```json
[
  {
    "id": 1,
    "username": "pavlo",
    "game": "mines",
    "bet": 1.00,
    "multiplier": 3.5,
    "payout": 3.50,
    "created_at": "2026-03-18T20:00:00Z"
  }
]
```

---

#### `GET /bets/mine?limit=20&offset=0`
Current user's bet history.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
[
  {
    "id": 1,
    "game": "dice",
    "bet": 1.00,
    "multiplier": 1.96,
    "payout": 1.96,
    "won": true,
    "created_at": "2026-03-18T20:00:00Z"
  }
]
```

---

### 4.6 Wallet

#### `POST /wallet/deposit`
Create CryptoBot invoice.

**Request:**
```json
{
  "amount": 25.00,
  "currency": "USDT"
}
```

**Response 200:**
```json
{
  "invoice_id": "8472634",
  "pay_url": "https://t.me/CryptoBot?start=IV..."
}
```

---

#### `POST /wallet/deposit/check`
Check if invoice has been paid.

**Request:**
```json
{
  "invoice_id": "8472634",
  "amount": 25.00
}
```

**Response 200:**
```json
{
  "paid": true,
  "new_balance": 175.00
}
```

**Response 200 (not paid):**
```json
{ "paid": false }
```

---

#### `POST /wallet/withdraw`
Request withdrawal via CryptoBot.

**Request:**
```json
{
  "amount": 10.00
}
```

**Response 200:**
```json
{
  "success": true,
  "new_balance": 165.00
}
```

**Response 400:**
```json
{ "detail": "Insufficient balance" }
```

---

## 5. Data Models

### User
```json
{
  "id": 1,                        // integer, PK
  "tg_id": 722755021,             // integer, unique (null for email users)
  "username": "pavlo",            // string, unique
  "first_name": "Павло",          // string
  "balance": 150.00,              // decimal(20,8) — main USDT balance
  "total_won": 320.50,            // decimal — lifetime winnings
  "total_lost": 200.00,           // decimal — lifetime losses
  "total_deposited": 100.00,      // decimal
  "total_withdrawn": 0.00,        // decimal
  "games_played": 47              // integer
}
```

### Game (Slot)
```json
{
  "id": "lucky-lady-charm-deluxe",  // string, PK (game code)
  "name": "Lucky Lady Charm Deluxe", // string
  "provider": "BNG",                 // string (BNG, PP, etc.)
  "genre": "slots",                  // string (slots, live, crash)
  "rtp": 95.13,                      // decimal(5,2)
  "volatility": "medium",            // string
  "image_url": "https://...",        // string
  "demo_url": "https://...",         // string
  "is_active": true                  // boolean
}
```

### GameSession (multi-step)
```json
{
  "session_id": 1042,       // integer, PK
  "user_id": 1,             // integer, FK
  "game_type": "mines",     // string
  "bet": 2.50,              // decimal
  "status": "active",       // active | settled | cancelled
  "created_at": "2026-..."  // timestamp
}
```

### Bet
```json
{
  "id": 1,
  "user_id": 1,
  "game": "dice",
  "bet": 1.00,
  "multiplier": 1.96,
  "payout": 1.96,
  "won": true,
  "config": { "target": 50, "over": true },
  "created_at": "2026-..."
}
```

### Invoice (Deposit)
```json
{
  "invoice_id": "8472634",          // string (CryptoBot ID)
  "user_id": 1,
  "amount": 25.00,
  "currency": "USDT",
  "pay_url": "https://t.me/CryptoBot?start=IV...",
  "status": "pending",              // pending | paid | expired
  "created_at": "2026-..."
}
```

---

## 6. State Management

| Data | Storage | Method |
|------|---------|--------|
| JWT token | `localStorage['rollon_token']` | Persisted across sessions |
| User object | React Context (`UserContext`) | In-memory, refreshed every 30s |
| Demo balance | `localStorage['rollon_demo_balance']` | Default: 1000 |
| Demo mode flag | `localStorage['rollon_demo_mode']` | Per-game |
| Language | React Context (`LangContext`) | `localStorage` |
| Active game session_id | `useState` in `useGame` hook | In-memory only |

---

## 7. Key Functions

### `api.auth(init_data)` — Telegram login
- Sends Telegram WebApp `initData` to `/auth/telegram`
- Stores returned token in localStorage
- Sets user in React Context

### `api.me()` — Balance refresh
- Called every 30 seconds via `setInterval`
- Updates user balance in Context

### `useGame.playOnce(config, bet)` — One-shot game
- **Demo:** Client-side simulation, updates `localStorage` demo balance
- **Real:** `POST /game/play` → updates balance via `refreshUser()`

### `useGame.startBet(amount)` — Multi-step game start
- **Demo:** Deducts from demo balance in `localStorage`
- **Real:** `POST /game/session/start` → stores `session_id` in state

### `useGame.settleBet(multiplier)` — Multi-step game end
- **Demo:** Credits winnings to demo balance
- **Real:** `POST /game/session/settle` → credits on server

### `api.deposit(amount, currency)` — Create invoice
- Creates CryptoBot invoice
- Returns `invoice_id` + `pay_url`
- Frontend displays pay link button

### `api.checkDeposit(invoice_id, amount)` — Check payment
- Polls manually (user clicks "I paid")
- On `paid: true` → calls `refreshUser()`

---

## 8. Environment Variables

```env
VITE_API_URL=https://your-backend.railway.app
```

> Only one env variable used. All API calls go through this base URL.

---

## 9. Third-Party Integrations

| Service | Integration | Backend Role |
|---------|-------------|--------------|
| **Telegram WebApp** | `window.Telegram.WebApp.initData` | Validate HMAC signature of init_data |
| **@CryptoBot** | Creates invoices via CryptoBot API | Call CryptoBot API, verify payment webhooks |
| **BGaming** | Static JSON + iframe embed | Provide signed game session URL |
| **Pragmatic Play** | Static JSON + iframe embed | Provide signed game session URL |
| **15 other providers** | Static JSON catalogs in frontend | Serve game URLs, handle callbacks |

### Game iframe URL patterns:
```
BGaming demo:  https://static.bgaming-network.com/games/{id}/en_US/web/desktop/game.html
BGaming real:  https://static.bgaming-network.com/games/{game}?token={launch_token}
PP demo:       https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol={id}
```

---

## 10. Authentication & Security

### Flow:
1. **Telegram:** `initData` → validate HMAC → create/find user → return JWT
2. **Email:** `POST /auth/login` → bcrypt verify → return JWT

### Token handling:
- Stored in `localStorage['rollon_token']`
- Sent as `Authorization: Bearer <token>` on every API call
- Auto-loaded on app init via `useUserProvider()`
- No refresh token flow in frontend currently (single token)

### Protected pages:
- `/deposit`, `/withdraw`, `/bets`, `/transactions`, `/profile`, `/statistics`, `/settings`
- Frontend uses `user` from Context to gate actions (not hard-redirects)

---

## 11. Critical API Call Flows

### Flow 1: Email Registration → Login
```
1. User fills AuthModal (username, email, password)
2. POST /auth/register → { token, user }
3. setToken(token) → localStorage
4. WelcomeModal shown
5. Every 30s: GET /user/me → refresh balance
```

### Flow 2: Telegram Auth
```
1. App loads → Telegram.WebApp.initData available
2. POST /auth/telegram { init_data }
3. Backend validates HMAC → returns { token, user }
4. Token stored, user set in Context
```

### Flow 3: Play One-shot Game (Dice)
```
1. User sets bet + config
2. useGame.playOnce({ target: 50, over: true }, 1.00)
   DEMO: simulateOnce() client-side → update localStorage balance
   REAL: POST /game/play { game: "dice", bet: 1.00, config: {...} }
         → { won, roll, multiplier, payout, new_balance }
3. Show result animation
4. GET /user/me → refresh balance
```

### Flow 4: Play Multi-step Game (Mines)
```
1. User sets bet → clicks Start
2. POST /game/session/start { game_type: "mines", bet: 2.50 }
   → { session_id: 1042, new_balance: 147.50 }
3. User plays (reveals tiles) — client-side logic
4. User clicks Cashout
5. POST /game/session/settle { session_id: 1042, multiplier: 2.5 }
   → { win_amount: 6.25, new_balance: 153.75 }
```

### Flow 5: Deposit
```
1. User selects currency + amount
2. POST /wallet/deposit { amount: 25, currency: "USDT" }
   → { invoice_id: "8472634", pay_url: "https://t.me/CryptoBot?start=IV..." }
3. Frontend shows "Pay via @CryptoBot" link button
4. User pays externally
5. User clicks "I paid — check"
6. POST /wallet/deposit/check { invoice_id, amount }
   → { paid: true, new_balance: 175.00 }
7. refreshUser() → balance updated
```

### Flow 6: Withdrawal
```
1. User enters amount (min $1, max = balance)
2. POST /wallet/withdraw { amount: 10.00 }
   → { success: true, new_balance: 165.00 }
3. Success screen shown
```

### Flow 7: Launch Slot Game
```
1. User clicks game tile → /game/slot/:id
2. POST /provider/launch { game_code: "lucky-lady", demo: false, lang: "uk" }
   → { url: "https://..." }
3. Frontend renders <iframe src={url} />
4. Provider sends bet/win callbacks to backend webhook
```

---

## 12. Mock Data Structure (current static JSON)

### Game object (from bng_games.json):
```json
{
  "id": "lucky-lady-charm-deluxe",
  "name": "Lucky Lady Charm Deluxe",
  "genres": ["slots"],
  "image": "https://static.bgaming-network.com/games/lucky-lady-charm-deluxe/en_US/web/desktop/preview.png",
  "demo": "https://static.bgaming-network.com/games/lucky-lady-charm-deluxe/en_US/web/desktop/game.html"
}
```

**Backend must return same shape** from `GET /provider/games`.

---

## 13. Missing / Assumed Backend Logic

| # | What frontend assumes | Recommended implementation |
|---|----------------------|---------------------------|
| 1 | CryptoBot invoice creation | Integrate CryptoBot API (`/createInvoice`), store invoice in DB |
| 2 | CryptoBot payment verification | Poll CryptoBot API or use webhook `invoice_paid` |
| 3 | Telegram HMAC validation | `crypto.createHmac('sha256', ...)` — standard Telegram WebApp validation |
| 4 | `total_won`, `total_lost`, `games_played` | Computed fields — maintain counters in DB on each bet |
| 5 | Provider game URLs signed | BGaming/PP require API call to get real-money launch URL with session token |
| 6 | Provider callbacks (bet/win) | Implement `/provider/callback/:provider` webhook endpoint |
| 7 | Demo mode has no server involvement | Fully client-side — backend never called in demo mode |
| 8 | No refresh token | Frontend uses single JWT — implement 15min access + refresh token pair |
| 9 | Withdrawal via CryptoBot | Use CryptoBot `transfer` API to user's CryptoBot account |
| 10 | `promo` code on register | Validate promo code, apply bonus to new user's balance |

---

## 14. Summary Table — All Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/telegram` | No | Telegram WebApp login |
| POST | `/auth/register` | No | Email registration |
| POST | `/auth/login` | No | Email login |
| GET | `/user/me` | Yes | Get current user + balance |
| POST | `/game/play` | Yes | One-shot game round |
| POST | `/game/session/start` | Yes | Start multi-step game session |
| POST | `/game/session/settle` | Yes | Settle multi-step game session |
| GET | `/bets/all` | No | All platform bets (public feed) |
| GET | `/bets/mine` | Yes | User's own bets |
| POST | `/wallet/deposit` | Yes | Create CryptoBot invoice |
| POST | `/wallet/deposit/check` | Yes | Check invoice payment status |
| POST | `/wallet/withdraw` | Yes | Withdraw via CryptoBot |
| POST | `/provider/launch` | Yes | Launch real-money slot |
| POST | `/provider/demo` | No | Launch demo slot |
| POST | `/provider/cashout` | Yes | Cashout from provider wallet |
| GET | `/provider/games` | No | Get active games list |
