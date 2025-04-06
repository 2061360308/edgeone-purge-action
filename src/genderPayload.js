export const hostNamePurge = (ZONE_ID, EDGEONE_HOSTNAMES) => {
  const HOSTNAMES = EDGEONE_HOSTNAMES.split(",");

  return JSON.stringify({
    ZoneId: ZONE_ID,
    Type: "purge_host",
    Targets: HOSTNAMES,
  });
};
