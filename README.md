# Swiftab Waiter

The Swiftab app for floor staff: see new orders the moment they are placed,
serve them, take payment and close the table. Built with Expo (SDK 57) and
Expo Router.

It talks to the Swiftab API (`swiftab-server`) — the same API the restaurant
dashboard and the diner app use, so an order placed in the diner app appears
here and its payment shows up on the dashboard.

> This project is on Expo SDK 57. Read the versioned docs at
> https://docs.expo.dev/versions/v57.0.0/ before changing native APIs
> (see `AGENTS.md`).

## Run it

```bash
npm install
```

```bash
npx expo start
```

Push notifications need a development or production build; they do not work
in Expo Go on Android.

### Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://api.swiftab.co.ke/api/v2` | Where the API lives. Point it at a local server while developing. |

Copy `.env.example` to `.env` to change it.

## Check

```bash
npm run typecheck
```

## How a waiter gets in

1. A manager adds the waiter in the dashboard (Settings → Staff), which
   creates a six-digit invite code.
2. In the app the waiter chooses **Set up your account**, enters their email
   and the code, then picks a password.
3. A forgotten password is reset by the manager from the same place; the
   waiter gets a new code.

## What is in the app

| Screen | What it does |
| --- | --- |
| **Orders** | Four queues — New, Served, Payment, Done — with live counts. The open queues refresh every few seconds; a new order raises a toast and a vibration. Today's tables served, tables closed and sales sit in the header, with a one-tap on/off duty switch. |
| **Order ticket** | Items with guest notes, the guest's name and phone. *Accept & serve* claims the order; *Cancel order* tells the guest; *Take payment* records how the bill was paid (M-Pesa, cash, card or Airtel Money) and an optional transaction code, then closes the table. Paid orders can be shared as a receipt. |
| **Floor** | Every floor as the manager drew it in the dashboard — each table at its position, size and angle with its chairs — coloured free, reserved or occupied. Tap a table to see who is there and until when. |
| **Profile** | Clock in and out, today's numbers, edit name and phone, switch order alerts and vibration on or off, help, sign out. |

## How it is organised

| Path | What lives there |
| --- | --- |
| `src/app/` | Screens (file-based routes): `(auth)` sign-in and invite, `(app)` the three tabs, `screens/` pages opened from the profile. |
| `src/api/` | `client.ts` (base URL, session token, readable errors) and `api.ts` (one function per endpoint). |
| `src/hooks/queries.ts` | All data fetching and writes, with cache keys in one place. |
| `src/lib/` | Notifications, formatting, haptics, and `floor.ts` — the chair layout rules shared with the dashboard and the diner app. |
| `src/store/` | The session (kept in the device keychain) and preferences. |
| `src/constants/` | Colours and order-status labels. |
