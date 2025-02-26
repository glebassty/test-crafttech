import { useRef, useState } from "react";
import "./App.scss";
import Canvas from "./components/canvas/Canvas";
import Control from "./components/control/Control";
import Konva from "konva";

function App() {
  const [tool, setTool] = useState<"cursor" | "shape">("cursor");
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <>
      <Canvas tool={tool} stageRef={stageRef} />
      <Control tool={tool} setTool={setTool} />
    </>
  );
}

export default App;
