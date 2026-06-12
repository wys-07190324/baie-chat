// Monkey-patch to fix Vercel CLI's Chinese-char User-Agent issue
const http = require('http');
const https = require('https');

const patch = (mod) => {
  const orig = mod.request;
  mod.request = function (...args) {
    const opts = args[0] || {};
    if (typeof opts === 'string' || opts instanceof URL) {
      // No headers to patch
    } else if (opts.headers) {
      const ua = opts.headers['user-agent'] || opts.headers['User-Agent'] || '';
      // Replace non-ASCII chars in User-Agent
      if (/[^\x00-\x7F]/.test(ua)) {
        opts.headers['user-agent'] = 'vercel-cli (windows)';
      }
    }
    return orig.apply(this, args);
  };
};

patch(http);
patch(https);
