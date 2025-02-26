import { useState } from "react";
import { Layer, Stage } from "react-konva";
import Shape from "../shape/Shape";
import "./Canvas.scss";
import Konva from "konva";

interface Figure {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  color?: string;
  text: string;
}

interface CanvasProps {
  tool: "cursor" | "shape";
  stageRef: React.RefObject<Konva.Stage>;
}

const Canvas = ({ tool, stageRef }: CanvasProps) => {
  const [figures, setFigures] = useState<Figure[]>([
    {
      id: "1",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      type: "rect",
      color: "red",
      text: "Hello",
    },
  ]);

  const handleOnClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === "cursor") return;
    const stage = e.target.getStage();
    if (!stage) return;
    const stageOffset = stage.absolutePosition();
    const point = stage.getPointerPosition();
    if (!point) return;

    setFigures((prev) => [
      ...prev,
      {
        id: Date.now().toString(36),
        width: 100,
        height: 100,
        type: "rect",
        x: point.x - stageOffset.x,
        y: point.y - stageOffset.y,
        text: "",
      },
    ]);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={tool === "cursor"}
      onClick={handleOnClick}
      ref={stageRef}
    >
      <Layer>
        {figures.map((figure) => (
          <Shape key={figure.id} {...figure} tool={tool} stageRef={stageRef} />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
