# Guía de K6 con InfluxDB y Grafana

## Paso 1 — Levantar InfluxDB + Grafana

En la raíz del proyecto:

```bash
docker-compose up -d
```

Verifica:
* InfluxDB disponible en → http://localhost:8086
* Grafana disponible en → http://localhost:3000
   * Usuario: `admin`
   * Contraseña: `admin`

## Paso 2 — Configurar Data Source en Grafana

1. En Grafana → ⚙️ Configuration → Data Sources → Add data source
2. Tipo: InfluxDB
3. URL: `http://influxdb:8086`
4. Database: `k6`
5. User: `k6`
6. Password: `k6pass`
7. Save & Test ✅

## Paso 3 — Probar el Mock Server

```bash
# Inicia el servidor
node mock-server/server.js

# En otra terminal, prueba:
curl http://localhost:3001/

# Deberías ver:
# {"status":"success","message":"Mock Server OK","timestamp":123456789}

# Prueba login:
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"session_id":"test123"}'

# Deberías ver respuesta JSON
```

## Paso 4 — Ejecutar la prueba K6 con salida a InfluxDB

Desde tu terminal (en la raíz del proyecto):

```bash
k6 run --out influxdb=http://k6:k6pass@localhost:8086/k6 scripts/basic-load.js.js

k6 run --out influxdb=http://k6:k6pass@localhost:8086/k6 scripts/stress-test.js

k6 run --out influxdb=http://k6:k6pass@localhost:8086/k6 scripts/concurrent-users-test-local.js
```

Esto enviará las métricas en tiempo real a InfluxDB.

## Paso 5 — Ver métricas en Grafana

En Grafana:
* Importa el dashboard `k6-dashboard.json` (Dashboard → New → Import → Upload JSON file)
* Una vez importado, verás paneles de:
   * Tasa de solicitudes por segundo
   * Latencia p(95)
   * Errores HTTP
   * Checks (`login`)
   * Throughput, VUs activos, etc.

## 🧹 Para detener el entorno

```bash
docker-compose down
```

Si quieres borrar todos los datos almacenados:

```bash
docker-compose down -v
```

## Tip extra: guardar resultados HTML + InfluxDB

Puedes combinar ambas salidas:

```bash
k6 run \
  --out influxdb=http://k6:k6pass@localhost:8086/k6 \
  --summary-export results.json \
  scripts/concurrent-users-test-local.js
```

Después de la ejecución tendrás:
* `summary.html` → reporte HTML del `k6-reporter`
* métricas completas en Grafana