const core = require('@actions/core');
const { hostNamePurge } = require('./genderPayload.js');
const requests = require('./requests.js');

async function run() {
  try {
    const SECRET_ID = core.getInput('secret_id');
    const SECRET_KEY = core.getInput('secret_key');
    const ZONE_ID = core.getInput('zone_id');
    const HOSTNAMES = core.getInput('hostnames');
    const type = core.getInput('type'); // 新增的输入参数，默认为 'purge_host'

    let payload;
    if (type === 'purge_host' && HOSTNAMES) {
        payload = hostNamePurge(ZONE_ID, HOSTNAMES);
    }

    if (payload) {
      const response = await requests(SECRET_ID, SECRET_KEY, payload);
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();