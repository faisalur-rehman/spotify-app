import React, { useCallback, useEffect, useState } from "react";

import { SelectableList, SelectableListOption } from "components";
import { useMenuHideWindow, useScrollHandler } from "hooks";
import useSpotifyApi from "hooks/useSpotifyApi";

import ViewOptions, { ArtistView } from "../";

const ArtistsView = () => {
  console.log("here");
  useMenuHideWindow(ViewOptions.artists.id);
  const [options, setOptions] = useState<SelectableListOption[]>([]);
  const {
    loading,
    data,
    error,
  } = useSpotifyApi<SpotifyApi.UsersFollowedArtistsResponse>(
    "me/following?type=artist&limit=50"
  );

  const handleData = useCallback(() => {
    if (data !== undefined) {
      console.log("data", data);
      setOptions(
        data!.artists.items.map((artist) => ({
          label: artist.name,
          viewId: ViewOptions.artist.id,
          value: () => <ArtistView name={artist.name} id={artist.id} />,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (data?.artists?.items !== undefined && !options.length && !error) {
      handleData();
    }
  }, [data, error, handleData, options.length]);

  const [index] = useScrollHandler(ViewOptions.artists.id, options);

  return (
    <SelectableList loading={loading} options={options} activeIndex={index} />
  );
};

export default ArtistsView;
