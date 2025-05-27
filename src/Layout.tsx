import Router from "./router";
import ThemeButton from "./components/themeButton";
import Footer from "./components/footer";
import { useCursor } from "./providers/CursorProvider";

export default function Layout() {
  const { isInPetRoute } = useCursor();



  return (
    <div style={{
      position: "absolute",
      width: "100%",
      height: "100%",
    }}>
      {!isInPetRoute && <ThemeButton />}
      <Router />
      {!isInPetRoute && <Footer />}
    </div>
  )
}