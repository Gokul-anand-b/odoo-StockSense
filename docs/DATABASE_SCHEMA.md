# StockSense Database Schema Design (PostgreSQL)

This document details the PostgreSQL schema designed for high relational integrity, concurrency handling, and audit compliance.

---

## 1. Authentication & Users

### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email address |
| `password` | VARCHAR(255) | NOT NULL | Argon2 / PBKDF2 hashed password |
| `first_name`| VARCHAR(100) | NULL | User's first name |
| `last_name` | VARCHAR(100) | NULL | User's last name |
| `role` | VARCHAR(20) | NOT NULL | `inventory_manager` or `warehouse_staff` |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `created_at`| TIMESTAMPTZ | DEFAULT NOW() | Registration date |
| `updated_at`| TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

### `password_reset_otps`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | OTP record ID |
| `user_id` | UUID | FK -> `users.id` | User requesting reset |
| `otp_code` | VARCHAR(6) | NOT NULL | 6-digit cryptographic OTP |
| `is_used` | BOOLEAN | DEFAULT FALSE | One-time usage flag |
| `expires_at`| TIMESTAMPTZ | NOT NULL | Expiry timestamp (typically 10 mins) |
| `created_at`| TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

---

## 2. Product Catalog

### `product_categories`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Category ID |
| `name` | VARCHAR(120) | UNIQUE, NOT NULL | Category name (e.g. Raw Metals, Hardware) |
| `parent_id`| INTEGER | FK -> self, NULL | Hierarchical nested category support |
| `description`| TEXT | NULL | Category notes |

### `products`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Product ID |
| `name` | VARCHAR(255) | NOT NULL | Product title |
| `sku` | VARCHAR(100) | UNIQUE, NOT NULL | Stock Keeping Unit identifier |
| `category_id`| INTEGER | FK -> `product_categories.id` | Associated category |
| `uom` | VARCHAR(30) | NOT NULL | Unit of measure (kg, pcs, liters, boxes) |
| `barcode` | VARCHAR(100) | UNIQUE, NULL | Scannable EAN/Code128 barcode |
| `description`| TEXT | NULL | Item specifications |
| `is_active` | BOOLEAN | DEFAULT TRUE | Soft delete status |
| `created_at`| TIMESTAMPTZ | DEFAULT NOW() | Creation date |

### `reorder_rules`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Rule ID |
| `product_id`| UUID | FK -> `products.id` | Target product |
| `min_quantity`| DECIMAL(12,2)| NOT NULL | Threshold triggering low stock alert |
| `reorder_quantity`| DECIMAL(12,2)| NOT NULL | Suggested order quantity |

---

## 3. Warehouse & Locations

### `warehouses`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Warehouse ID |
| `name` | VARCHAR(150) | NOT NULL | e.g. "Central Depot", "Production Plant" |
| `code` | VARCHAR(30) | UNIQUE, NOT NULL | e.g. "WH-01" |
| `address` | TEXT | NULL | Physical address |
| `is_active` | BOOLEAN | DEFAULT TRUE | Operational flag |

### `locations` (Racks, Bins, Shelves)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Location ID |
| `warehouse_id`| INTEGER | FK -> `warehouses.id` | Parent warehouse |
| `name` | VARCHAR(100) | NOT NULL | e.g. "Rack A-01", "Receiving Dock" |
| `zone` | VARCHAR(50) | NULL | Zone category (Cold Storage, Bulky) |
| `x_pos` | FLOAT | DEFAULT 0.0 | 3D coordinate X for Three.js visualizer |
| `y_pos` | FLOAT | DEFAULT 0.0 | 3D coordinate Y for Three.js visualizer |
| `z_pos` | FLOAT | DEFAULT 0.0 | 3D coordinate Z for Three.js visualizer |

### `stock_quants` (Stock Availability per Location)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Quant ID |
| `product_id`| UUID | FK -> `products.id` | Item in stock |
| `location_id`| INTEGER | FK -> `locations.id` | Specific rack/shelf |
| `quantity` | DECIMAL(12,2)| NOT NULL, DEFAULT 0 | Real-time physical quantity on hand |
| `reserved_qty`| DECIMAL(12,2)| NOT NULL, DEFAULT 0 | Qty reserved for pending deliveries |
| UNIQUE(`product_id`, `location_id`) |

---

## 4. Operations & Movements

### `operations`
Common header for Receipts, Deliveries, Transfers, and Adjustments.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Operation ID |
| `reference` | VARCHAR(100) | UNIQUE, NOT NULL | e.g. `REC-2025-001`, `DEL-2025-042` |
| `operation_type`| VARCHAR(20) | NOT NULL | `receipt`, `delivery`, `internal_transfer`, `adjustment` |
| `status` | VARCHAR(20) | NOT NULL | `draft`, `waiting`, `ready`, `done`, `canceled` |
| `partner_name` | VARCHAR(200) | NULL | Supplier (Receipt) or Customer (Delivery) |
| `source_location_id` | INTEGER | FK -> `locations.id`, NULL | Movement origin |
| `dest_location_id` | INTEGER | FK -> `locations.id`, NULL | Movement destination |
| `notes` | TEXT | NULL | Additional instructions |
| `created_by` | UUID | FK -> `users.id` | Operator who logged the action |
| `validated_by` | UUID | FK -> `users.id`, NULL | Manager who approved validation |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |
| `validated_at` | TIMESTAMPTZ | NULL | Timestamp of stock execution |

### `operation_items`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Line item ID |
| `operation_id` | UUID | FK -> `operations.id` ON DELETE CASCADE | Parent operation |
| `product_id` | UUID | FK -> `products.id` | Target product |
| `demanded_qty` | DECIMAL(12,2)| NOT NULL | Expected quantity |
| `done_qty` | DECIMAL(12,2)| DEFAULT 0 | Actually picked/received/counted |

---

## 5. Stock Ledger (Append-Only Immutable Audit Trail)

### `stock_ledger`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Ledger entry ID |
| `product_id` | UUID | FK -> `products.id` | Item moved |
| `location_id`| INTEGER | FK -> `locations.id` | Specific location affected |
| `operation_id`| UUID | FK -> `operations.id` | Traceable operation reference |
| `operation_type`| VARCHAR(20) | NOT NULL | `receipt`, `delivery`, `transfer_in`, `transfer_out`, `adjustment` |
| `quantity_delta`| DECIMAL(12,2)| NOT NULL | Signed change (+100, -20, -3) |
| `balance_after`| DECIMAL(12,2)| NOT NULL | Snapshot balance in that location after change |
| `performed_by`| UUID | FK -> `users.id` | Staff member responsible |
| `timestamp` | TIMESTAMPTZ | DEFAULT NOW() | Exact chronological timestamp |
