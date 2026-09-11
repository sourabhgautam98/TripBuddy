# 🌍 Travel Agent AI — Agentic Travel Planner

An autonomous **AI Travel Planner** that researches verified attractions, calculates real-world transit routes, discovers local dining & bike rentals, and builds day-by-day map itineraries with live route optimization.

Built with the **MERN Stack + Next.js App Router**:
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet & Google Maps integration.
- **Backend**: Express.js, TypeScript, MongoDB / Mongoose (with automatic in-memory fallback), OpenAI Tool Calling integration, Google Maps Platform APIs (Places & Routes), Zod validation, SSE streaming.
- **Monorepo**: npm workspaces with shared `@travel-ai/types`.

---

## 🌟 Key Features

1. **Autonomous Agentic Tool Execution**:
   - `searchPlaces`: Verifies coordinates, ratings, reviews, and opening hours.
   - `calculateRoute`: Computes realistic transit times and distances across transport modes (`bike`, `car`, `cab`, `walking`).
   - `searchRestaurants`: Contextual lunch and dinner recommendations near activities.
   - `searchBikeRentals`: Real bike & scooter rental hubs when "Bike" transport is selected.
   - `optimizeRoute`: Eliminates backtracking using 2-opt TSP heuristics.
2. **Server-Sent Events (SSE) Live Progress**: Real-time visual progress stepper on the frontend showing tool calls as they execute.
3. **Interactive Split-View Map & Timeline**:
   - Numbered markers synchronized with the day's timeline.
   - Route polylines connecting consecutive stops.
   - Click marker to focus activity card; click card to center map.
4. **✨ One-Click Route Optimization**: Detects inefficient transit segments and shows exact before/after distance and travel time reductions.
5. **Conversational Activity Modification**: Inline "[Change Activity]" to replace a stop or request custom alternatives.
6. **Estimated Budget Engine**: Itemized daily breakdown for accommodation, food, transport, and attractions.
7. **Zero Setup Friction**: Operates immediately out of the box with embedded geospatial datasets even without external API keys or local MongoDB!

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
npm install
```


### 2. Run in Development Mode

```bash
# Run both backend and frontend concurrently:
npm run dev

# Or run individually:
npm run dev:api   # Express Backend on http://localhost:5000
npm run dev:web   # Next.js Web on http://localhost:3000
```

---

## 🧪 Testing

```bash
npm test
```

Runs the test suite for tool registry schemas, geospatial distance calculations, schedule generator, and route optimizer.

---

## 📂 Architecture & Monorepo Structure

```text
travel-agent-ai/
├── apps/
│   ├── web/                     # Next.js App Router Frontend
│   │   ├── src/app/             # Pages: Landing (/), Plan (/plan), Trip (/trip/[id]), Saved (/trips)
│   │   ├── src/components/      # UI: Map, Timeline, Stepper, Modals, Selectors
│   │   └── src/hooks/           # useSSE streaming hook
│   │
│   └── api/                     # Express.js Backend
│       ├── src/config/          # Environment & Database connections
│       ├── src/services/        # Agent Orchestration, Google APIs, Itinerary Engine, Optimizer
│       ├── src/tools/           # 9 Deterministic Agent Tools
│       ├── src/models/          # Trip & In-Memory Storage Repositories
│       └── src/routes/          # REST & SSE Streaming Routes
│
├── packages/
│   └── types/                   # Shared TypeScript models & Zod validation schemas
│
└── package.json                 # Monorepo Workspace Configuration
```
