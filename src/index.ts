import { browserName, deviceDetect } from "react-device-detect";

const init = () => {
  if (typeof window !== "undefined") {
    const deviceData = deviceDetect(undefined);

    fetch("https://geolocation-db.com/json/", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ IPv4, ...rest }) => {
        const data = {
          source: window.location.href,
          payload: {
            browser: browserName,
            device: {
              os_name: deviceData.osName,
              os_version: deviceData.osVersion,
              user_agent: deviceData.userAgent,
            },
            ip: IPv4,
            geolocation: rest,
            ad_blocked: false,
            origin: window.location.origin,
          },
          timestamp: new Date().toISOString(),
        };
        fetch("https://api-cdp-staging.edgee.io/api/v1/events", {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: JSON.stringify(data),
        });
      })
      .catch((err) => {
        const data = {
          source: window.location.href,
          payload: {
            browser: browserName,
            device: {
              os_name: deviceData.osName,
              os_version: deviceData.osVersion,
              user_agent: deviceData.userAgent,
            },
            ip: null,
            geolocation: null,
            ad_blocked: true,
            origin: window.location.origin,
          },
          timestamp: new Date().toISOString(),
        };
        fetch("https://api-cdp-staging.edgee.io/api/v1/events", {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: JSON.stringify(data),
        });
      });
  }
};

const EdgeeTracking = {
  init,
};

export default EdgeeTracking;
