// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use window_shadows::set_shadow;
use tauri::{SystemTray, CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent};

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

fn main() {
    let mi_pause = CustomMenuItem::new("pause".to_string(), "Pause/Unpause");
    let mi_mute = CustomMenuItem::new("mute".to_string(), "Mute/Unmute for me");
    let mi_showhide = CustomMenuItem::new("showhide".to_string(), "Show/Hide");
    let mi_quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(mi_pause)
        .add_item(mi_mute)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(mi_showhide)
        .add_item(mi_quit);
    let tray = SystemTray::new().with_menu(tray_menu);
    
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![play_sound])
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.set_focus();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "pause" => {
                        app.emit_all("trayPause", Payload { message: "Pause clicked".into() }).unwrap();
                    }
                    "mute" => {
                        app.emit_all("trayMute", Payload { message: "Mute clicked".into() }).unwrap();
                    }
                    "showhide" => {
                        let window = app.get_window("main").unwrap();
                        match window.is_visible().expect("winvis") {
                            true => {
                                window.hide().unwrap();
                            }
                            false => {
                                window.show().unwrap();
                                window.set_focus();
                            }
                        }
                    }
                    "quit" => {
                        std::process::exit(0);
                    }
                     _ => {}
                }
            }
             _ => {}
        })
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let _ = set_shadow(&window, true).expect("Unsupported platform!");
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn play_sound(path: String) {
    
}