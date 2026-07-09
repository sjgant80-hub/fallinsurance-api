# @ai-native-solutions/fallinsurance-api

HTTP API for FallInsurance — the UK GI broker toolkit. Express wrapper over the SDK, ready for Docker or bare Node.

## Run

```bash
# npm
npm install
npm start           # → http://localhost:8383

# docker
docker compose up --build
```

## Endpoints

### Reference (GET)

```bash
curl http://localhost:8383/t0-rules
curl http://localhost:8383/product-classes
curl http://localhost:8383/idd-questions
curl http://localhost:8383/pi-minimums
curl http://localhost:8383/fos-limits
curl http://localhost:8383/health
```

### Compute (POST · JSON)

**Premium & commission**

```bash
curl -X POST http://localhost:8383/premium \
  -H "Content-Type: application/json" \
  -d '{"gross":1200,"ipt":144,"fee":25,"commissionPct":15}'
```

**Renewal flag**

```bash
curl -X POST http://localhost:8383/renewal-flag \
  -H "Content-Type: application/json" \
  -d '{"renewalDate":"2026-08-15"}'
```

**Pipeline buckets**

```bash
curl -X POST http://localhost:8383/pipeline-buckets \
  -H "Content-Type: application/json" \
  -d '{"policies":[{"status":"in-force","renewalDate":"2026-07-15"}]}'
```

**Bind gate**

```bash
curl -X POST http://localhost:8383/can-bind \
  -H "Content-Type: application/json" \
  -d '{"policy":{"ipid":{"delivered":true},"demandsAndNeeds":"Full IDD Art 20 statement on file, 300 chars..."}}'
```

**Compile Demands & Needs statement**

```bash
curl -X POST http://localhost:8383/demands-and-needs \
  -H "Content-Type: application/json" \
  -d '{
    "policy":  {"ref":"POL-001","productClass":"cyber","insurer":"CFC","sumInsured":500000,"indemnityLimit":1000000,"excess":2500},
    "client":  {"firstName":"Ada","lastName":"Lovelace"},
    "answers": {"coverFor":"Cyber first-party and privacy liability","capacity":"Can absorb £5k excess","claimsHistory":"Nil","preferences":"","vulnerabilities":""}
  }'
```

**Compliance snapshot**

```bash
curl -X POST http://localhost:8383/compliance-snapshot \
  -H "Content-Type: application/json" \
  -d '{
    "firm":{"piExpiresAt":"2026-12-31","piLimitPerClaim":1400000,"piAggregate":2000000,"cassModel":"statutory"},
    "advisers":[{"name":"J Doe","cpdHours":12}],
    "policies":[{"status":"in-force","ipid":{"delivered":false}}]
  }'
```

**T0 offline lookup**

```bash
curl -X POST http://localhost:8383/t0-lookup \
  -H "Content-Type: application/json" \
  -d '{"query":"PI minimum cover for brokers"}'
```

## Environment

- `PORT` — HTTP listen port (default `8383`).

## License

MIT.
