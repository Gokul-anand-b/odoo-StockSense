# StockSense System Architecture & Design Specification

## 1. High-Level Architecture

StockSense follows a modern, decoupled client-server architecture designed for high scalability, real-time reactivity, and high-performance 3D visualization.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT TIER                                      |
|                                                                                   |
|   Next.js 15 (App Router) + React 19 + React Three Fiber / Three.js + Zustand     |
|   - Authentication Pages (Login, Signup, OTP Reset)                               |
|   - Real-Time KPIs & Analytics Dashboards                                         |
|   - Interactive 3D Warehouse Rack Digital Twin                                    |
|   - Operations Workflows (Receipts, Deliveries, Transfers, Adjustments)           |
|   - Hands-Free Voice Counter (Web Speech API) & Camera Barcode Scanner            |
+----------------------------------------+------------------------------------------+
                                         | HTTP / REST + WebSockets (WSS)
                                         v
+-----------------------------------------------------------------------------------+
|                                  BACKEND TIER                                     |
|                                                                                   |
|   Django 5.x + Django REST Framework + Daphne / Channels (ASGI)                   |
|   - Authentication & RBAC Service (JWT + OTP Engine)                              |
|   - Product & Reorder Rules Engine                                                |
|   - Operations State Machine (Draft -> Waiting -> Ready -> Done -> Canceled)      |
|   - Immutable Stock Ledger (Tamper-proof audit logs)                              |
|   - Anomaly Detector & Low Stock Alerts                                           |
|   - AI / ML Demand Forecasting Engine (scikit-learn)                              |
|   - Real-Time Event Publisher (Django Channels Channel Layer)                     |
+-------------------+-----------------------------------+---------------------------+
                    |                                   |
                    v                                   v
+-----------------------------------+   +-------------------------------------------+
|         DATABASE LAYER            |   |               CACHE & QUEUE               |
|   PostgreSQL 16                   |   |   Redis 7                                 |
|   - Relational Core Models        |   |   - Channels WebSocket Backend            |
|   - Strict Foreign Key Integrity  |   |   - Real-time KPI Cache                   |
|   - Audit Ledger Indexes          |   |   - Celery Task Queue                     |
+-----------------------------------+   +-------------------------------------------+
```

---

## 2. Team Member Work Breakdown

### 🎨 Frontend Team (2 Members)

#### Frontend Developer 1: Core Shell, Auth & Analytics
- **Authentication**: Login, Signup, OTP Password Reset (`src/app/(auth)/...`, `src/components/auth/...`)
- **Dashboard & KPIs**: Real-time KPI cards, Stock overview charts, dynamic filters (`src/app/(dashboard)/dashboard/...`, `src/components/dashboard/...`)
- **Layout & Shell**: Sidebar, Topbar, Mobile Navigation, breadcrumbs (`src/components/layout/...`)
- **Shared UI Library**: Reusable buttons, modals, data tables, toasts, loaders (`src/components/shared/...`)
- **Design System**: Global CSS tokens, variables, typography, dark/light themes (`src/styles/...`)

#### Frontend Developer 2: Operations, 3D Warehouse & Smart Tools
- **Products Module**: Product catalog, category tree, stock availability per warehouse (`src/app/(dashboard)/products/...`)
- **Stock Operations**: Receipts (incoming), Deliveries (outgoing), Internal transfers, Stock adjustments (`src/app/(dashboard)/operations/...`)
- **3D Warehouse Visualizer**: Three.js scene, rack layout, heatmap overlay, orbit camera controls (`src/components/warehouse3d/...`)
- **Smart Tools**: Web-based barcode/QR scanner (`src/components/scanner/...`) and Hands-free voice counter (`src/components/voice/...`)
- **Move History & Audit**: Immutable stock ledger table & visual timeline (`src/app/(dashboard)/move-history/...`)

---

### ⚙️ Backend Team (2 Members)

#### Backend Developer 1: Auth, Product Catalog & Warehouse Master
- **Authentication App**: Custom User model, JWT auth, OTP password reset service, role-based permissions (`apps/authentication/...`)
- **Products App**: Products, Categories, Units of Measure (UoM), Reorder rules, Barcode generator (`apps/products/...`)
- **Warehouse App**: Warehouses, Zones, Racks, Locations, Topology service (`apps/warehouse/...`)
- **Dashboard Service**: KPI aggregation queries, low stock queries, filter handlers (`apps/dashboard/...`)

#### Backend Developer 2: Operations Engine, Ledger, AI & Realtime
- **Operations App**: Receipts, Deliveries, Transfers, Adjustments with transactional validation (`apps/operations/...`)
- **Stock Ledger App**: Append-only immutable ledger, tamper-proof tracking (`apps/stock_ledger/...`)
- **Alerts App**: Automated low-stock trigger, movement anomaly detector (`apps/alerts/...`)
- **AI Forecasting App**: Historical trend analyzer, ML reorder point predictor (`apps/forecasting/...`)
- **Realtime / WebSocket**: Django Channels consumers, live broadcasting (`realtime/...`)
