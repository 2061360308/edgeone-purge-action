const crypto = require("crypto");

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

const requests = async (SECRET_ID, SECRET_KEY, payload) => {
  try {
    // API 参数配置
    const endpoint = "teo.tencentcloudapi.com";
    const service = "teo";
    const region = "ap-guangzhou";
    const action = "CreatePurgeTask";
    const version = "2022-09-01";
    const timestamp = Math.floor(Date.now() / 1000);
    const date = getDate(timestamp);

    // 构造请求体
    // const payload = JSON.stringify({
    //   ZoneId: ZONE_ID,
    //   Type: "purge_host",
    //   Targets: HOSTNAMES,
    // });

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
    const response = await fetch(`https://${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json; charset=utf-8",
        Host: endpoint,
        "X-TC-Action": action,
        "X-TC-Timestamp": timestamp.toString(),
        "X-TC-Version": version,
        "X-TC-Region": region,
      },
      body: payload,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`API请求失败: ${JSON.stringify(result.Response)}`);
    }

    // 检查失败列表
    if (result.Response.FailedList?.length > 0) {
      console.error("部分Host刷新失败:", result.Response.FailedList);
      process.exit(1);
    }

    console.log("Hostname刷新成功:", {
      JobId: result.Response.JobId,
      RequestId: result.Response.RequestId,
    });
  } catch (error) {
    // 网络错误处理
    if (error.code === "ENOTFOUND") {
      console.error("DNS解析失败，请检查endpoint配置");
    }
    // 签名错误处理
    if (error.message.includes("AuthFailure")) {
      console.error("凭证验证失败，请检查SecretId/SecretKey");
    }
    // 业务逻辑错误
    if (error.Response?.Error) {
      console.error(
        `API错误: [${error.Response.Error.Code}] ${error.Response.Error.Message}`
      );
    }
    console.error("❌ 刷新操作失败:", error.message);
    process.exit(1);
  }
};

module.exports = requests;