// scripts/concurrent-users-test-local.js
import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const loginErrors = new Counter('login_errors');
const pageViews = new Counter('page_views');
const loginTime = new Trend('login_duration');
const navigationTime = new Trend('navigation_duration');
const failedRequests = new Rate('failed_requests');

export const options = {
  scenarios: {
    concurrent_users: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<100'],
    'failed_requests': ['rate<0.01'],
  },
};

// USAR PUERTO 3001
const BASE_URL = 'http://localhost:3001';

export default function () {
  const userId = __VU;
  const sessionId = `sess_${userId}_${Date.now()}`;

  // 1. Login
  const loginStart = Date.now();
  const loginRes = http.post(
    `${BASE_URL}/login`,
    JSON.stringify({
      user_id: userId,
      session_id: sessionId,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const loginSuccess = check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login response ok': (r) => r.body.includes('success'),
  });

  loginTime.add(Date.now() - loginStart);

  if (!loginSuccess) {
    loginErrors.add(1);
    failedRequests.add(1);
    return;
  }

  // 2. Navegación
  const pages = ['/get', '/headers', '/status/200'];
  for (const endpoint of pages) {
    const navStart = Date.now();
    const pageRes = http.get(`${BASE_URL}${endpoint}`);

    check(pageRes, {
      'page status 200': (r) => r.status === 200,
    });

    navigationTime.add(Date.now() - navStart);
    pageViews.add(1);
    sleep(1);
  }

  // 3. Logout
  http.post(
    `${BASE_URL}/logout`,
    JSON.stringify({ session_id: sessionId }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  sleep(2);
}