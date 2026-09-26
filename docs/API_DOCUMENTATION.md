# StockSense REST & WebSocket API Specification

Base URL: `http://localhost:8000/api`  
WebSocket URL: `ws://localhost:8000/ws`  
Authentication: `Bearer <JWT_ACCESS_TOKEN>` in `Authorization` header

---

## 1. Authentication Endpoints (`/api/auth/`)

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/auth/signup/` | Register new user | `{ email, password, first_name, last_name, role }` |
| `POST` | `/api/auth/login/` | Obtain JWT tokens | `{ email, password }` |
| `POST` | `/api/auth/refresh/` | Refresh JWT access token | `{ refresh }` |
| `POST` | `/api/auth/otp/send/` | Send 6-digit password reset OTP | `{ email }` |
| `POST` | `/api/auth/otp/verify/` | Verify OTP code | `{ email, otp_code }` |
| `POST` | `/api/auth/reset-password/` | Set new password with verified OTP | `{ email, otp_code, new_password }` |

---

## 2. Product Catalog (`/api/products/`)

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/products/` | List products with pagination | `category`, `search`, `low_stock=true` |
| `POST` | `/api/products/` | Create a product | `{ name, sku, category_id, uom, barcode }` |
| `GET` | `/api/products/{id}/` | Retrieve product details | - |
| `PUT` | `/api/products/{id}/` | Update product information | Product fields |
| `DELETE`| `/api/products/{id}/` | Soft-delete product | - |
| `GET` | `/api/products/{id}/availability/` | Breakdown of stock per warehouse & location | - |
| `GET` | `/api/products/categories/` | List all product categories | - |
| `POST` | `/api/products/categories/` | Create new category | `{ name, parent_id, description }` |
| `GET` | `/api/products/{id}/reorder-rules/` | Get or update reorder thresholds | - |

---

## 3. Operations Endpoints (`/api/operations/`)

Filterable by: `status` (`draft`, `waiting`, `ready`, `done`, `canceled`), `warehouse`, `search`.

### Receipts (Incoming Goods)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/operations/receipts/` | List receipts |
| `POST` | `/api/operations/receipts/` | Create receipt draft with items |
| `GET` | `/api/operations/receipts/{id}/` | Get receipt details & items |
| `POST` | `/api/operations/receipts/{id}/validate/` | **Validate receipt**: Increases inventory & writes to ledger |

### Delivery Orders (Outgoing Goods)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/operations/deliveries/` | List delivery orders |
| `POST` | `/api/operations/deliveries/` | Create delivery draft with items |
| `POST` | `/api/operations/deliveries/{id}/validate/` | **Validate delivery**: Deducts inventory & writes to ledger |

### Internal Transfers (Location-to-Location)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/operations/transfers/` | List transfers |
| `POST` | `/api/operations/transfers/` | Initiate internal stock transfer |
| `POST` | `/api/operations/transfers/{id}/confirm/` | Confirm transfer: moves stock between quants |

### Inventory Adjustments (Physical Count Reconciliation)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/operations/adjustments/` | List adjustment history |
| `POST` | `/api/operations/adjustments/` | Submit physical count and reconcile discrepancies |

---

## 4. Immutable Stock Ledger (`/api/ledger/`)

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/ledger/` | Full chronological stock ledger | `product_id`, `location_id`, `operation_type`, `date_from`, `date_to` |
| `GET` | `/api/ledger/product/{id}/` | Complete movement history for single product | - |

---

## 5. Dashboard KPIs & Analytics (`/api/dashboard/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/kpis/` | Current metrics: Total Products, Low Stock Count, Pending Receipts, Pending Deliveries, Scheduled Transfers |
| `GET` | `/api/dashboard/charts/` | Stock level trends, weekly in/out movements, warehouse distribution |

---

## 6. 3D Warehouse & Topology (`/api/warehouses/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/warehouses/` | List all warehouses |
| `GET` | `/api/warehouses/{id}/locations/` | Get 3D coordinates (`x_pos`, `y_pos`, `z_pos`), rack names, and real-time stock levels for Three.js rendering |
| `GET` | `/api/warehouses/topology/` | Network graph of warehouses and active transfer routes |

---

## 7. AI Forecasting & Alerts (`/api/forecasting/` & `/api/alerts/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/forecasting/{product_id}/` | ML demand prediction for next 30/60/90 days with reorder suggestion |
| `GET` | `/api/alerts/` | List active low stock & anomaly detection alerts |
| `POST` | `/api/alerts/{id}/acknowledge/` | Acknowledge/dismiss an alert |

---

## 8. Real-Time WebSockets (`ws://localhost:8000/ws/stock/`)

Clients connect via WebSocket to receive instant broadcast events:
```json
{
  "type": "STOCK_UPDATED",
  "data": {
    "product_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "product_name": "Steel Rods",
    "location_id": 14,
    "delta": 50.0,
    "new_quantity": 150.0,
    "operation_type": "receipt",
    "reference": "REC-2025-001"
  }
}
```
Event Types:
- `STOCK_UPDATED`
- `OPERATION_STATUS_CHANGED`
- `LOW_STOCK_TRIGGERED`
- `ANOMALY_DETECTED`
