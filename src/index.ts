import { browserName, deviceDetect } from "react-device-detect";

const init = () => {
  if (typeof window !== "undefined") {
    const currentUrl = window.location.host + window.location.pathname;
    const deviceData = deviceDetect(undefined);

    fetch("https://geolocation-db.com/json/", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ IPv4, ...rest }) => {
        console.log({
          url: currentUrl,
          browser: browserName,
          device: {
            os_name: deviceData.osName,
            os_version: deviceData.osVersion,
            user_agent: deviceData.userAgent,
          },
          ip: IPv4,
          geolocation: rest,
          ad_blocked: false,
        });
      })
      .catch((err) => {
        console.log({
          url: currentUrl,
          browser: browserName,
          device: {
            os_name: deviceData.osName,
            os_version: deviceData.osVersion,
            user_agent: deviceData.userAgent,
          },
          ip: null,
          geolocation: null,
          ad_blocked: true,
        });
      });
  }
};

const EdgeeTracking = {
  init,
};

export default EdgeeTracking;
