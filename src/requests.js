const crypto = require("crypto");
const https = require('https');
const core = require("@actions/core");

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

  return response;
};

module.exports = requests;
