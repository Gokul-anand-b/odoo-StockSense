<p align="center">
  <img src="docs/assets/stocksense-banner.png" alt="StockSense Banner" width="100%" />
</p>

<h1 align="center">📦 StockSense — Intelligent Inventory Management System</h1>

<p align="center">
  <b>AI-Powered • Real-Time • 3D Warehouse Visualization</b><br/>
  <i>Digitize, Streamline & Supercharge your Stock Operations</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Three.js-r170-000000?style=for-the-badge&logo=threedotjs" />
  <img src="https://img.shields.io/badge/WebSocket-Real--Time-FF6B35?style=for-the-badge" />
</p>

---

## 🚀 What is StockSense?

**StockSense** is a modular, full-stack Inventory Management System that replaces manual registers, Excel sheets, and scattered tracking methods with a **centralized, real-time, intelligent application**.

It is purpose-built for **Inventory Managers** and **Warehouse Staff** to manage incoming & outgoing stock, perform transfers, picking, shelving, counting, and make data-driven restocking decisions — all from a single beautiful dashboard.

---

## ✨ Uniqueness & Novelty

| Feature | What Makes It Special |
|---|---|
| 🏗️ **3D Warehouse Visualizer** | Interactive Three.js-powered 3D map of warehouse racks, zones, and stock density heatmaps. Walk through your warehouse virtually. |
| 🤖 **AI Demand Forecasting** | ML-based prediction engine that analyzes historical movement data to forecast future demand and auto-suggest reorder points. |
| 📡 **Real-Time Stock Pulse** | WebSocket-driven live dashboard — every receipt, delivery, and transfer reflects instantly across all connected clients. |
| 🗣️ **Voice-Assisted Counting** | Hands-free stock counting during physical audits using Web Speech API. Say the count, StockSense logs it. |
| 📊 **Smart Anomaly Detection** | Automatically flags suspicious stock movements (e.g., sudden spikes, unusual adjustments) with severity scoring. |
| 🔍 **Barcode / QR Scanning** | Camera-based scanning for rapid product lookup and receipt validation — no external hardware needed. |
| 📒 **Immutable Stock Ledger** | Every single stock movement is logged in a tamper-proof, append-only ledger with full traceability. |
| 🌐 **Multi-Warehouse Topology** | Visual graph showing warehouse-to-warehouse transfer routes and stock distribution across the network. |

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐  │
│  │ Dashboard│ │ Products │ │Operations │ │ 3D Viewer │  │
│  └────┬─────┘ └────┬─────┘ └─────┬─────┘ └─────┬─────┘  │
│       └─────────────┴─────────────┴─────────────┘        │
│                         │ REST + WebSocket                │
├─────────────────────────┼───────────────────────────────┤
│                    BACKEND (Django DRF)                   │
│  ┌──────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │
│  │ Auth │ │ Products │ │ Stock Ops │ │ AI/Forecast  │  │
│  └──┬───┘ └────┬─────┘ └─────┬─────┘ └──────┬───────┘  │
│     └──────────┴──────────────┴──────────────┘           │
│                         │                                 │
│              ┌──────────┴──────────┐                     │
│              │   PostgreSQL + Redis │                     │
│              └─────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
stocksense/
├── backend/                          # Django Backend
│   ├── stocksense/                   # Django Project Config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │   └── celery_config.py
│   │
│   ├── apps/
│   │   ├── authentication/           # Auth Module
│   │   │   ├── models.py             # User, OTP models
│   │   │   ├── serializers.py        # Auth serializers
│   │   │   ├── views.py              # Login, Signup, OTP views
│   │   │   ├── urls.py
│   │   │   ├── signals.py            # Post-registration signals
│   │   │   ├── otp_service.py        # OTP generation & validation
│   │   │   ├── jwt_utils.py          # JWT helper functions
│   │   │   ├── permissions.py        # Custom permission classes
│   │   │   └── tests.py
│   │   │
│   │   ├── products/                 # Product Management
│   │   │   ├── models.py             # Product, Category, UoM, ReorderRule
│   │   │   ├── serializers.py
│   │   │   ├── views.py              # CRUD + availability views
│   │   │   ├── urls.py
│   │   │   ├── filters.py            # Smart filters & search
│   │   │   ├── barcode_service.py    # Barcode/QR generation
│   │   │   └── tests.py
│   │   │
│   │   ├── warehouse/                # Warehouse & Locations
│   │   │   ├── models.py             # Warehouse, Location, Zone, Rack
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── topology_service.py   # Multi-warehouse graph
│   │   │   └── tests.py
│   │   │
│   │   ├── operations/               # Stock Operations
│   │   │   ├── models.py             # Receipt, Delivery, Transfer, Adjustment
│   │   │   ├── serializers.py
│   │   │   ├── views.py              # Operation CRUD + validation
│   │   │   ├── urls.py
│   │   │   ├── receipt_service.py    # Incoming goods logic
│   │   │   ├── delivery_service.py   # Outgoing goods logic
│   │   │   ├── transfer_service.py   # Internal transfer logic
│   │   │   ├── adjustment_service.py # Stock adjustment logic
│   │   │   └── tests.py
│   │   │
│   │   ├── stock_ledger/             # Immutable Stock Ledger
│   │   │   ├── models.py             # LedgerEntry (append-only)
│   │   │   ├── serializers.py
│   │   │   ├── views.py              # Ledger history & audit trail
│   │   │   ├── urls.py
│   │   │   ├── ledger_service.py     # Ledger write operations
│   │   │   └── tests.py
│   │   │
│   │   ├── dashboard/                # Dashboard & Analytics
│   │   │   ├── views.py              # KPI aggregation views
│   │   │   ├── urls.py
│   │   │   ├── kpi_service.py        # KPI computation engine
│   │   │   ├── analytics_service.py  # Charts & trends data
│   │   │   └── tests.py
│   │   │
│   │   ├── alerts/                   # Alerts & Notifications
│   │   │   ├── models.py             # Alert, NotificationPreference
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── low_stock_checker.py  # Low stock alert engine
│   │   │   ├── anomaly_detector.py   # Suspicious movement detection
│   │   │   └── tests.py
│   │   │
│   │   └── forecasting/              # AI Demand Forecasting
│   │       ├── models.py             # ForecastResult, TrainingLog
│   │       ├── views.py
│   │       ├── urls.py
│   │       ├── forecast_engine.py    # ML prediction logic
│   │       ├── data_pipeline.py      # Data prep for ML
│   │       └── tests.py
│   │
│   ├── realtime/                     # WebSocket Layer
│   │   ├── consumers.py              # Django Channels consumers
│   │   ├── routing.py                # WebSocket URL routing
│   │   └── middleware.py             # WS authentication middleware
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                         # Next.js Frontend
│   ├── public/
│   │   ├── models/                   # Three.js 3D models (.glb/.gltf)
│   │   │   ├── warehouse_rack.glb
│   │   │   └── forklift.glb
│   │   └── icons/
│   │
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── layout.js
│   │   │   ├── page.js               # Landing / Login redirect
│   │   │   ├── globals.css
│   │   │   │
│   │   │   ├── (auth)/               # Auth Route Group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.js
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.js
│   │   │   │   └── reset-password/
│   │   │   │       └── page.js
│   │   │   │
│   │   │   └── (dashboard)/          # Protected Dashboard Group
│   │   │       ├── layout.js         # Sidebar + Topbar layout
│   │   │       ├── dashboard/
│   │   │       │   └── page.js       # Dashboard KPIs
│   │   │       ├── products/
│   │   │       │   ├── page.js       # Product list
│   │   │       │   ├── [id]/
│   │   │       │   │   └── page.js   # Product detail
│   │   │       │   ├── create/
│   │   │       │   │   └── page.js   # Create product
│   │   │       │   └── categories/
│   │   │       │       └── page.js   # Product categories
│   │   │       ├── operations/
│   │   │       │   ├── receipts/
│   │   │       │   │   ├── page.js   # Receipt list
│   │   │       │   │   ├── [id]/
│   │   │       │   │   │   └── page.js
│   │   │       │   │   └── create/
│   │   │       │   │       └── page.js
│   │   │       │   ├── deliveries/
│   │   │       │   │   ├── page.js   # Delivery list
│   │   │       │   │   ├── [id]/
│   │   │       │   │   │   └── page.js
│   │   │       │   │   └── create/
│   │   │       │   │       └── page.js
│   │   │       │   ├── transfers/
│   │   │       │   │   ├── page.js   # Internal transfers
│   │   │       │   │   ├── [id]/
│   │   │       │   │   │   └── page.js
│   │   │       │   │   └── create/
│   │   │       │   │       └── page.js
│   │   │       │   └── adjustments/
│   │   │       │       ├── page.js   # Stock adjustments
│   │   │       │       └── create/
│   │   │       │           └── page.js
│   │   │       ├── move-history/
│   │   │       │   └── page.js       # Full stock ledger view
│   │   │       ├── warehouse-3d/
│   │   │       │   └── page.js       # 3D Warehouse Visualizer
│   │   │       ├── forecasting/
│   │   │       │   └── page.js       # AI Demand Forecasting
│   │   │       ├── alerts/
│   │   │       │   └── page.js       # Notifications & Alerts
│   │   │       ├── settings/
│   │   │       │   ├── page.js       # General settings
│   │   │       │   └── warehouses/
│   │   │       │       └── page.js   # Warehouse management
│   │   │       └── profile/
│   │   │           └── page.js       # My Profile
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Topbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── MobileNav.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   ├── OTPInput.jsx
│   │   │   │   └── ResetPasswordForm.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── KPICard.jsx
│   │   │   │   ├── StockOverviewChart.jsx
│   │   │   │   ├── RecentActivityFeed.jsx
│   │   │   │   ├── LowStockAlert.jsx
│   │   │   │   ├── WarehouseDistribution.jsx
│   │   │   │   └── DynamicFilters.jsx
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── ProductTable.jsx
│   │   │   │   ├── CategoryManager.jsx
│   │   │   │   ├── ReorderRuleForm.jsx
│   │   │   │   └── StockAvailability.jsx
│   │   │   │
│   │   │   ├── operations/
│   │   │   │   ├── ReceiptForm.jsx
│   │   │   │   ├── DeliveryForm.jsx
│   │   │   │   ├── TransferForm.jsx
│   │   │   │   ├── AdjustmentForm.jsx
│   │   │   │   ├── OperationTable.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   └── ValidationModal.jsx
│   │   │   │
│   │   │   ├── warehouse3d/
│   │   │   │   ├── WarehouseScene.jsx
│   │   │   │   ├── RackModel.jsx
│   │   │   │   ├── StockHeatmap.jsx
│   │   │   │   ├── CameraControls.jsx
│   │   │   │   └── ZoneLabel.jsx
│   │   │   │
│   │   │   ├── ledger/
│   │   │   │   ├── LedgerTable.jsx
│   │   │   │   ├── LedgerTimeline.jsx
│   │   │   │   └── LedgerFilters.jsx
│   │   │   │
│   │   │   ├── forecasting/
│   │   │   │   ├── ForecastChart.jsx
│   │   │   │   ├── DemandTrend.jsx
│   │   │   │   └── ReorderSuggestion.jsx
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   ├── AlertCard.jsx
│   │   │   │   ├── AlertBanner.jsx
│   │   │   │   └── AnomalyFlag.jsx
│   │   │   │
│   │   │   ├── scanner/
│   │   │   │   ├── BarcodeScanner.jsx
│   │   │   │   └── QRScanner.jsx
│   │   │   │
│   │   │   ├── voice/
│   │   │   │   └── VoiceCounter.jsx
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── Button.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── SearchBar.jsx
│   │   │       ├── DataTable.jsx
│   │   │       ├── Loader.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── Toast.jsx
│   │   │       └── ConfirmDialog.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useProducts.js
│   │   │   ├── useOperations.js
│   │   │   ├── useWebSocket.js
│   │   │   ├── useDashboard.js
│   │   │   ├── useBarcode.js
│   │   │   ├── useVoice.js
│   │   │   └── useAlerts.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance & interceptors
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── operationService.js
│   │   │   ├── warehouseService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── ledgerService.js
│   │   │   ├── forecastService.js
│   │   │   ├── alertService.js
│   │   │   └── websocketService.js
│   │   │
│   │   ├── store/                    # State Management (Zustand)
│   │   │   ├── authStore.js
│   │   │   ├── productStore.js
│   │   │   ├── operationStore.js
│   │   │   ├── dashboardStore.js
│   │   │   ├── warehouseStore.js
│   │   │   └── alertStore.js
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   │
│   │   └── styles/
│   │       ├── variables.css
│   │       ├── auth.module.css
│   │       ├── dashboard.module.css
│   │       ├── products.module.css
│   │       ├── operations.module.css
│   │       ├── warehouse3d.module.css
│   │       ├── ledger.module.css
│   │       ├── alerts.module.css
│   │       └── settings.module.css
│   │
│   ├── package.json
│   ├── next.config.js
│   ├── jsconfig.json
│   └── Dockerfile
│
├── docs/
│   ├── assets/
│   │   └── stocksense-banner.png
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── .gitignore
├── .env.example
├── LICENSE
└── README.md
```

---

## 🎯 Core Features

### 🔐 Authentication & Security
| Feature | Description |
|---|---|
| JWT Auth | Secure token-based authentication with refresh tokens |
| OTP Reset | Email/SMS-based OTP for password recovery |
| Role-Based Access | Inventory Manager vs Warehouse Staff permissions |
| Session Management | Auto-logout, device tracking |

### 📦 Product Management
| Feature | Description |
|---|---|
| Product CRUD | Create, read, update, delete products |
| SKU / Barcode | Unique identifier with barcode generation |
| Categories | Hierarchical product categorization |
| Unit of Measure | kg, pcs, liters, etc. |
| Stock per Location | Real-time availability per warehouse/rack |
| Reorder Rules | Auto-trigger alerts at minimum stock levels |

### 🔄 Operations Engine
| Operation | Flow | Stock Impact |
|---|---|---|
| **Receipts** | Create → Add Supplier & Products → Validate | ✅ Stock **increases** |
| **Deliveries** | Pick → Pack → Validate | 📉 Stock **decreases** |
| **Internal Transfers** | Source → Destination → Confirm | 🔄 Location changes, total unchanged |
| **Adjustments** | Select → Count → System auto-corrects | ⚖️ Reconciles physical vs recorded |

### 📊 Dashboard KPIs
- Total Products in Stock
- Low Stock / Out of Stock Items
- Pending Receipts
- Pending Deliveries
- Internal Transfers Scheduled

### 🧠 AI / ML Features
- **Demand Forecasting** — Predict future stock needs based on historical data
- **Anomaly Detection** — Flag unusual stock movements automatically
- **Smart Reorder Suggestions** — AI-recommended reorder quantities & timing

### 🏗️ 3D Warehouse Visualizer
- Interactive Three.js scene of warehouse layout
- Color-coded rack density (green → red heatmap)
- Click-to-inspect stock on any rack/zone
- Virtual walkthrough with orbit controls

---

## 📐 Database Schema (Key Models)

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│   User       │     │   Product    │     │   Warehouse     │
├──────────────┤     ├──────────────┤     ├─────────────────┤
│ id           │     │ id           │     │ id              │
│ email        │     │ name         │     │ name            │
│ password     │     │ sku          │     │ address         │
│ role         │     │ category_id  │◄────│ is_active       │
│ is_active    │     │ uom          │     └────────┬────────┘
└──────┬───────┘     │ description  │              │
       │             └──────┬───────┘     ┌────────▼────────┐
       │                    │             │   Location      │
       │                    │             ├─────────────────┤
       │             ┌──────▼───────┐     │ id              │
       │             │  StockQuant  │     │ warehouse_id    │
       │             ├──────────────┤     │ name (Rack A)   │
       │             │ product_id   │     │ zone            │
       │             │ location_id  │     └─────────────────┘
       │             │ quantity     │
       │             └──────────────┘
       │
┌──────▼───────────┐  ┌──────────────────┐  ┌─────────────────┐
│  Receipt         │  │  Delivery        │  │  Transfer       │
├──────────────────┤  ├──────────────────┤  ├─────────────────┤
│ id               │  │ id               │  │ id              │
│ supplier         │  │ customer         │  │ source_loc      │
│ status           │  │ status           │  │ dest_loc        │
│ created_by       │  │ created_by       │  │ status          │
│ validated_at     │  │ validated_at     │  │ created_by      │
└──────────────────┘  └──────────────────┘  └─────────────────┘
         │                     │                     │
         └─────────────────────┴─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   LedgerEntry       │
                    ├─────────────────────┤
                    │ id                  │
                    │ product_id          │
                    │ location_id         │
                    │ operation_type      │
                    │ quantity_change     │
                    │ reference           │
                    │ timestamp           │
                    │ performed_by        │
                    └─────────────────────┘
```

