import { Menu, MenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu'
import { TrayIcon } from '@tauri-apps/api/tray'
import { exit } from '@tauri-apps/plugin-process'
import { resolveResource } from '@tauri-apps/api/path'
import type { TrayIconOptions } from '@tauri-apps/api/tray'
import { getAllWindows } from '@tauri-apps/api/window'


const TRAY_ID = 'PET_WINDOW_TRAY'

export function useTray() {
  const createTray = async () => {
    const tray = await getTrayById()
    if (tray) return
    const menu = await getTrayMenu()
    const icon = await resolveResource('assets/128x128.png')

    const options: TrayIconOptions = {
      menu,
      icon,
      id: TRAY_ID,
      tooltip: 'Pet on Window',
      iconAsTemplate: true,
      menuOnLeftClick: true,
    }

    return TrayIcon.new(options)
  }

  const getTrayById = () => {
    return TrayIcon.getById(TRAY_ID)
  }

  const getTrayMenu = async () => {
    const items = [
      await MenuItem.new({
        text: 'Running by CPU',
        action: async () => {

        },
      }),
      await MenuItem.new({
        text: 'Running by Music',
        action: async () => {

        },
      }),
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await MenuItem.new({
        text: 'Open Dashboard',
        action: async () => {
          const allWindows = await getAllWindows()
          const dashboard = allWindows.find(win => win.label === 'dashboard')
          if (dashboard) {
            dashboard.show()
            dashboard.setFocus()
          }
        },
      }),
      await MenuItem.new({
        text: 'Exit App',
        action: async () => {
          console.log('Exiting app')
          await exit(0)
        },
      }),
    ]

    return Menu.new({ items })
  }

  return {
    createTray,
  }
}
