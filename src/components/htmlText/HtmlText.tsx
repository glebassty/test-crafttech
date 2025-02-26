import { forwardRef } from "react";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "./HtmlText.scss";

interface HtmlTextProps {
  id: string;
  text: string;
}

const HtmlText = forwardRef<HTMLDivElement, HtmlTextProps>(
  ({ id, text }, ref) => {
    let html = "";
    try {
      const contentState = convertFromRaw(JSON.parse(text));
      html = stateToHTML(contentState);
    } catch (error) {
      console.error("Error parsing text: ", error);
    }

    return (
      <div
        id={`htmltext_${id}`}
        ref={ref}
        className="html-text-container"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          position: "fixed",
          left: "100000px",
          top: "100000px",
          whiteSpace: "nowrap",
        }}
      />
    );
  }
);

export default HtmlText;
