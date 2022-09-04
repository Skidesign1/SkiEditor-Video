import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ChromePicker } from "react-color";
import { HiDotsHorizontal } from "react-icons/hi";
import { fabric } from "fabric";
import rgbHex from "rgb-hex";

export default function BgInspector({ canvas, updatePast }) {
  const [color, setColor] = useState("white");
  const [transparency, setTransparency] = useState(1);
  const [localImgs, setLocalImgs] = useState([]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      let temp = [...localImgs];
      temp.push({ id: Math.random(1, 10000), url: URL.createObjectURL(img) });
      setLocalImgs(temp);
    }
  };

  const changeProperties = (color, img, transparency) => {
    updatePast(canvas);
    if (color) {
      setColor(color.hex);
      canvas.set({ backgroundColor: color.hex, backgroundImage: null });
      canvas.renderAll();
    }
    if (img) {
      fabric.Image.fromURL(img.url, function (myImg) {
        canvas.set({ backgroundImage: myImg });
        canvas.renderAll();
      });
    }
    if (transparency) {
      setTransparency(transparency);
      canvas.set({ opacity: transparency });
    }
  };

  useEffect(() => {
    setColor(canvas.backgroundColor);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center pt-4 text-white relative inspector">
      <div className="text-lg font-bold underline">Edit Background</div>
      <div className="bg-gray-900 py-2 px-3 mt-2 rounded w-90 text-sm">
        <div className="py-1.5 px-4 bg-purple-700 rounded my-1 flex relative text-xs">
          <div className="text-center w-4/5">
            <label className="cursor-pointer">
              <input type="file" name="custom-img" onChange={onImageChange} />
              Upload media
            </label>
          </div>
          <span className="border-div"></span>
          <div className="absolute right-5 top-2.5">
            <HiDotsHorizontal />
          </div>
        </div>
        <div className="flex flex-wrap mt-6 pb-3 items-center justify-center">
          {localImgs.length > 0 &&
            localImgs.map((img) => (
              <div
                className="cursor-pointer mt-3 px-2"
                key={img.id}
                onClick={() => changeProperties(null, img, null)}
              >
                <img className="media-img" src={img.url} />
              </div>
            ))}
        </div>
      </div>
      <hr className="mt-1" />
      {/* <div className="text-md font-bold underline mt-1">Edit</div> */}
      <div className="bg-white mt-5 flex text-black p-2 space-x-2 w-90 text-xs mt-2">
        <div>Transparency</div>
        <div className="w-28 mt-1">
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={transparency}
            onChange={(value) => changeProperties(null, null, value)}
            trackStyle={{ backgroundColor: "#911AC5", height: "2px" }}
            railStyle={{ height: "2px" }}
            handleStyle={{ border: "1px solid #7B7B7B" }}
          />
        </div>
        <div className="border rounded-sm px-1">{transparency}</div>
      </div>
      <ChromePicker
        color={color}
        onChange={(c) =>
          changeProperties(
            { hex: "#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a) },
            null,
            null
          )
        }
        className="mt-3"
      />
    </div>
  );
}
