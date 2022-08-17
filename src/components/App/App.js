import React, { useCallback, useEffect, useRef, useState } from "react";
import Authentication from "../../util/Authentication/Authentication";

import "./App.css";

export default function App() {
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [visible, setVisible] = useState(true);

  //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
  const twitchRef = useRef(window.Twitch?.ext ?? null);
  const authenticationRef = useRef(new Authentication());

  const twitch = twitchRef.current;
  const authentication = authenticationRef.current;

  const contextUpdate = useCallback((context, delta) => {
    if (delta.includes("theme")) {
      setTheme(context.theme);
    }
  }, []);

  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          setFinishedLoading(true);
        }
      });

      twitch.listen("broadcast", (target, contentType, body) => {
        twitch.rig.log(
          `New PubSub message!\n${target}\n${contentType}\n${body}`
        );
        // now that you've got a listener, do something with the result...

        // do something...
      });

      twitch.onVisibilityChanged((visible, _c) => {
        setVisible(visible);
      });

      twitch.onContext((context, delta) => {
        contextUpdate(context, delta);
      });
    }
    return () => {
      if (twitch) {
        twitch.unlisten("broadcast", () =>
          console.log("successfully unlistened")
        );
      }
    };
  }, []);

  if (finishedLoading && visible) {
    return (
      <div className="App">
        <div className={theme === "light" ? "App-light" : "App-dark"}>
          <p>Hello world!</p>
          <p>My token is: {authentication.state.token}</p>
          <p>My opaque ID is {authentication.getOpaqueId()}.</p>
          <div>
            {authentication.isModerator() ? (
              <p>
                I am currently a mod, and here's a special mod button{" "}
                <input value="mod button" type="button" />
              </p>
            ) : (
              "I am currently not a mod."
            )}
          </div>
          <p>
            I have{" "}
            {authentication.hasSharedId()
              ? `shared my ID, and my user_id is ${authentication.getUserId()}`
              : "not shared my ID"}
            .
          </p>
        </div>
      </div>
    );
  } else {
    return <div className="App"></div>;
  }
}
