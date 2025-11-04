import http from 'k6/http';
import { sleep, check, fail } from 'k6';
import { Counter } from 'k6/metrics'; // Métrica custom

// Métrica custom: Contador de errores
const errorCounter = new Counter('custom_errors');

// Configuración: Stress incremental (ramp up/down)
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 VU
    { duration: '1m', target: 200 },  // Mantén 200 VU (stress)
    { duration: '30s', target: 50 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // Más tolerante para stress
    http_req_failed: ['rate<0.05'],   // <5% fallos
    'custom_errors': ['rate<1'],      // Errores custom <1 por iteración
  },
};

export default function () {
  const url = 'https://httpbin.test.k6.io/get';
  const params = { headers: { 'User-Agent': 'k6-stress' } };

  const response = http.get(url, params);

  // Check con fail si error
  const checkRes = check(response, {
    'status is 200': (r) => r.status === 200,
  });

  if (!checkRes) {
    errorCounter.add(1); // Incrementa métrica custom
    fail('Request falló: ' + response.status); // Falla la iteración
  }

  sleep(0.5); // Menos pausa para más carga
}