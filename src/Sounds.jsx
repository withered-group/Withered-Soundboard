import { useState } from "react";
import { invoke } from '@tauri-apps/api/tauri';
import { convertFileSrc } from '@tauri-apps/api/tauri';

import iconClose from './assets/icons/window/close.svg';

export default function Sounds({sounds, setSounds, paused, muted, playing, setPlaying}) {
  
  function loadSounds() {
    
  }
  
  return (
    <div className={"sounds"+(paused?'':' playing')}>
      {sounds.map((data, index)=> (<Sound key={index} data={data} muted={muted} playing={playing} setPlaying={setPlaying} />))}
    </div>
  );
}

function Sound({data, muted, playing, setPlaying}) {
  const [isPlaying, setIsPlaying] = useState(false);
  function playSound() {
    console.log(muted, data.path)
    let audio = new Audio();
    audio.currentTime = 0;
    if (muted) audio.volume = 0;
    console.log(data.path, convertFileSrc(data.path))
    audio.src = convertFileSrc(data.path);
    audio.play();
    setPlaying([...playing, audio]);
    setIsPlaying(true);
    let interval = setInterval(()=>{
      if (audio.currentTime >= audio.duration) {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 1000);
  }
  
  return (<div className={"btn sound"+(isPlaying?' playing':'')} onClick={()=>{playSound()}}>
    <div className="sound-top"><div></div><button className="btn icon"><img src={iconClose} /></button></div>
    <p className="emoji">{data.emoji}</p>
    <p className="name">{data.name}</p>
  </div>);
}