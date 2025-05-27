use tauri::{Manager, AppHandle, Emitter};
use sysinfo::System;
use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct SystemInfo {
    cpu_usage: f32,
    memory_usage: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TestEventPayload {
    data: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all();
    std::thread::sleep(std::time::Duration::from_millis(200));
    sys.refresh_cpu();
    // Calculate average CPU usage
    let cpu_usage = sys.cpus().iter()
        .map(|cpu| cpu.cpu_usage())
        .sum::<f32>() / sys.cpus().len() as f32;
    // Calculate memory usage percentage
    let total_memory = sys.total_memory() as f64;
    let used_memory = sys.used_memory() as f64;
    let memory_usage = (used_memory / total_memory) * 100.0;
    SystemInfo {
        cpu_usage,
        memory_usage,
    }
}

// Send Events From Backend to Frontend
#[tauri::command]
fn send_test_event_from_backend(app: AppHandle, data: String) -> Result<(), String> {
    // send to all windows
    app.emit("test-event", TestEventPayload { data: data.clone() })
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Send Events To Specific Window
#[tauri::command]
fn send_to_specific_window(app: AppHandle, window_label: String, data: String) -> Result<(), String> {
    app.emit_to(&window_label, "test-event", TestEventPayload { data })
        .map_err(|e| e.to_string())?;
    
    Ok(())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }        
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet, 
            get_system_info, 
            send_test_event_from_backend, 
            send_to_specific_window
        ])
        .plugin(tauri_plugin_process::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
