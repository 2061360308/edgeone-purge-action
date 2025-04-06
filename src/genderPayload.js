export const hostNamePurge = async (ZONE_ID, EDGEONE_HOSTNAMES) => {
  const HOSTNAMES = EDGEONE_HOSTNAMES.split(",");

  return (payload = JSON.stringify({
    ZoneId: ZONE_ID,
    Type: "purge_host",
    Targets: HOSTNAMES,
  }));
};
