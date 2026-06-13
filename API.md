# Khaatiaraarot API

REST API for grocery e-commerce. Base path: `/api/v1`.

## Quick Start

```
Base URL:    http://localhost:4000/api/v1
Swagger UI:  http://localhost:4000/api/v1/docs
```

All responses are JSON. Send `Content-Type: application/json` on `POST`/`PUT`/`PATCH`.

## Response Format

**Success**
```json
{ "success": true, "data": { ... } }
```

**Error**
```json
{ "success": false, "error": { "code": "ERR_CODE", "message": "Reason" } }
```

Common HTTP codes: `200` OK, `201` Created, `400` validation, `401` auth, `403` forbidden, `404` not found, `409` conflict, `429` rate limit, `500` server.

## Authentication

JWT in `Authorization` header. Refresh token in `httpOnly` cookie.

```
Authorization: Bearer <accessToken>
```

Access token expires in 15m. Use `/auth/refresh` to rotate. Send credentials with `withCredentials: true` (axios) / `credentials: 'include'` (fetch) so cookie flows.

### Flow

1. `POST /auth/register` or `POST /auth/login` → returns `accessToken`, sets refresh cookie.
2. Attach `Authorization: Bearer <accessToken>` on protected calls.
3. On `401`: call `POST /auth/refresh` → new `accessToken`. Retry original call.
4. `POST /auth/logout` to invalidate.

### Roles

- `customer` — default.
- `admin` — required for `/admin/*`.

## Endpoints

### Auth `/auth`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/register` | — | Create customer. Body: `name, email, password, phone` |
| POST | `/login` | — | Body: `email, password`. Returns `accessToken` |
| POST | `/refresh` | cookie | Rotate refresh, get new access token |
| POST | `/logout` | bearer | Revoke current token |

### Products `/products` (public)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | List. Query: `page, limit, q, category, sort` (`newest\|price_asc\|price_desc\|name_asc`) |
| GET | `/top-sellers` | Best-selling products |
| GET | `/:id` | Single product (UUID) |

### Categories `/categories` (public)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | All active categories |
| GET | `/:slug` | By slug (e.g. `fresh-vegetables`) |

### Banners `/banners` (public)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Active banners. Query: `type` (`hero\|side\|promo`) |

### Cart `/cart` (guest or authenticated)

Guest carts work via session cookie. Auto-merges on login.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Current cart |
| POST | `/items` | Add. Body: `productId, quantity` |
| PATCH | `/items/:productId` | Update qty. Body: `quantity` |
| DELETE | `/items/:productId` | Remove item |
| DELETE | `/` | Clear cart |

### Orders `/orders` (auth required)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/` | Place order from cart. Body: `paymentMethod, address{fullName,phone,line1,line2?,city,district,postalCode?}, notes?`. Optional header `Idempotency-Key` |
| GET | `/` | List own orders. Query: `page, limit` |
| GET | `/:id` | Order detail |

`paymentMethod`: `cash`, `card`, `gcash`, `bkash`, `nagad`, `manual`.

### Districts `/districts` (public)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Bangladesh district list (for address forms) |

---

## Admin `/admin` (admin role required)

All admin routes require `Authorization: Bearer <adminAccessToken>`. Non-admin → `403`.

### Products `/admin/products`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | All products. Query: `page, limit, q, categoryId, isActive` |
| POST | `/` | Create. Body: `name, slug, unit, price, description?, sourceRegion?, categoryId?, originalPrice?, stockQty?, lowStockThreshold?, isBestSelling?, isActive?` |
| PUT | `/:id` | Partial update |
| DELETE | `/:id` | Soft delete (`isActive=false`) |
| PUT | `/:id/stock` | Set stock. Body: `stockQty` |
| POST | `/:id/images` | Upload image. `multipart/form-data`, field `image` |
| DELETE | `/:id/images/:imageId` | Remove image |
| PATCH | `/:id/images/:imageId/primary` | Mark primary |

### Categories `/admin/categories`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | All (incl. inactive) |
| POST | `/` | Body: `name, slug, nameBn?, sortOrder?, isActive?` |
| PUT | `/:id` | Update |
| DELETE | `/:id` | Soft delete |
| POST | `/:id/image` | Upload image (multipart) |

### Banners `/admin/banners`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | All |
| POST | `/` | Body: `type(hero\|side\|promo), title?, subtitle?, tagText?, ctaLabel?, ctaHref?, sortOrder?, isActive?, startsAt?, endsAt?` |
| PUT | `/:id` | Update |
| DELETE | `/:id` | Hard delete |
| POST | `/:id/image` | Upload (multipart) |

### Orders `/admin/orders`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | All orders. Query: `page, limit, status, q, from, to` |
| POST | `/` | Manual order. Body: `source(facebook\|phone\|admin), paymentMethod, address, items[{productId,quantity}], notes?` |
| GET | `/:id` | Detail |
| PUT | `/:id/status` | Body: `status(confirmed\|processing\|shipped\|delivered\|cancelled\|refunded), note?` |
| POST | `/:id/invoice` | Queue invoice email |

### Inventory `/admin/inventory`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Stock levels. Query: `page, limit, lowStockOnly` |

### Rate Plans `/admin/rate-plans`

Delivery cost per district.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | All plans |
| POST | `/` | Body: `name, description?, isActive?, rates[{district, costPerUnit}]` |
| GET | `/:id` | Single plan with district rates |
| PUT | `/:id` | Update. `rates` array **replaces** all existing district rates |
| DELETE | `/:id` | Delete (products' `ratePlanId` set null) |

### Reports `/admin/reports`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/dashboard` | Revenue + orders today/month/year/all, low stock, recent orders |
| GET | `/sales` | Time series. Query: `from, to, group(day\|month)` |
| GET | `/revenue` | By payment method + source. Query: `from, to` |
| GET | `/top-products` | Query: `from, to, limit` |
| GET | `/top-categories` | Query: `from, to` |

---

## Integration Notes

- **CORS**: server allows origin from `ALLOWED_ORIGIN` env. Must match exactly (no trailing slash). Credentials enabled.
- **Rate limits**: global limiter + stricter limiter on `/auth/*` and uploads. On `429` back off.
- **Images**: stored in Cloudinary. Responses return CDN URLs — use directly in `<img src>`.
- **Idempotency**: pass unique `Idempotency-Key` header on `POST /orders` so retries don't duplicate.
- **Pagination shape**: `{ data: [...], pagination: { page, limit, total, totalPages } }`.
- **UUIDs** for all IDs unless stated.
- **Dates**: ISO 8601 strings.
- **Errors**: read `error.code` (machine) for branching; `error.message` (human) for UI.

## Example: Login + fetch products (axios)

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
});

const { data } = await api.post('/auth/login', { email, password });
const token = data.data.accessToken;

api.defaults.headers.common.Authorization = `Bearer ${token}`;

const products = await api.get('/products', { params: { page: 1, limit: 20 } });
```

## Example: Refresh on 401

```js
api.interceptors.response.use(r => r, async err => {
  if (err.response?.status === 401 && !err.config._retry) {
    err.config._retry = true;
    const r = await api.post('/auth/refresh');
    api.defaults.headers.common.Authorization = `Bearer ${r.data.data.accessToken}`;
    return api(err.config);
  }
  throw err;
});
```

## Full reference

Swagger UI lists every field, enum, and response shape: `http://localhost:4000/api/v1/docs`.
