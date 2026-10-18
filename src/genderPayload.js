const splitTargets = (value) =>
  String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const validateDirectoryTargets = (targets) => {
  for (const target of targets) {
    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      throw new Error(`目录刷新地址无效: ${target}`);
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(`目录刷新地址必须使用 http/https 协议: ${target}`);
    }
  }
};

export const hostNamePurge = (ZONE_ID, EDGEONE_HOSTNAMES) => {
  const HOSTNAMES = splitTargets(EDGEONE_HOSTNAMES);

  if (!HOSTNAMES.length) {
    throw new Error("hostnames 不能为空");
  }

  return JSON.stringify({
    ZoneId: ZONE_ID,
    Type: "purge_host",
    Targets: HOSTNAMES,
  });
};

export const prefixPurge = (ZONE_ID, EDGEONE_PATHS, METHOD = "invalidate") => {
  const PATHS = splitTargets(EDGEONE_PATHS);

  if (!PATHS.length) {
    throw new Error("paths 不能为空");
  }
  if (METHOD !== "invalidate" && METHOD !== "delete") {
    throw new Error(`不支持的 method 值: ${METHOD}`);
  }

  validateDirectoryTargets(PATHS);

  return JSON.stringify({
    ZoneId: ZONE_ID,
    Type: "purge_prefix",
    Method: METHOD,
    Targets: PATHS,
  });
};
