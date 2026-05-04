import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// FitLab was written for the Claude artifact runtime, which provides
// `window.storage` (an async key-value store). Outside that runtime
// (e.g. on Railway, locally, anywhere with a regular browser) we
// shim it with a tiny localStorage-backed adapter that matches the
// same shape and Promise-returning API.
//
// This must run before FitLab is imported below. Because ES module
// imports are hoisted, we do the shim install eagerly at the top
// using a self-invoking function — that way the shim is in place
// before FitLab's load-time effects run.
(function installStorageShim() {
  if (typeof window === 'undefined' || window.storage) return;
  window.storage = {
    async get(key) {
      try {
        const value = window.localStorage.getItem(key);
        return value === null ? null : { key, value, shared: false };
      } catch {
        return null;
      }
    },
    async set(key, value) {
      try {
        window.localStorage.setItem(key, value);
        return { key, value, shared: false };
      } catch {
        return null;
      }
    },
    async delete(key) {
      try {
        window.localStorage.removeItem(key);
        return { key, deleted: true, shared: false };
      } catch {
        return null;
      }
    },
    async list(prefix = '') {
      try {
        const keys = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(prefix)) keys.push(k);
        }
        return { keys, prefix, shared: false };
      } catch {
        return { keys: [], prefix, shared: false };
      }
    },
  };
})();

import FitLab from './FitLab.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FitLab />
  </React.StrictMode>
);
