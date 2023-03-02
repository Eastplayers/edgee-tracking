import { browserName, deviceDetect } from "react-device-detect";

const SOCKET_URL = "https://api-cdp-staging.edgee.io";
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
        event_code: eventName,
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
    const toastCss = document.createElement("link");
    toastCss.href =
      "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";
    toastCss.rel = "stylesheet";
    toastCss.type = "text/css";
    const toastScript = document.createElement("script");
    toastScript.src = "https://cdn.jsdelivr.net/npm/toastify-js";
    const socketScript = document.createElement("script");
    socketScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.js";

    socketScript.onload = () => {
      // @ts-ignore
      const socket = io(SOCKET_URL);

      socket.on("ABANDONED_CART_CREATE", (data: any) => {
        console.log("ABANDONED_CART_CREATE", data.content);
        const toastContainer = document.createElement("div");
        toastContainer.setAttribute(
          "style",
          "display: flex; flex-direction: column; gap: 8px; align-items: flex-end"
        );
        const toastContent = document.createElement("div");
        toastContent.setAttribute(
          "style",
          "font-size: 20px; font-family: Arial; line-height: 28px"
        );
        toastContent.innerHTML = data.content;
        const copyButton = document.createElement("button");
        copyButton.setAttribute("style", "padding: 6px 16px; font-size: 20px");
        copyButton.innerHTML = "Copy promotion";
        toastContainer.appendChild(toastContent);
        toastContainer.appendChild(copyButton);
        // @ts-ignore
        Toastify({
          node: toastContainer,
          duration: -1,
          // destination: "https://github.com/apvarun/toastify-js",
          // newWindow: true,
          close: true,
          gravity: "bottom",
          position: "left",
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "white",
            color: "black",
            "max-width": "400px",
          },
          onClick: function () {}, // Callback after click
        }).showToast();
      });
    };

    document.body.appendChild(socketScript);
    document.body.appendChild(toastScript);
    document.head.appendChild(toastCss);

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

const logEvent = (name: string, payload: Record<string, any> = {}) => {
  sendEvent(name, payload);
};

const renderRecommendedProducts = () => {
  const el = document.getElementById("product");
  const productEl = document.createElement("div");
  productEl.innerHTML = "Hello";
  el?.append(productEl);
  // fetch(LOCATION_URL, {
  //   method: "GET",
  //   headers: {
  //     accept: "application/json",
  //   },
  // })
  //   .then((res) => res.json())
  //   .then((res) => {
  //     // Dungf id de lay element
  //   });
};

const EdgeeTracking = {
  init,
  logEvent,
  renderRecommendedProducts,
};

export default EdgeeTracking;
