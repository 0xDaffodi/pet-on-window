import { Button } from "antd"
import { useState } from "react"
import { SunOutlined, MoonOutlined } from "@ant-design/icons"


export default function ThemeButton() {
  const [theme, setTheme] = useState<"light" | "dark">("light")


  const toggleTheme = () => {
    const newTheme = document.documentElement.getAttribute('data-prefers-color-scheme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-prefers-color-scheme', newTheme);
    setTheme(newTheme);
  }

  return (
    <Button 
      type="text"
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
        color: "var(--text-color)",
      }}
      onClick={toggleTheme}
    >
      {theme === 'light' ? <SunOutlined /> : <MoonOutlined />}
    </Button>
  )
}