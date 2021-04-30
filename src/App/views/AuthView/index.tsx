import React, { useCallback, useEffect, useState } from "react";

import ViewOptions, * as Views from "App/views";
import { SelectableList, SelectableListOption } from "components";
import { useScrollHandler } from "hooks";
import { useSpotifyService } from "services/spotify";
import { useWindowService } from "services/window";
import { _saveTokens, isDev } from "utils";
const clientId = "020edb4f1c8648af990f7d89bb3f578a";
const redirectUri = isDev()
  ? "http://localhost:3000"
  : "https://trusting-mayer-01b56a.netlify.app";
const scopes = ["user-read-currently-playing", "user-read-playback-state"];

const initialOptions: SelectableListOption[] = [
  {
    label: "Spotify Signin",
    value: "hi",
    link: `https://accounts.spotify.com/authorize?client_id=${clientId}&=&redirect_uri=${redirectUri}&scope=${scopes.join(
      "%20"
    )}&response_type=token&show_dialog=true`,
  },
];

// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial: any, item) {
    if (item) {
      const parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      _saveTokens(initial["access_token"], initial["access_token"]);
    }
    console.log(JSON.stringify(initial));
    return initial;
  }, {});
window.location.hash = "";

const AuthView = () => {
  const { resetWindowStack } = useWindowService();
  const [options] = useState(initialOptions);
  const [index] = useScrollHandler(ViewOptions.auth.id, options);
  const { loggedIn } = useSpotifyService();

  const handleCheckLogin = useCallback(() => {
    console.log("handleCheckLogin" + loggedIn);
    console.log(JSON.stringify(hash));
    if (loggedIn) {
      resetWindowStack({
        id: ViewOptions.home.id,
        type: Views.WINDOW_TYPE.SPLIT,
        component: Views.HomeView,
      });
    }
  }, [loggedIn, resetWindowStack]);

  useEffect(() => {
    handleCheckLogin();
  }, [handleCheckLogin]);

  return <SelectableList options={options} activeIndex={index} />;
};

export default AuthView;
