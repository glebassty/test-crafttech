import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Rect } from "react-konva";
import { Html } from "react-konva-utils";
import HtmlText from "../htmlText/HtmlText";
import "./Shape.scss";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import html2canvas from "html2canvas";
import Konva from "konva";

interface ShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  tool: "cursor" | "shape";
  id: string;
  text: string;
  stageRef: React.RefObject<Konva.Stage>;
}

const Shape = ({ x, y, width, height, tool, id, text }: ShapeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editorState, setEditorState] = useState(() => {
    try {
      return text
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(text)))
        : EditorState.createWithContent(ContentState.createFromText(""));
    } catch (error) {
      console.error("Invalid JSON format in text: ", error);
      return EditorState.createWithContent(ContentState.createFromText(""));
    }
  });

  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  const renderImage = useCallback(async () => {
    const htmltext = document.getElementById(`htmltext_${id}`);
    if (htmltext) {
      const canvas = await html2canvas(htmltext, {
        backgroundColor: "rgba(0,0,0,0)",
      });
      const image = new window.Image();
      image.src = canvas.toDataURL();
      image.onload = () => {
        if (groupRef.current) {
          const shape = new Konva.Image({
            x: 0,
            y: height / 2,
            scaleX: 1 / window.devicePixelRatio,
            scaleY: 1 / window.devicePixelRatio,
            image: image,
          });
          groupRef.current.add(shape);
          imageRef.current = shape;
        }
      };
    }
  }, [id, height]);

  useEffect(() => {
    if (!isEditing) {
      renderImage();
    }
  }, [isEditing, renderImage]);

  const handleClick = () => {
    if (tool === "shape") return;
    setIsEditing((prev) => !prev);
    if (imageRef.current) {
      if (isEditing) {
        imageRef.current.show();
      } else {
        imageRef.current.hide();
      }
    }
  };

  return (
    <>
      <Group x={x} y={y} onClick={handleClick} ref={groupRef} draggable>
        <Rect stroke={"black"} width={width} height={height} />
        {isEditing && (
          <Html>
            <div ref={editorWrapperRef}>
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbar={{
                  options: ["inline", "fontSize", "fontFamily", "colorPicker"],
                }}
              />
            </div>
          </Html>
        )}
      </Group>
      <Html>
        <HtmlText
          id={id}
          text={JSON.stringify(convertToRaw(editorState.getCurrentContent()))}
        />
      </Html>
    </>
  );
};

export default Shape;
