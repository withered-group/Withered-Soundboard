import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom/client";
import Sounds from "./Sounds";

import './assets/css/window.css';
import './assets/css/global.css';

import logo from './assets/media/logo.svg';

import iconPause from './assets/icons/pause.svg';
import iconPlay from './assets/icons/play.svg';
import iconVolumeMute from './assets/icons/volumeMute.svg';
import iconVolumeFull from './assets/icons/volumeFull.svg';
import iconSearch from './assets/icons/search.svg';
import iconAdd from './assets/icons/add.svg';
import iconUpload from './assets/icons/upload.svg';

import iconMinimize from './assets/icons/window/minimize.svg';
import iconRestore from './assets/icons/window/restore.svg';
import iconMaximize from './assets/icons/window/maximize.svg';
import iconClose from './assets/icons/window/close.svg';

import { appWindow } from '@tauri-apps/api/window';
import { open, save } from "@tauri-apps/api/dialog";
import { listen } from '@tauri-apps/api/event';

import { uploadFile, closePopup, finishPopup } from './assets/js/popup.js';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


function App() {
  const listened = useRef({pause: false, mute: false});
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [sounds, setSounds] = useState([]);
  const [playing, setPlaying] = useState([]);
  const [maximized, setMaximized] = useState(false);
  
  async function add() {
    let path = await open();
    console.log(path);
    let fna = path.split('\\');
    let fn = fna[fna.length-1];
    let fnm = fn.length>23?fn.substring(0,20)+'...':fn;
    setSounds([...sounds, {emoji: ':)', name: fnm, path: path}]);
  }
  
  listen('trayPause', ()=>{
    if (listened.current.pause === true) return;
    listened.current.pause = true;
    console.log('p 1')
    togglePause();
  });
  listen('trayMute', ()=>{
    if (listened.current.mute === true) return;
    listened.current.mute = true;
    console.log('m 1')
    toggleMute();
  });
  
  function toggleMute() {
    console.log('m 2', muted)
    if (muted === false) {
      // muted is being toggled from false to true
      for (let i=0; i<playing.length; i++) {
        console.log(playing)
        playing[i].volume = 0;
      }
    } else {
      // muted is being toggled from true to false
      for (let i=0; i<playing.length; i++) {
        console.log(playing)
        playing[i].volume = 1;
      }
    }
    setPlaying(playing);
    setMuted(!muted);
  }
  
  function togglePause() {
    console.log('p 2', paused)
    if (paused === false) {
      // paused is being toggled from false to true
      for (let i=0; i<playing.length; i++) {
        playing[i].pause();
      }
    } else {
      // paused is being toggled from true to false
      for (let i=0; i<playing.length; i++) {
        playing[i].play();
      }
    }
    setPaused(!paused);
  }
  
  return (<>
    <div className="top-wrapper">
      <div className="top" data-tauri-drag-region>
        <div className="section logo"><img src={logo} /></div>
        <div className="section actions">
          <button title="Pause" className="button icon small" onClick={()=>{togglePause()}}><img src={paused ? iconPlay : iconPause} /></button>
          <button title="Mute for me" className="button icon small" onClick={()=>{toggleMute()}}><img src={muted ? iconVolumeMute : iconVolumeFull} /></button>
          <div className="input icon extend extend-large search"><img src={iconSearch} /><input type="text" placeholder="Search" /></div>
          <button title="Add to soundboard" className="button icon small" onClick={()=>{add()}}><img src={iconAdd} /></button>
        </div>
        <div className="section windowbtns">
          <button title="Minimize" className="btn icon" onClick={()=>{appWindow.minimize()}}><img src={iconMinimize} /></button>
          <button title={maximized?'Restore':'Maximize'} className="btn icon" onClick={()=>{appWindow.toggleMaximize(); setMaximized(!maximized);}}>{ maximized===true ? <img src={iconRestore} /> : <img src={iconMaximize} /> }</button>
          <button title="Close" className="btn icon" onClick={()=>{appWindow.hide()}}><img src={iconClose} /></button>
        </div>
      </div>
      <div className="fade">
      </div>
    </div>
    <div className="content">
      <Sounds paused={paused} muted={muted} sounds={sounds} playing={playing} setPlaying={setPlaying} />
    </div>
    <div className="popup-wrapper" id="popup">
      <div className="popup">
        <p className="title">Popup title...</p>
        <div className="popup-content"></div>
        <div className="popup-actions">
          <button className="button small" onClick={()=>{closePopup()}}>Cancel</button>
          <button className="button small primary" onClick={()=>{finishPopup()}}>Finish</button>
        </div>
      </div>
    </div>
  </>);
}
