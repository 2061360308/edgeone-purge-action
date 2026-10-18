const core = require("@actions/core");
const { hostNamePurge, prefixPurge } = require("./genderPayload.js");
const requests = require("./requests.js");

async function run() {
  try {
    const SECRET_ID = core.getInput("secret_id");
    const SECRET_KEY = core.getInput("secret_key");
    const ZONE_ID = core.getInput("zone_id");
    const HOSTNAMES = core.getInput("hostnames");
    const PATHS = core.getInput("paths");
    const METHOD = core.getInput("method") || "invalidate";
    const type = core.getInput("type"); // 默认 'purge_host'

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
      case "purge_prefix":
        if (!PATHS) {
          throw new Error(
            "当type为'purge_prefix'时，必须提供paths参数（目录 URL，逗号或换行分隔）"
          );
        }
        payload = prefixPurge(ZONE_ID, PATHS, METHOD);
        break;
      default:
        throw new Error(`不支持的type值: ${type}`);
    }

    const typeLabel = type === "purge_prefix" ? "目录" : "Hostname";
    const response = await requests(SECRET_ID, SECRET_KEY, payload);

    core.info(`API响应: ${JSON.stringify(response, null, 2)}`);

    const apiResponse = response?.Response ?? {};

    if (apiResponse.Error) {
      throw new Error(
        `API错误: [${apiResponse.Error.Code}] ${apiResponse.Error.Message}`
      );
    }

    // 检查失败列表
    if (apiResponse.FailedList?.length > 0) {
      core.error(
        `部分${typeLabel}刷新失败: ${JSON.stringify(
          apiResponse.FailedList,
          null,
          2
        )}`
      );
      core.setFailed(`部分${typeLabel}刷新失败`);
    }

    core.info(
      `${typeLabel}刷新任务已提交: ${JSON.stringify(
        {
          JobId: apiResponse.JobId,
          RequestId: apiResponse.RequestId,
        },
        null,
        2
      )}`
    );
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
