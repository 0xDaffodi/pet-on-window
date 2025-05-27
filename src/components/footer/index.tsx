import { Typography } from "antd";

export default function Footer() {
  return(
    <div 
      style={{
        position: "absolute", 
        bottom: 0, left: 0, right: 0, height: 30, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
      }}>
      <Typography.Text style={{ fontSize: 12, cursor: "pointer" }} onClick={() => {
        window.open("https://github.com/0xDaffodi", "_blank")
      }}>
        @0xDaffodi
      </Typography.Text>
    </div>
  )
}