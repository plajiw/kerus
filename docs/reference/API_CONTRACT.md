# API Contract (C# Backend)

This document defines the REST API contract that the future `kerus-api` C# backend must implement.
The TypeScript types in `src/types/` are the source of truth for DTO shapes.

## Base URL

```
https://api.kerus.app/v1
```

## Authentication

Bearer token in `Authorization` header. Endpoints below assume authenticated requests.

---

## Recipes (Formulas)

### List
```
GET /recipes
Response: Recipe[]
```

### Get
```
GET /recipes/{id}
Response: Recipe
```

### Create
```
POST /recipes
Body: Omit<Recipe, 'id'>
Response: Recipe (with generated id)
```

### Update
```
PUT /recipes/{id}
Body: Recipe
Response: Recipe
```

### Delete
```
DELETE /recipes/{id}
Response: 204
```

---

## Quotations

### List
```
GET /quotations
Response: Quotation[]
```

### Get
```
GET /quotations/{id}
Response: Quotation
```

### Create
```
POST /quotations
Body: Omit<Quotation, 'id'>
Response: Quotation
```

### Update
```
PUT /quotations/{id}
Body: Quotation
Response: Quotation
```

### Patch Status
```
PATCH /quotations/{id}/status
Body: { status: QuotationStatus }
Response: Quotation
```

### Delete
```
DELETE /quotations/{id}
Response: 204
```

---

## Settings (Company Profile)

```
GET    /settings/company       → CompanySettings
PUT    /settings/company       → CompanySettings
```

---

## TypeScript ↔ C# Type Mapping

| TypeScript | C# |
|---|---|
| `string` (UUID) | `Guid` |
| `string` (ISO date) | `DateOnly` or `string` |
| `number` | `decimal` (for currency), `int` (for counts) |
| `boolean` | `bool` |
| union string type (`'RASCUNHO' \| 'FINAL'`) | `enum` |

## Error Responses

```json
{
  "error": "string",
  "details": "string | null"
}
```

Status codes: `400` validation, `401` auth, `404` not found, `500` server error.
