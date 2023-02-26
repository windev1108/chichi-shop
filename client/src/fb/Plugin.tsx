import React, { useEffect } from "react";
import { init, cleanup } from "./index";

const PluginMessenger = () => {
  useEffect(() => {
    init();

    return () => {
      cleanup();
    };
  }, []);

  return (
    <div>
      <div id="fb-root"></div>
      <div id="fb-customer-chat" className="fb-customerchat"></div>
    </div>
  );
};

export default PluginMessenger;
