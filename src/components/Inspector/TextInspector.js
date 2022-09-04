import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import {
  AiOutlineAlignRight,
  AiOutlineUnderline,
  AiOutlineAlignLeft,
} from "react-icons/ai";
import { BsTypeBold } from "react-icons/bs";
import { AiOutlineItalic } from "react-icons/ai";
import { AiOutlineAlignCenter } from "react-icons/ai";
import { fabric } from "fabric";
import WebFont from "webfontloader";

const tempKey = "AIzaSyA2OfaAMz8ceRCKk1nTdfg6asRko26NLV8";

export default function TextInspector({ canvas, updatePast }) {
  const [activeFontFamily, setActiveFontFamily] = useState("Open Sans");
  const [fontFamilies, setFontFamilies] = useState([]);
  const [fontSize, setFontSize] = useState(20);
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  // const [colors, setColors] = useState(["#8ff2ab", "#e66e19", "#ff543d"]);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 35,
      minHeight: 35,
    }),
  };

  const addText = (size, weight, name, type) => {
    updatePast(canvas);
    let text;
    if (type) text = `Add ${type}`;
    else
      text =
        name === "title"
          ? "Add Title"
          : name === "subt"
          ? "Add Subtitle"
          : "Add Description";

    const itext = new fabric.Textbox(text, {
      left: 0,
      top: 0,
      fontFamily: "Poppins",
      fontSize: size,
      fontWeight: weight,
      fontStyle: "normal",
      fill: "black",
      opacity: 1,
      textDecoration: "none",
      transparentCorners: false,
      cornerColor: "#5cffc3",
      strokeWidth: 2,
      cornerStrokeColor: "#a3ffe3",
      borderColor: "#a3ffe3",
      cornerStyle: "circle",
      name: name,
      width: name === "title" ? 120 : 100,
      category: type ? type : "none",
    });
    itext.onSelect(setFontSize(itext.fontSize));

    let changed_v = "";
    itext.on("changed", () => {
      if (itext.name === "title") {
        if (itext.text.split(" ").length > 20) itext.set({ text: changed_v });
        else changed_v = itext.text;
      }

      if (itext.name === "body") {
        if (itext.text.split(" ").length > 40) itext.set({ text: changed_v });
        else changed_v = itext.text;
      }
    });
    canvas.add(itext);
    canvas.centerObject(itext);
    canvas.renderAll().setActiveObject(itext);
  };

  const changeWeight = () => {
    if (canvas.getActiveObject()) {
      updatePast(canvas);
      if (!bold === true) {
        if (canvas.getActiveObject().getSelectedText())
          canvas.getActiveObject().setSelectionStyles({ fontWeight: "bold" });
        else canvas.getActiveObject().set({ fontWeight: "bold" });
      } else {
        if (canvas.getActiveObject().getSelectedText())
          canvas.getActiveObject().setSelectionStyles({ fontWeight: "normal" });
        else canvas.getActiveObject().set({ fontWeight: "normal" });
      }
      canvas.renderAll();
    }
    setBold(!bold);
  };

  const changeStyle = () => {
    if (canvas.getActiveObject()) {
      updatePast(canvas);
      if (!italic === true) {
        if (canvas.getActiveObject().getSelectedText())
          canvas.getActiveObject().setSelectionStyles({ fontStyle: "italic" });
        else canvas.getActiveObject().set({ fontStyle: "italic" });
      } else {
        if (canvas.getActiveObject().getSelectedText())
          canvas.getActiveObject().setSelectionStyles({ fontStyle: "normal" });
        else canvas.getActiveObject().set({ fontStyle: "normal" });
      }
      canvas.renderAll();
    }
    setItalic(!italic);
  };

  const changeUnderline = () => {
    if (canvas.getActiveObject()) {
      updatePast(canvas);
      if (canvas.getActiveObject().getSelectedText())
        canvas.getActiveObject().setSelectionStyles({ underline: !underline });
      else canvas.getActiveObject().set({ underline: !underline });
      canvas.renderAll();
    }
    setUnderline(!underline);
  };

  const changeFontSize = (op) => {
    updatePast(canvas);
    if (canvas.getActiveObject()) {
      if (canvas.getActiveObject().type !== "textbox") return;
      let newSize = op === "min" ? fontSize - 1 : fontSize + 1;
      if (canvas.getActiveObject().getSelectedText())
        canvas.getActiveObject().setSelectionStyles({ fontSize: newSize });
      else canvas.getActiveObject().set({ fontSize: newSize });
      canvas.renderAll();
      setFontSize(newSize);
    }
  };

  const alignText = (loc) => {
    updatePast(canvas);
    if (canvas.getActiveObject()) {
      if (canvas.getActiveObject().type !== "textbox") return;
      canvas.getActiveObject().set({ textAlign: loc });
      canvas.renderAll();
    }
  };

  useEffect(() => {
    if (Object.keys(canvas).length < 1) return;
    if (canvas.getActiveObject()) {
      if (canvas.getActiveObject().type !== "textbox") return;
      canvas.getActiveObject().set({ fontFamily: activeFontFamily.value });
      canvas.renderAll();
    }
  }, [activeFontFamily]);
  useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${tempKey}&sort=POPULARITY&$.xgafv=1`
      )
      .then((res) => {
        let temp = res.data.items.slice(1, 60 + 1);
        temp = temp.map((t) => {
          return {
            value: t.family,
            label: t.family,
          };
        });

        WebFont.load({
          google: {
            families: temp.map((t) => t.value),
          },
        });
        setFontFamilies(temp);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center pt-4 text-white relative">
      <div className="text-lg font-bold underline">Edit Text</div>
      <div className="bg-gray-900 py-2 px-3 mt-2 rounded w-90  ">
        <div style={{ fontFamily: "Nunito" }}>Click text to add to page</div>
        <div
          className="py-1 px-4 bg-gray-700 font-bold text-xl rounded my-1 cursor-pointer"
          onClick={() => addText(25, "bold", "title", "title")}
        >
          Add a heading
        </div>
        {/* <div
          className="py-1 px-4 bg-gray-700 text-sm my-2 rounded cursor-pointer"
          onClick={() => addText(20, "normal", "subt")}
        >
          Add a subheading
        </div> */}
        <div
          className="py-1.5 px-4 bg-gray-700 text-sm my-2 rounded cursor-pointer"
          onClick={() => addText(15, "normal", "body")}
        >
          Add a little bit of body text
        </div>
        <div
          className="py-1 px-4 bg-gray-700 text-xs my-2 rounded cursor-pointer"
          onClick={() => addText(15, "normal", "body", "website")}
        >
          Add Website
        </div>
        <div
          className="py-1 px-4 bg-gray-700 text-xs my-2 rounded cursor-pointer"
          onClick={() => addText(15, "normal", "body", "phone")}
        >
          Add Phone Number
        </div>
        <div
          className="py-1 px-4 bg-gray-700 text-xs my-2 rounded cursor-pointer"
          onClick={() => addText(15, "normal", "body", "email")}
        >
          Add Email
        </div>
      </div>

      <div className="text-lg font-bold mt-6 underline ">Edit Font</div>
      <div className="bg-white mt-5 text-black flex space-x-4 p-2 w-90">
        <Select
          options={fontFamilies}
          onChange={setActiveFontFamily}
          className="text-xs"
          styles={customStyles}
        />
        <div className="flex items-center text-xs">
          <div
            className="px-3 border border-r-gray-500 py-2 rounded-l-sm cursor-pointer"
            onClick={() => changeFontSize("min")}
          >
            -
          </div>
          <div className="px-3 border border-r-gray-500 py-2">{fontSize}</div>
          <div
            className="px-3 border border-r-gray-500 py-2 rounded-r-sm cursor-pointer"
            onClick={() => changeFontSize("add")}
          >
            +
          </div>
        </div>
      </div>
      <div className="bg-white mt-5 flex text-black p-2 space-x-2 w-90">
        {/* <AiOutlineFontColors
          size={22}
          className={`rounded-sm px-0.5`}
          onClick={() => setShowPicker(!showPicker)}
          // color={color}
        /> */}
        <BsTypeBold
          size={22}
          className={`${bold ? "bg-gray-200" : ""} rounded-sm px-0.5`}
          onClick={changeWeight}
        />
        <AiOutlineItalic
          size={22}
          className={`${italic ? "bg-gray-200" : ""} rounded-sm px-0.5`}
          onClick={changeStyle}
        />
        <AiOutlineUnderline
          size={22}
          className={`${underline ? "bg-gray-200" : ""} rounded-sm px-0.5`}
          onClick={changeUnderline}
        />
        <div className="border-div"></div>
        <AiOutlineAlignCenter
          size={22}
          className={`rounded-sm px-0.5 cursor-pointer`}
          onClick={() => alignText("center")}
        />
        <div className="border-div"></div>
        <AiOutlineAlignLeft
          size={22}
          className={`rounded-sm px-0.5 cursor-pointer`}
          onClick={() => alignText("left")}
        />
        <div className="border-div"></div>
        <AiOutlineAlignRight
          size={22}
          className={`rounded-sm px-0.5 cursor-pointer`}
          onClick={() => alignText("right")}
        />
        <div className="border-div"></div>
      </div>

      {/* {showPicker && (
        <div
          className="absolute left-3.5 -bottom-40 z-20 pb-10"
          tabIndex={-1}
          onBlur={() => setShowPicker(false)}
        >
          <ChromePicker
            color={color}
            onChange={(color) => (
              updatePast(canvas),
              setColor(color.hex),
              changeColor(canvas, color)
            )}
          />
          <div className="colors flex space-x-3 bg-white rounded px-3 py-3 mt-2">
            {colors.map((clr, i) => (
              <div
                key={i}
                style={{ backgroundColor: clr }}
                className="w-2 h-2 p-2 rounded-sm cursor-pointer"
                onClick={() => (
                  updatePast(canvas),
                  setColor(clr),
                  changeColor(canvas, { hex: clr })
                )}
              ></div>
            ))}
          </div>
        </div>
      )} */}

      {/* <div className="bg-white mt-5 flex text-black p-2 space-x-2 w-90 text-xs">
        <div>Transparency</div>
        <div className="w-28 mt-1">
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={transparency}
            onChange={(value) => (
              updatePast(canvas),
              setTransparency(value),
              changeOpacity(canvas, value)
            )}
            trackStyle={{ backgroundColor: "#911AC5", height: "2px" }}
            railStyle={{ height: "2px" }}
            handleStyle={{ border: "1px solid #7B7B7B" }}
          />
        </div>
        <div className="border rounded-sm px-1">{transparency}</div>
      </div> */}
    </div>
  );
}