---

## 👥 Team Roles & Ownership

### 🎨 Frontend Team (2 Members)

| Member | Responsibility | Key Files |
|---|---|---|
| **Frontend Dev 1** | Auth, Dashboard, Layout, Shared Components | `(auth)/`, `(dashboard)/dashboard/`, `components/layout/`, `components/auth/`, `components/dashboard/`, `components/shared/`, `styles/` |
| **Frontend Dev 2** | Products, Operations, 3D Viewer, Scanner, Voice | `(dashboard)/products/`, `(dashboard)/operations/`, `(dashboard)/warehouse-3d/`, `components/products/`, `components/operations/`, `components/warehouse3d/`, `components/scanner/`, `components/voice/` |

### ⚙️ Backend Team (2 Members)

| Member | Responsibility | Key Files |
|---|---|---|
| **Backend Dev 1** | Auth, Products, Warehouse, Dashboard APIs | `apps/authentication/`, `apps/products/`, `apps/warehouse/`, `apps/dashboard/` |
| **Backend Dev 2** | Operations, Ledger, Alerts, Forecasting, WebSocket | `apps/operations/`, `apps/stock_ledger/`, `apps/alerts/`, `apps/forecasting/`, `realtime/` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 15 (App Router) |
| **UI Library** | React 19 |
| **3D Rendering** | Three.js + React Three Fiber |
| **State Management** | Zustand |
| **HTTP Client** | Axios |
| **Styling** | CSS Modules + CSS Variables |
| **Backend Framework** | Django 5.x + Django REST Framework |
| **Auth** | JWT (SimpleJWT) |
| **Database** | PostgreSQL 16 |
| **Real-Time** | Django Channels (WebSocket) |
| **Task Queue** | Celery + Redis |
| **ML/AI** | scikit-learn / Prophet |
| **Containerization** | Docker + Docker Compose |

