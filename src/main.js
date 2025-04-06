const core = require("@actions/core");
const { hostNamePurge } = require("./genderPayload.js");
const requests = require("./requests.js");

async function run() {
  try {
    const SECRET_ID = core.getInput("secret_id");
    const SECRET_KEY = core.getInput("secret_key");
    const ZONE_ID = core.getInput("zone_id");
    const HOSTNAMES = core.getInput("hostnames");
    const type = core.getInput("type"); // 新增的输入参数，默认为 'purge_host'

    // 检查必要参数
    const missingParams = [];
    if (!SECRET_ID) missingParams.push("secret_id");
    if (!SECRET_KEY) missingParams.push("secret_key");
    if (!ZONE_ID) missingParams.push("zone_id");
    if (!type) missingParams.push("type");

    if (missingParams.length > 0) {
      const errorMsg = `缺少必要的输入参数: ${missingParams.join(", ")}`;
      throw new Error(errorMsg);
    }

    let payload;
    switch (type) {
      case "purge_host":
        if (!HOSTNAMES) {
          throw new Error("当type为'purge_host'时，必须提供hostnames参数");
        }
        payload = hostNamePurge(ZONE_ID, HOSTNAMES);
        break;
      default:
        throw new Error(`不支持的type值: ${type}`);
    }

    if (payload) {
      const response = await requests(SECRET_ID, SECRET_KEY, payload);

      core.info(`API响应: ${JSON.stringify(response, null, 2)}`);

      // 检查失败列表
      if (response.Response.FailedList?.length > 0) {
        core.error(
          `部分Host刷新失败: ${JSON.stringify(
            response.Response.FailedList,
            null,
            2
          )}`
        );
      }

      core.info(
        `Hostname刷新成功: ${JSON.stringify(
          {
            JobId: response.Response.JobId,
            RequestId: response.Response.RequestId,
          },
          null,
          2
        )}`
      );
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
