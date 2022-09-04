import React from "react";

export default function CropInspector({ canvas, selected }) {
  // useEffect(()=>{})
  return (
    <div className="text-white">
      {canvas.getActiveObject() ? <div>Image</div> : <div>Select an image</div>}
    </div>
  );
}
