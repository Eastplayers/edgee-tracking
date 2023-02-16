import { browserName, deviceDetect } from "react-device-detect";

const sendPageViewEvent = () => {
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
            event: "page_view",
          },
          timestamp: new Date().toISOString(),
        };
        fetch("https://api-cdp-staging.edgee.io/api/v1/events", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
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
            event: "page_view",
          },
          timestamp: new Date().toISOString(),
        };
        fetch("https://api-cdp-staging.edgee.io/api/v1/events", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
      });
  }
};

const init = () => {
  if (typeof window !== "undefined") {
    sendPageViewEvent();

    ["pushState"].forEach((changeState) => {
      // @ts-ignore
      window.history["_" + changeState] = window.history[changeState];
      // @ts-ignore
      window.history[changeState] = new Proxy(window.history[changeState], {
        apply(target, thisArg, argList) {
          const [state, title, url] = argList;
          if (window.location.origin !== window.location.origin + url) {
            sendPageViewEvent();
          }

          return target.apply(thisArg, argList);
        },
      });
    });
  }
};

const logEvent = (name: string, payload: Record<string, any>) => {
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
            event: name,
            event_data: payload,
          },
          timestamp: new Date().toISOString(),
        };
        fetch("https://api-cdp-staging.edgee.io/api/v1/events", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
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
            event: name,
            event_data: payload,
          },
          timestamp: new Date().toISOString(),
        };
        fetch("https://api-cdp-staging.edgee.io/api/v1/events", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
      });
  }
};

const EdgeeTracking = {
  init,
  logEvent,
};

export default EdgeeTracking;
