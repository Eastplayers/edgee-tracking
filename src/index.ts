import { browserName, deviceDetect } from "react-device-detect";

const URL = "https://api-cdp-staging.edgee.io/api/v1/events";
const LOCATION_URL = "https://geolocation-db.com/json";

const setCookie = (name: string, value: string) => {
  var expires = "";
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop?.()?.split(";").shift();
};

const sendEvent = (eventName = "page_view", eventPayload?: any) => {
  if (typeof window !== "undefined") {
    const deviceData = deviceDetect(undefined);
    let id = getCookie("id");

    if (!id) {
      id = `${new Date().getTime()}`;
      setCookie("id", id);
    }

    const data = {
      source: "WEB",
      payload: {
        id,
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
        event: eventName,
        event_data: eventPayload,
      },
      timestamp: new Date().toISOString(),
    };

    fetch(LOCATION_URL, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ IPv4, ...rest }) => {
        const newData = {
          ...data,
          payload: {
            ...data.payload,
            ip: IPv4,
            geolocation: rest,
            ad_blocked: false,
          },
        };

        fetch(URL, {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(newData),
        });
      })
      .catch((err) => {
        fetch(URL, {
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
    sendEvent();

    ["pushState"].forEach((changeState) => {
      // @ts-ignore
      window.history["_" + changeState] = window.history[changeState];
      // @ts-ignore
      window.history[changeState] = new Proxy(window.history[changeState], {
        apply(target, thisArg, argList) {
          const [state, title, url] = argList;
          if (window.location.origin !== window.location.origin + url) {
            sendEvent();
          }

          return target.apply(thisArg, argList);
        },
      });
    });
  }
};

const logEvent = (name: string, payload: Record<string, any>) => {
  sendEvent(name, payload);
};

const EdgeeTracking = {
  init,
  logEvent,
};

export default EdgeeTracking;
