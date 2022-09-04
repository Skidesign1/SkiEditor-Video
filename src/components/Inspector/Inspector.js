import React, { useEffect, useState } from "react";
import BgInspector from "./BgInspector";
import MediaInspector from "./MediaInspector";
import PhotosInspector from "./PhotosInspector";
import ShapeInspector from "./ShapeInspector";
import TextInspector from "./TextInspector";
import { fabric } from "fabric";
import { changeColor, changeOpacity } from "./Functions";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ChromePicker } from "react-color";
import rgbHex from "rgb-hex";

export default function Inspector({
  active,
  canvas,
  updatePast,
  cropping,
  setCropping,
  colors,
  setColors,
}) {
  const [cropRect, setCropRect] = useState(null);
  const [img, setImg] = useState("");

  const cropImage = () => {
    if (cropRect) {
      setCropping(false);
      const newImgCrop = cropRect.getBoundingRect();
      img.set({
        cropX: newImgCrop.left - img.left + img.scaleX,
        cropY: newImgCrop.top - img.top + img.scaleY,
        width: newImgCrop.width / img.scaleX,
        height: newImgCrop.height / img.scaleY,
        selectable: true,
      });
      canvas.remove(cropRect);
      canvas.renderAll();

      // const newImgCrop = cropRect.getBoundingRect()
    }
  };

  const cancelCrop = () => {
    if (cropRect) {
      setCropping(false);
      img.set({ selectable: true });
      canvas.remove(cropRect);
      canvas.renderAll();
    }
  };

  useEffect(() => {
    if (active === 6 || cropping) {
      if (canvas.getActiveObject()) {
        if (canvas.getActiveObject().type === "image") {
          setImg(canvas.getActiveObject());
          const rect = new fabric.Rect({
            height:
              canvas.getActiveObject().height * canvas.getActiveObject().scaleY,
            width:
              canvas.getActiveObject().width * canvas.getActiveObject().scaleX,
            fill: "rgb(178, 178, 178, 0.4)",
            transparentCorners: false,
            cornerColor: "rgb(178, 178, 178, 0.8)",
            strokeWidth: 1,
            cornerStrokeColor: "black",
            borderColor: "black",
            borderDashArray: [5, 5],
            cornerStyle: "circle",
            left: canvas.getActiveObject().left,
            top: canvas.getActiveObject().top,
            // scaleX: canvas.getActiveObject().scaleX,
            // scaleY: canvas.getActiveObject().scaleY,
          });
          setCropRect(rect);
          canvas.add(rect);
          canvas.getActiveObject().selectable = false;
          canvas.renderAll().setActiveObject(rect);
          setCropping(true);
        }
      }
    }
  }, [active]);

  return (
    <div
      className="inspector overflow-auto"
      style={{ height: "96vh", maxHeight: "96vh" }}
    >
      {active === 2 ? (
        <TextInspector canvas={canvas} updatePast={updatePast} />
      ) : active === 3 ? (
        <ShapeInspector canvas={canvas} updatePast={updatePast} />
      ) : active === 4 ? (
        <MediaInspector canvas={canvas} updatePast={updatePast} />
      ) : active === 5 ? (
        <PhotosInspector canvas={canvas} updatePast={updatePast} />
      ) : active === 6 ? (
        <div className="flex flex-col space-y-3 w-90 items-center mt-20 text-xs text-white">
          <div
            className="py-1 px-4 bg-purple-700 rounded cursor-pointer"
            onClick={cropImage}
          >
            Crop
          </div>
          <div
            className={`py-1 px-4 ${
              cropping ? "bg-red-500" : "bg-red-300"
            } rounded cursor-pointer`}
            onClick={cancelCrop}
          >
            Cancel
          </div>
        </div>
      ) : active === 8 ? (
        <BgInspector canvas={canvas} updatePast={updatePast} />
      ) : (
        <div>Working on it</div>
      )}

      {/* : active === 6 ? (
        <CropInspector
          canvas={canvas}
          selected={selected}
          updatePast={updatePast}
        />
      )  */}
      {(active === 2 || active === 3) && (
        <CommonTools
          colors={colors}
          updatePast={updatePast}
          canvas={canvas}
          active={active}
        />
      )}
    </div>
  );
}

