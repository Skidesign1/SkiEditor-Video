export const changeOpacity = (canvas, value) => {
  if (canvas.getActiveObject()) {
    canvas.getActiveObject().set({ opacity: value });
    canvas.renderAll();
  }
};

export const changeColor = (canvas, color) => {
  if (canvas.getActiveObject()) {
    let t = canvas.getActiveObject().type;
    if (t === "textbox") {
      // console.log(canvas.getActiveObject().getSelectedText());
      // itext.setSelectionStyles()
      canvas.getActiveObject().setSelectionStyles({ fill: color.hex });
    } else {
      // if (t === "i-text" || t === "triangle" || t === "circle"|| t === "rect") {
      canvas.getActiveObject().set({ fill: color.hex });
      canvas.renderAll();
      // }
    }
  }
};
