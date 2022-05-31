import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import RepeatIcon from "@mui/icons-material/Repeat";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PauseIcon from "@mui/icons-material/Pause";
import Slider from "@mui/material/Slider";
import { Playlist } from "./playlist";
import "./SaveTheDate.scss";
import { useState, useRef, useEffect } from "react";
import { Stack } from "@mui/material";

const SaveTheDate = () => {
  const [trackIndex, setTrackIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef(
    new Audio(process.env.PUBLIC_URL + Playlist[trackIndex].link)
  );

  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(audioRef.current.volume);

  const intervalRef = useRef();
  const isReady = useRef(false);

  const { duration } = audioRef.current;

  const handleVolume = (newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue;
  };

  const handleSelectedSong = (newValue) => {
    setUserInteracted(true);
    setTrackIndex(newValue);
  };

  const toPrevTrack = () => {
    if (trackIndex - 1 < 0) {
      handleSelectedSong(Playlist.length - 1);
    } else {
      handleSelectedSong(trackIndex - 1);
    }
  };

  const toNextTrack = () => {
    if (trackIndex < Playlist.length - 1) {
      handleSelectedSong(trackIndex + 1);
    } else {
      handleSelectedSong(0);
    }
  };

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [500]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  // Handle setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(
      process.env.PUBLIC_URL + Playlist[trackIndex].link
    );
    audioRef.current.volume = volume;
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current && userInteracted) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [trackIndex]);

  // TODO: Move this function to a common package and enable hours functionality
  function getTime(time) {
    //var hours = Math.floor(time / 3600);
    var minutes = Math.floor(time / 60);
    if (minutes > 59) {
      minutes = Math.floor(time / 60) - 60;
    }

    var seconds = Math.round(time - minutes * 60);
    if (seconds > 3599) {
      seconds = Math.round(time - minutes * 60) - 3600;
    }

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    if (!minutes) minutes = "00";
    if (!seconds) seconds = "00";
    return `${minutes}:${seconds}`;
  }

  const CustomSlider = styled(Slider)(() => ({
    color: "rgb(180, 200, 255)",
    height: 8,
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 24,
      width: 24,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&:before": {
        display: "none",
      },
    },
    "& .MuiSlider-rail": {
      color: "rgb(255, 200, 200)",
    },
  }));

  return (
    <Box className="save-the-date-container">
        <div className="top">
          <div className="left">
            <h3>Save the Date</h3>
            <h5>Edson & Anaïs</h5>
            <ul className="dash">
              {Playlist.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      index === trackIndex ? "song-item selected" : "song-item"
                    }
                    onClick={() => handleSelectedSong(index)}
                  >
                    <li>{item.title}</li>
                    <p>{item.artist}</p>
                  </div>
                );
              })}
            </ul>
          </div>
          <div className="right">
            <div className="image-right"></div>
          </div>
        </div>
        <div className="bot">
          <CustomSlider
            className="seek"
            aria-label="Duration"
            value={trackProgress}
            min={0}
            max={duration ? duration : 0}
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
          ></CustomSlider>
          <div className="track-time">
            <p>{getTime(trackProgress)}</p>
            <p>{getTime(duration)}</p>
          </div>

          <div className="buttons">
            <ShuffleIcon onClick={() => console.log("ShuffleButton", "TODO")} />
            <SkipPreviousIcon onClick={toPrevTrack} aria-label="Previous" />

            {isPlaying ? (
              <PauseIcon onClick={() => setIsPlaying(false)} />
            ) : (
              <PlayCircleFilledIcon onClick={() => setIsPlaying(true)} />
            )}

            <SkipNextIcon aria-label="Next" onClick={toNextTrack} />
            <RepeatIcon onClick={() => console.log("RepeatButton", "TODO")} />
          </div>

          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <div onClick={() => handleVolume(volume - 0.1)}>
              <VolumeDown />
            </div>

            <CustomSlider
              aria-label="Volume"
              value={volume}
              min={0}
              max={1}
              step={0.05}
              onChange={(e) => handleVolume(e.target.value)}
            />
            <div onClick={() => handleVolume(volume + 0.1)}>
              <VolumeUp />
            </div>
          </Stack>
        </div>
    </Box>
  );
};

export default SaveTheDate;
