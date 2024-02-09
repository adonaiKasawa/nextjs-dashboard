"use client"
import React, { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic'
import { OnProgressProps } from "react-player/base";
import { Slider } from "@nextui-org/slider";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { IoPlaySkipForwardOutline, IoPlaySkipBackOutline } from "react-icons/io5";
import { CiPlay1, CiPause1 } from "react-icons/ci";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
export default function Page() {
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [muted, setMuted] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [pip, setPip] = useState<boolean>(false);
  const play: any = useRef();
  // pip: false,
  // playing: true,
  // controls: false,
  // light: false,
  // volume: 0.8,
  // muted: false,
  // played: 0,
  // loaded: 0,
  // duration: 0,
  // playbackRate: 1.0,
  // loop: false
  useEffect(() => {

  });

  const handlerDuration = (duration: number) => {
    setDuration(duration)
  }

  const handlerProgress = (state: OnProgressProps) => {
    setProgress(state.playedSeconds)
  }
  const handlerPlay = () => {
    if (playing) {
      play?.current?.pause()
    } else {
      play?.current?.play()
    }
    setPlaying(!playing)
  }

  return <div className="grid grid-cols-12 gap-4">
    <div className="col-span-8 video-player-layout">
      <div className="video-player-viewer">
        <ReactPlayer
          className=''
          autoPlays
          width={"auto"}
          height={"auto"}
          // url={`https://d31uetu06bkcms.cloudfront.net/videos/ecclesia-videos-8b770203-c63a-4b92-9faf-1fed95150cb9.mp4`}
          url={"/vdo.mp4"}
          onDuration={handlerDuration}
          onProgress={handlerProgress}
          playing={playing}
          onPlay={() => { }}
          onError={(e) => {
            console.log(e);
          }}
          config={{
            file: {
              hlsOptions: {

              }
            }
          }}
        />
      </div>

      <div className="w-full max-w-full video-player-description">
        <div
          className="w-full video-player-description-img-blur1"
          style={{
            background: "url(https://d31uetu06bkcms.cloudfront.net/photo/ecclesia-photo-f486004c-0206-4f82-a218-a8a87fe954c8.png), lightgray 0% 0% / 154.22531366348267px 154.22531366348267px repeat, radial-gradient(151.92% 127.02% at 15.32% 21.04%, rgba(165, 239, 255, 0.20) 0%, rgba(110, 191, 244, 0.04) 77.08%, rgba(70, 144, 212, 0.00) 100%)"
          }}
        >
          <div className="w-full grid grid-cols-3">
            <div className="video-player-description-frame-content-1">
              <p>Titre</p>
              <p>eglise</p>
            </div>
            <div className="col-span-2 px-4 video-player-description-frame-content-2">
              <div className="video-player-controler-action gap-3">
                <div className="flex">
                  <IoPlaySkipBackOutline size={40} color={"white"} />

                  <span className="p-1 rounded-full bg-white justify-center items-center">
                    {playing ?
                      <CiPause1 onClick={() => { handlerPlay() }} size={40} />
                      :
                      <CiPlay1 onClick={() => { handlerPlay() }} size={40} className="" />
                    }
                  </span>
                  <IoPlaySkipForwardOutline size={40} color={"white"} />
                </div>
                <div className="flex justify-between gap-3">
                  <button>parm</button>
                  <button>vol</button>
                  <button>menu</button>
                  <button>like</button>
                  <button>comment</button>
                </div>
              </div>
              <div className="w-full gap-4  video-player-controler-timer-slider">
                <Duration seconds={duration} />
                <Slider
                  size="sm"
                  defaultValue={40}
                  classNames={{
                    base: "max-w-md",
                    trackWrapper: "w-full",
                    track: "border-s-primary-200",
                    filler: "w-full bg-gradient-to-l from-primary-100 to-primary-200",
                    thumb: "transition-transform shadow-small bg-background rounded-full w-2 h-2 block group-data-[dragging=true]:scale-50"
                  }}
                />
                <Duration seconds={progress} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full video-player-blur">
        {/* <video ref={play} className="video-player-blur" muted={true} src="https://d31uetu06bkcms.cloudfront.net/videos/ecclesia-videos-8b770203-c63a-4b92-9faf-1fed95150cb9.mp4" autoPlay /> */}
        <video ref={play} className="video-player-blur" muted={true} src="/vdo.mp4" />
      </div>
    </div>
    <div className="col-span-4 bg-blue-700">
      <h1>liste</h1>
    </div>
  </div>

}

function Duration({ className, seconds }: { className?: string | undefined, seconds: number }) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  )
}

function format(seconds: number) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${pad(mm)}:${ss}`
}

function pad(string: any) {
  return ('0' + string).slice(-2)
}