const CommonTools = ({ colors, updatePast, canvas, active }) => {
  const [transparency, setTransparency] = useState(1);
  const [strokeSize, setStrokeSize] = useState(1);
  const [color, setColor] = useState("#aabbcc");
  const [strokeColor, setStrokeColor] = useState("#aabbcc");

  const changeStroke = (type, value) => {
    let activeO = canvas.getActiveObject();
    let activeS = false;
    if (activeO) {
      if (
        activeO.type === "line" ||
        activeO.type === "rect" ||
        activeO.type === "circle" ||
        activeO.type === "triangle" ||
        activeO.type === "path" ||
        activeO.type === "polygon"
      )
        activeS = true;
    }
    if (type === "sz") {
      let szval = 0;
      if (value === "min" && strokeSize > 0) szval = -1;
      else if (value === "max" && strokeSize < 40) szval = 1;
      setStrokeSize(strokeSize + szval);
      if (activeS) {
        activeO.set({ strokeWidth: strokeSize + szval });
        canvas.renderAll();
      }
    }

    if (type === "cl") {
      setStrokeColor(
        "#" + rgbHex(value.rgb.r, value.rgb.g, value.rgb.b, value.rgb.a)
      );
      if (activeS) {
        activeO.set({
          stroke:
            "#" + rgbHex(value.rgb.r, value.rgb.g, value.rgb.b, value.rgb.a),
        });
        canvas.renderAll();
      }
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      {/* Common */}
      {/* <div className="text-lg font-bold mt-6 underline ">Edit Shape</div> */}
      <div className="text-lg font-bold mt-6 underline text-white">Edit</div>
      <div className="bg-white mt-5 flex text-black p-2 space-x-3 w-56 text-xs rounded-sm">
        <div>Transparency</div>
        <div className="w-24 mt-1">
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={transparency}
            onChange={(value) => (
              setTransparency(value), changeOpacity(canvas, value)
            )}
            trackStyle={{ backgroundColor: "#911AC5", height: "2px" }}
            railStyle={{ height: "2px" }}
            handleStyle={{ border: "1px solid #7B7B7B" }}
          />
        </div>
        <div className="border rounded-sm px-1.5">{transparency}</div>
      </div>
      {/* <div className="text-md font-bold mt-6">Colors</div> */}

      <div className="relative z-20 pb-10 mt-4 w-56">
        <ChromePicker
          color={color}
          onChange={(c) => (
            changeColor(canvas, {
              hex: "#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a),
            }),
            setColor("#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a))
          )}
        />
        <div className="colors flex flex-wrap space-x-3 bg-white rounded-sm px-3 py-3 mt-2 w-full">
          {colors.map((clr, i) => (
            <div
              key={i}
              style={{ backgroundColor: clr }}
              className="w-2 h-2 p-2 rounded-sm cursor-pointer mt-3"
              onClick={() => (
                updatePast(canvas),
                setColor(clr),
                changeColor(canvas, { hex: clr })
              )}
            ></div>
          ))}
        </div>
      </div>
      {/* Common */}
      {/** For Shapes */}
      {active === 3 && (
        <div className="text-md font-bold mtmd underline text-white">
          Stroke
        </div>
      )}
      {active === 3 && (
        <div className="bg-white mt-5 flex text-black py-2 px-4 space-x-3 w-48 text-xs rounded-sm">
          <div className="pt-3.5 font-bold">Width:</div>
          <div className="flex items-center text-xs w-24 mt-1">
            <div
              className="px-3 border border-r-gray-500 py-2 rounded-l-sm cursor-pointer"
              onClick={() => changeStroke("sz", "min")}
            >
              -
            </div>
            <div className="px-3 border border-r-gray-500 py-2">
              {strokeSize}
            </div>
            <div
              className="px-3 border border-r-gray-500 py-2 rounded-r-sm cursor-pointer"
              onClick={() => changeStroke("sz", "max")}
            >
              +
            </div>
          </div>
        </div>
      )}
      {active === 3 && (
        <div className="relative z-20 pb-10 mt-4 w-56">
          <ChromePicker
            color={strokeColor}
            onChange={(c) => changeStroke("cl", c)}
          />
        </div>
      )}
    </div>
  );
};
