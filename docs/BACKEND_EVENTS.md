# Tauri Events Between Frontend & Backend

Here is the guide for sending events between frontend and backend in TauriV2.

## 🚀 Basic Function

### 1. Send Events To All Windows
```rust
#[tauri::command]
fn send_test_event_from_backend(app: AppHandle, data: String) -> Result<(), String> {
    // send to all windows
    app.emit("test-event", TestEventPayload { data: data.clone() })
        .map_err(|e| e.to_string())?;
    Ok(())
}
```

### 2. Send Events To Specific Window
```rust
#[tauri::command]
fn send_to_specific_window(app: AppHandle, window_label: String, data: String) -> Result<(), String> {
    app.emit_to(&window_label, "test-event", TestEventPayload { data })
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
```

### 3. Send Events Periodically (Background Thread)
```rust
fn start_periodic_event_sender(app: AppHandle) {    
    thread::spawn(move || {
        loop {
            thread::sleep(Duration::from_secs(10)); // Every 10 sec
            
            if let Err(e) = app.emit("test-event", TestEventPayload { data: data.clone() }) {
                eprintln!("Send periodic event failed: {}", e);
            } else {
                println!("Send periodic event: {}", data);
            }            
        }
    });
}
```

## 📱 Listen Events From Backend

Listen events from backend in frontend:

```typescript
import { listen } from "@tauri-apps/api/event";
import { EVENTS } from "../../constants/event";

useEffect(() => {
  const unlistenBackend = listen(EVENTS.TEST_EVENT, (event) => {
    console.log('Received from backend:', event.payload);
    if (event.payload && typeof event.payload === 'object' && 'data' in event.payload) {
      const data = (event.payload as { data: string }).data;
      console.log('Received data:', data);
    }
  });

  // Remove listener when component unmounts
  return () => {
    unlistenBackend.then(fn => fn());
  };
}, []);
```

## 🔧 Call Backend Commands From Frontend

```typescript
import { invoke } from "@tauri-apps/api/core";

// Call backend command to send event to all windows
const sendEventFromBackend = async () => {
  const data = 'test data';
  
  try {
    await invoke('send_test_event_from_backend', { data });
    console.log('Send event to all windows successfully');
  } catch (error) {
    console.error('Send event to all windows failed:', error);
  }
};

// Call backend command to send event to specific window
const sendEventToMainWindow = async () => {
  const data = 'test data';
  
  try {
    await invoke('send_to_specific_window', { 
      windowLabel: 'main', 
      data
    });
    console.log('Send event to main window successfully');
  } catch (error) {
    console.error('Send event to main window failed:', error);
  }
};
```

## 🎯 Key Points

### Rust Backend Part:
1. **Import necessary traits**: `use tauri::{Manager, AppHandle, Emitter};`
2. **Event data structure**: Use `#[derive(Serialize, Deserialize, Clone)]`
3. **AppHandle**: Use `AppHandle` parameter in command to get app handle
4. **Send methods**:
   - `app.emit(event_name, payload)` - Send to all windows
   - `app.emit_to(target, event_name, payload)` - 发送到特定目标

### Frontend Part:
1. **Listen events**: Use `listen()` function to listen events
2. **Clean up listeners**: Call `unlisten()` function when component unmounts
3. **Call backend commands**: Use `invoke()` function to call backend commands
4. **Type safety**: Use TypeScript type checking to ensure event data is correct

## 📚 Related Documents

- [Tauri Event System Official Documentation](https://tauri.app/zh-cn/reference/javascript/api/namespaceevent/)
- [Tauri Command System Documentation](https://tauri.app/develop/calling-rust/)