import http from 'k6/http';
import { sleep, check } from 'k6';

// Configuración: 10 VU por 30 segundos (carga ligera)
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 VU
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% de requests < 200ms
    http_req_failed: ['rate<0.1'],    // <10% fallos
  },
};

export default function () {
  const url = 'https://httpbin.test.k6.io/get';
  const params = { headers: { 'User-Agent': 'k6-test' } };

  const response = http.get(url, params);

  // Check: Verifica status 200
  const checkRes = check(response, {
    'status is 200': (r) => r.status === 200,
  });

  // Think time: Simula usuario real (pausa 1s)
  sleep(1);
}