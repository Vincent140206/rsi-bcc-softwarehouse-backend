const log = require('./logger');

function logActivity(action, detail = {}) {
  log.info({ action, ...detail });
}

module.exports = logActivity;