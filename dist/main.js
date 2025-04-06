'use strict';

var require$$2 = require('@actions/core');
var require$$0 = require('crypto');
var require$$1 = require('https');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var main$1 = {};

const hostNamePurge = (ZONE_ID, EDGEONE_HOSTNAMES) => {
  const HOSTNAMES = EDGEONE_HOSTNAMES.split(",");

  return JSON.stringify({
    ZoneId: ZONE_ID,
    Type: "purge_host",
    Targets: HOSTNAMES,
  });
};

var genderPayload = /*#__PURE__*/Object.freeze({
	__proto__: null,
	hostNamePurge: hostNamePurge
});

var requests_1;
var hasRequiredRequests;

function requireRequests () {
	if (hasRequiredRequests) return requests_1;
	hasRequiredRequests = 1;
	const crypto = require$$0;
	const https = require$$1;

	const sha256 = (message, secret, encoding) => {
	  const hmac = crypto.createHmac("sha256", secret);
	  return hmac.update(message).digest(encoding);
	};

	const getHash = (message, encoding = "hex") => {
	  const hash = crypto.createHash("sha256");
	  return hash.update(message).digest(encoding);
	};

	const getDate = (timestamp) => {
	  const date = new Date(timestamp * 1000);
	  return date.toISOString().slice(0, 10).replace(/-/g, "-");
	};

	const makeRequest = (endpoint, payload, headers) => {
	  return new Promise((resolve, reject) => {
	    const req = https.request({
	      hostname: endpoint,
	      path: '/',
	      method: 'POST',
	      headers: headers
	    }, (res) => {
	      let data = '';
	      res.on('data', (chunk) => data += chunk);
	      res.on('end', () => resolve(JSON.parse(data)));
	    });
	    
	    req.on('error', reject);
	    req.write(payload);
	    req.end();
	  });
	};

	const requests = async (SECRET_ID, SECRET_KEY, payload) => {
	  // API 参数配置
	  const endpoint = "teo.tencentcloudapi.com";
	  const service = "teo";
	  const region = "ap-guangzhou";
	  const action = "CreatePurgeTask";
	  const version = "2022-09-01";
	  const timestamp = Math.floor(Date.now() / 1000);
	  const date = getDate(timestamp);

	  // ************* 签名计算部分 *************
	  // 步骤1：规范请求
	  const httpRequestMethod = "POST";
	  const canonicalUri = "/";
	  const canonicalQueryString = "";
	  const canonicalHeaders =
	    [
	      `content-type:application/json; charset=utf-8`,
	      `host:${endpoint}`,
	      `x-tc-action:${action.toLowerCase()}`,
	    ].join("\n") + "\n";
	  const signedHeaders = "content-type;host;x-tc-action";
	  const hashedRequestPayload = getHash(payload);

	  const canonicalRequest = [
	    httpRequestMethod,
	    canonicalUri,
	    canonicalQueryString,
	    canonicalHeaders,
	    signedHeaders,
	    hashedRequestPayload,
	  ].join("\n");

	  // 步骤2：待签字符串
	  const algorithm = "TC3-HMAC-SHA256";
	  const hashedCanonicalRequest = getHash(canonicalRequest);
	  const credentialScope = `${date}/${service}/tc3_request`;
	  const stringToSign = [
	    algorithm,
	    timestamp,
	    credentialScope,
	    hashedCanonicalRequest,
	  ].join("\n");

	  // 步骤3：计算签名
	  const kDate = sha256(date, "TC3" + SECRET_KEY);
	  const kService = sha256(service, kDate);
	  const kSigning = sha256("tc3_request", kService);
	  const signature = sha256(stringToSign, kSigning, "hex");

	  // 步骤4：构造Authorization头
	  const authorization = `${algorithm} Credential=${SECRET_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

	  // 发送API请求
	  const response = await makeRequest(endpoint, payload, {
	    Authorization: authorization,
	    "Content-Type": "application/json; charset=utf-8",
	    Host: endpoint,
	    "X-TC-Action": action,
	    "X-TC-Timestamp": timestamp.toString(),
	    "X-TC-Version": version,
	    "X-TC-Region": region,
	  });
	  // const response = await fetch(`https://${endpoint}`, {
	  //   method: "POST",
	  //   headers: {
	  //     Authorization: authorization,
	  //     "Content-Type": "application/json; charset=utf-8",
	  //     Host: endpoint,
	  //     "X-TC-Action": action,
	  //     "X-TC-Timestamp": timestamp.toString(),
	  //     "X-TC-Version": version,
	  //     "X-TC-Region": region,
	  //   },
	  //   body: payload,
	  // });

	  return response;
	};

	requests_1 = requests;
	return requests_1;
}

var hasRequiredMain;

function requireMain () {
	if (hasRequiredMain) return main$1;
	hasRequiredMain = 1;
	const core = require$$2;
	const { hostNamePurge } = genderPayload;
	const requests = requireRequests();

	async function run() {
	  try {
	    const SECRET_ID = core.getInput('secret_id');
	    const SECRET_KEY = core.getInput('secret_key');
	    const ZONE_ID = core.getInput('zone_id');
	    const HOSTNAMES = core.getInput('hostnames');
	    const type = core.getInput('type'); // 新增的输入参数，默认为 'purge_host'

	    // 检查必要参数
	    const missingParams = [];
	    if (!SECRET_ID) missingParams.push('secret_id');
	    if (!SECRET_KEY) missingParams.push('secret_key');
	    if (!ZONE_ID) missingParams.push('zone_id');
	    if (!type) missingParams.push('type');
	    
	    if (missingParams.length > 0) {
	      const errorMsg = `缺少必要的输入参数: ${missingParams.join(', ')}`;
	      throw new Error(errorMsg);
	    }

	    let payload;
	    if (type === 'purge_host' && HOSTNAMES) {
	        payload = hostNamePurge(ZONE_ID, HOSTNAMES);
	    }

	    if (payload) {
	      const response = await requests(SECRET_ID, SECRET_KEY, payload);

	      core.info(`API响应: ${JSON.stringify(response)}`);

	      // 检查失败列表
	      if (response.Response.FailedList?.length > 0) {
	        core.error(`部分Host刷新失败: ${JSON.stringify(response.Response.FailedList)}`);
	      }

	      core.info(`Hostname刷新成功: ${JSON.stringify({
	        JobId: response.Response.JobId,
	        RequestId: response.Response.RequestId,
	      })}`);
	    }
	    
	  } catch (error) {
	    // 网络错误处理
	    if (error.code === "ENOTFOUND") {
	      core.error("DNS解析失败，请检查endpoint配置");
	    }
	    // 签名错误处理
	    else if (error.message.includes("AuthFailure")) {
	      core.error("凭证验证失败，请检查SecretId/SecretKey");
	    }
	    // 业务逻辑错误
	    else if (error.Response?.Error) {
	      core.error(
	        `API错误: [${error.Response.Error.Code}] ${error.Response.Error.Message}`
	      );
	    }

	    core.error(`❌ EdgeOne刷新操作失败: ${error.message}`);
	    core.setFailed(error.message);
	  }
	}

	run();
	return main$1;
}

var mainExports = requireMain();
var main = /*@__PURE__*/getDefaultExportFromCjs(mainExports);

module.exports = main;