---

## ⚡ Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 16
- Redis

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker (Full Stack)
```bash
docker-compose up --build
```

---

## 📡 API Endpoints Overview

| Module | Endpoint | Methods |
|---|---|---|
| Auth | `/api/auth/signup/` | POST |
| Auth | `/api/auth/login/` | POST |
| Auth | `/api/auth/otp/send/` | POST |
| Auth | `/api/auth/otp/verify/` | POST |
| Auth | `/api/auth/reset-password/` | POST |
| Products | `/api/products/` | GET, POST |
| Products | `/api/products/:id/` | GET, PUT, DELETE |
| Products | `/api/products/categories/` | GET, POST |
| Products | `/api/products/:id/availability/` | GET |
| Products | `/api/products/:id/reorder-rules/` | GET, POST |
| Receipts | `/api/operations/receipts/` | GET, POST |
| Receipts | `/api/operations/receipts/:id/validate/` | POST |
| Deliveries | `/api/operations/deliveries/` | GET, POST |
| Deliveries | `/api/operations/deliveries/:id/validate/` | POST |
| Transfers | `/api/operations/transfers/` | GET, POST |
| Transfers | `/api/operations/transfers/:id/confirm/` | POST |
| Adjustments | `/api/operations/adjustments/` | GET, POST |
| Ledger | `/api/ledger/` | GET |
| Ledger | `/api/ledger/product/:id/` | GET |
| Dashboard | `/api/dashboard/kpis/` | GET |
| Dashboard | `/api/dashboard/charts/` | GET |
| Warehouse | `/api/warehouses/` | GET, POST |
| Warehouse | `/api/warehouses/:id/locations/` | GET, POST |
| Alerts | `/api/alerts/` | GET |
| Alerts | `/api/alerts/:id/acknowledge/` | POST |
| Forecast | `/api/forecast/product/:id/` | GET |
| Profile | `/api/profile/` | GET, PUT |

---

## 🔄 Inventory Flow Example

```
 Vendor ships 100 kg Steel
          │
          ▼
  ┌───────────────┐
  │   RECEIPT      │  Stock: +100 kg
  │   (Validate)   │  Location: Main Store
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐
  │   TRANSFER     │  Main Store → Production Rack
  │   (Confirm)    │  Total unchanged, location updated
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐
  │   DELIVERY     │  Ship 20 kg Steel
  │   (Validate)   │  Stock: −20 kg
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐
  │   ADJUSTMENT   │  3 kg damaged
  │   (Auto-fix)   │  Stock: −3 kg
  └───────────────┘

  Final Stock: 100 − 20 − 3 = 77 kg
  All movements logged in Stock Ledger ✅
```

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>Built with ❤️ for the Odoo Hackathon 2025</b><br/>
  <i>StockSense — See Your Stock. Sense the Future.</i>
</p>
