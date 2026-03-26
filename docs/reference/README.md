# 📚 REFERENCE DOCUMENTATION

> Technical specifications and API contracts.

## What's in this folder?

This folder contains **reference documentation** — technical specs that don't change often but are essential for implementation.

### Documents

| Document | Purpose | For |
|----------|---------|-----|
| **API_CONTRACT.md** | API endpoints, request/response schemas, status codes | Backend & Frontend devs |
| **CHANGELOG.md** | Historical changes, improvements, version history | Everyone (release notes) |

## API Reference

### Where's the full API documentation?

When the backend is running, visit:
```
http://localhost:5000/swagger-ui
```

This provides **interactive OpenAPI documentation** generated from the code.

### If you're building an endpoint

1. Define request/response in [API_CONTRACT.md](./API_CONTRACT.md)
2. Implement in backend
3. Add Swagger/OpenAPI metadata in code
4. Test in Swagger UI
5. Verify against contract

### If you're consuming an endpoint

1. Check [API_CONTRACT.md](./API_CONTRACT.md) for schema
2. Handle error codes documented there
3. Test with Swagger UI
4. Check [CHANGELOG.md](./CHANGELOG.md) for breaking changes

## Change History

### Reading the Changelog

[CHANGELOG.md](./CHANGELOG.md) documents:
- ✅ Features added
- 🔧 Features improved/refactored
- 🐛 Bugs fixed
- ⚠️ Breaking changes
- 🗑️ Features removed

### Why it matters

- **API versions**: Different endpoints may have different stability
- **Breaking changes**: Marked clearly (⚠️) with migration guide
- **Deprecations**: Features marked for removal (3-month notice)

### Making changes

1. Update [API_CONTRACT.md](./API_CONTRACT.md) FIRST
2. Implement the change
3. Add entry to [CHANGELOG.md](./CHANGELOG.md)
4. If breaking: include migration guide
5. If deprecation: announce 3-month timeline

## Common Tasks

### "I need to add a new endpoint"
1. Add to [API_CONTRACT.md](./API_CONTRACT.md)
2. Follow the format in that doc
3. Include: method, path, auth, request schema, response schema, error codes
4. Implement in backend
5. Update [CHANGELOG.md](./CHANGELOG.md)

### "An endpoint changed, how do I update it?"
1. Check [CHANGELOG.md](./CHANGELOG.md) — is it documented?
2. Update [API_CONTRACT.md](./API_CONTRACT.md)
3. Update implementation
4. Document in [CHANGELOG.md](./CHANGELOG.md)

### "What changed between versions?"
1. Check [CHANGELOG.md](./CHANGELOG.md)
2. Look for "Breaking changes" or deprecations
3. Update your code if needed

## Maintenance

These docs are updated:
- **API_CONTRACT.md**: When endpoints change
- **CHANGELOG.md**: When code changes are released

**Last updated**: 2026-03-26
**Maintained by**: Backend Team & API Lead
