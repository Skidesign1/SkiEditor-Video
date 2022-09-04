import React, { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import {
  IoStarSharp,
  IoStarOutline,
  IoHeartOutline,
  IoHeartSharp,
} from "react-icons/io5";
import {
  BsFillPentagonFill,
  BsHeptagonFill,
  BsOctagonFill,
  BsPentagon,
  BsHeptagon,
  BsOctagon,
} from "react-icons/bs";
import { GiSevenPointedStar } from "react-icons/gi";
import { fabric } from "fabric";

export default function ShapeInspector({ canvas, updatePast }) {
  const [chooseLevel, setChooseLevel] = useState(false);
  const [elmt, setElmnt] = useState("");

  const addLine = (level) => {
    let line = new fabric.Line([50, 200, 200, 200], {
      stroke: "#000",
      transparentCorners: false,
      cornerColor: "#5cffc3",
      strokeWidth: 1,
      cornerStrokeColor: "#a3ffe3",
      cornerStyle: "circle",
      level: level,
    });

    if (elmt === "lined") {
      line.set({ borderColor: "#000", borderDashArray: [5, 5] });
    }

    canvas.add(line);
    canvas.centerObject(line);
    canvas.renderAll().setActiveObject(line);
  };

  const addRect = (level) => {
    updatePast(canvas);
    const rect = new fabric.Rect({
      height: 280,
      width: 200,
      fill: elmt === "rect" || elmt === "rectrf" ? "#C0C0C1" : "rgba(0,0,0,0)",
      stroke:
        elmt === "recto" || elmt === "rectro" ? "#C0C0C1" : "rgba(0,0,0,0)",
      transparentCorners: false,
      cornerColor: "#5cffc3",
      strokeWidth: 2,
      cornerStrokeColor: "#a3ffe3",
      borderColor: "#a3ffe3",
      cornerStyle: "circle",
      rx: elmt === "rectrf" || elmt === "rectro" ? 5 : 0,
      ry: elmt === "rectrf" || elmt === "rectro" ? 5 : 0,
      level: level,
    });
    // rect.onSelect(setColor(rect.fill));
    canvas.add(rect);
    canvas.centerObject(rect);
    canvas.renderAll().setActiveObject(rect);
  };

  const addCircle = (level) => {
    let canviCopy = JSON.stringify(canvas);
    updatePast(canviCopy);
    let circle = new fabric.Circle({
      radius: 50,
      fill: elmt === "circlef" ? "#C0C0C1" : "rgba(0,0,0,0)",
      stroke: "#C0C0C1",
      opacity: 1,
      transparentCorners: false,
      cornerColor: "#5cffc3",
      strokeWidth: 2,
      cornerStrokeColor: "#a3ffe3",
      borderColor: "#a3ffe3",
      cornerStyle: "circle",
      level: level,
    });
    // circle.onSelect(setColor(circle.fill));
    canvas.add(circle);
    canvas.centerObject(circle);
    canvas.renderAll().setActiveObject(circle);
  };

  const addTriangle = (level) => {
    updatePast(canvas);
    let triangle = new fabric.Triangle({
      width: 150,
      height: 100,
      fill: "#C0C0C1",
      angle: 45,
      opacity: 1,
      transparentCorners: false,
      cornerColor: "#5cffc3",
      strokeWidth: 2,
      cornerStrokeColor: "#a3ffe3",
      borderColor: "#a3ffe3",
      cornerStyle: "circle",
      level: level,
    });
    canvas.add(triangle);
    canvas.centerObject(triangle);
    canvas.renderAll().setActiveObject(triangle);
  };

  function regularPolygonPoints(sideCount, radius) {
    var sweep = (Math.PI * 2) / sideCount;
    var cx = radius;
    var cy = radius;
    var points = [];
    for (var i = 0; i < sideCount; i++) {
      var x = cx + radius * Math.cos(i * sweep);
      var y = cy + radius * Math.sin(i * sweep);
      points.push({ x: x, y: y });
    }
    return points;
  }

  function starPolygonPoints(spikeCount, outerRadius, innerRadius) {
    var rot = (Math.PI / 2) * 3;
    var cx = outerRadius;
    var cy = outerRadius;
    var sweep = Math.PI / spikeCount;
    var points = [];
    var angle = 0;

    for (var i = 0; i < spikeCount; i++) {
      var x = cx + Math.cos(angle) * outerRadius;
      var y = cy + Math.sin(angle) * outerRadius;
      points.push({ x: x, y: y });
      angle += sweep;

      x = cx + Math.cos(angle) * innerRadius;
      y = cy + Math.sin(angle) * innerRadius;
      points.push({ x: x, y: y });
      angle += sweep;
    }
    return points;
  }

  const addHeart = (level) => {
    var path = new fabric.Path(
      "M 272.70141,238.71731 \
    C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731  \
    C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 \
    C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 \
    C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731  \
    C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 \
    C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731  \
    z "
    );
    path.set({
      level: level,
      fill: elmt === "heartf" ? "#C0C0C1" : "rgba(0,0,0,0)",
      stroke: "#C0C0C1",
      transparentCorners: false,
      cornerColor: "#5cffc3",
      strokeWidth: 2,
      cornerStrokeColor: "#a3ffe3",
      borderColor: "#a3ffe3",
      cornerStyle: "circle",
      scaleX: 100 / path.width,
      scaleY: 100 / path.width,
    });
    canvas.add(path);
    canvas.centerObject(path);
    canvas.renderAll().setActiveObject(path);
  };

  const addPolygon = (level) => {
    updatePast(canvas);
    let num =
      elmt === "hexaf" || elmt === "hexao"
        ? 6
        : elmt === "pentaf" || elmt === "pentaf"
        ? 5
        : elmt === "octaf" || elmt === "octao"
        ? 8
        : "heptaf" || elmt === "heptao"
        ? 7
        : 9;
    var points = regularPolygonPoints(num, 30);
    var hexaPoly = new fabric.Polygon(
      points,
      {
        fill:
          elmt === "hexaf" ||
          elmt === "pentaf" ||
          elmt === "octaf" ||
          elmt === "heptaf"
            ? "#C0C0C1"
            : "rgba(0,0,0,0)",
        stroke: "#C0C0C1",
        transparentCorners: false,
        cornerColor: "#5cffc3",
        strokeWidth: 2,
        cornerStrokeColor: "#a3ffe3",
        borderColor: "#a3ffe3",
        cornerStyle: "circle",
        level: level,
      },
      false
    );
    canvas.add(hexaPoly);
    canvas.centerObject(hexaPoly);
    canvas.renderAll().setActiveObject(hexaPoly);
  };

  const addStar = (level) => {
    updatePast(canvas);
    var points =
      elmt === "starsi"
        ? starPolygonPoints(7, 50, 25)
        : starPolygonPoints(5, 50, 25);

    var star = new fabric.Polygon(
      points,
      {
        fill: elmt === "staro" ? "rgba(0,0,0,0)" : "#C0C0C1",
        stroke: elmt === "staro" ? "#C0C0C1" : "rgba(0,0,0,0)",
        transparentCorners: false,
        cornerColor: "#5cffc3",
        strokeWidth: 2,
        cornerStrokeColor: "#a3ffe3",
        borderColor: "#a3ffe3",
        cornerStyle: "circle",
        level: level,
      },
      false
    );

    canvas.add(star);
    canvas.centerObject(star);
    canvas.renderAll().setActiveObject(star);
  };

  const addElement = (level) => {
    if (elmt === "circlef" || elmt === "circleo") addCircle(level);
    if (elmt === "triangle") addTriangle(level);
    if (elmt === "heartf" || elmt === "hearto") addHeart(level);
    if (
      elmt === "rect" ||
      elmt === "recto" ||
      elmt === "rectrf" ||
      elmt === "rectro"
    )
      addRect(level);
    if (elmt === "line" || elmt === "lined") addLine(level);
    if (
      elmt === "hexaf" ||
      elmt === "hexao" ||
      elmt === "heptaf" ||
      elmt === "heptao" ||
      elmt === "octaf" ||
      elmt === "octao" ||
      elmt === "pentaf" ||
      elmt === "pentao"
    )
      addPolygon(level);
    if (elmt === "starf" || elmt === "staro" || elmt === "starsi")
      addStar(level);
    setChooseLevel(false);
  };

  return (
    <div className="flex flex-col justify-center items-center pt-4 text-white relative inspector ">
      <div className="text-lg font-bold underline">Choose Shapes</div>
      <div
        className="bg-gray-900 py-2 px-3 mt-2 rounded flex flex-wrap relative"
        id="shapeContainer"
        style={{ width: "96%" }}
      >
        <div
          className="relative mr-2 my-1 cursor-pointer pt-5"
          onClick={() => (setElmnt("line"), setChooseLevel(true))}
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="50"
            height="5px"
            xmlSpace="preserve"
          >
            <path
              className="path2"
              strokeWidth="3"
              stroke="#C0C0C1"
              d="M0 0 l1120 0"
            />
          </svg>
        </div>
        <div className="relative mr-2 my-1">
          <svg
            height="52"
            width="52"
            className=" cursor-pointer"
            onClick={() => (setElmnt("circlef"), setChooseLevel(true))}
          >
            <circle cx="26" cy="26" r="26" fill="#C0C0C1" />
          </svg>
        </div>
        <div className="relative mr-2 my-1">
          <svg
            width="50"
            height="50"
            className="cursor-pointer"
            onClick={() => (setElmnt("rect"), setChooseLevel(true))}
          >
            <rect
              x="0"
              y="0"
              width="80"
              height="80"
              style={{
                fill: "#C0C0C1",
              }}
            />
          </svg>
        </div>

        <div className="relative mr-2 my-1">
          <svg
            width="50"
            height="50"
            className="cursor-pointer"
            onClick={() => (setElmnt("rectrf"), setChooseLevel(true))}
          >
            <rect
              x="0"
              y="0"
              width="50"
              height="50"
              style={{
                fill: "#C0C0C1",
              }}
              rx={5}
              ry={5}
            />
          </svg>
        </div>

        <div className="relative mr-2 my-1">
          <svg
            height="50"
            width="50"
            className="cursor-pointer"
            onClick={() => (setElmnt("triangle"), setChooseLevel(true))}
          >
            <polygon points="25,0 50,50 0,50" style={{ fill: "#C0C0C1" }} />
          </svg>
        </div>
        <div className="mr-2 mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            height="60"
            width="62"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            onClick={() => (setElmnt("hexaf"), setChooseLevel(true))}
          >
            <polygon
              className="hex"
              points="56.25,28.125 42.1875,52.5 14.0625,52.5 0,28.125 14.0625,3.75 42.1875,3.75"
              style={{
                fill: "#C0C0C1",
              }}
            ></polygon>
          </svg>
        </div>
        <IoStarSharp
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={50}
          onClick={() => (setElmnt("starf"), setChooseLevel(true))}
        />
        <GiSevenPointedStar
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={50}
          onClick={() => (setElmnt("starsi"), setChooseLevel(true))}
        />
        <BsFillPentagonFill
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={50}
          onClick={() => (setElmnt("pentaf"), setChooseLevel(true))}
        />
        <BsHeptagonFill
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={50}
          onClick={() => (setElmnt("heptaf"), setChooseLevel(true))}
        />
        <BsOctagonFill
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={50}
          onClick={() => (setElmnt("octaf"), setChooseLevel(true))}
        />
        <IoHeartSharp
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={60}
          onClick={() => (setElmnt("heartf"), setChooseLevel(true))}
        />
        <div className="relative mr-2 my-1">
          <svg
            height="54"
            width="54"
            className=" cursor-pointer"
            onClick={() => (setElmnt("circleo"), setChooseLevel(true))}
          >
            <circle
              cx="27"
              cy="27"
              r="26"
              stroke="#C0C0C1"
              strokeWidth={1}
              fill="none"
            />
          </svg>
        </div>
        <div className="relative mr-2 my-1">
          <svg
            width="50"
            height="50"
            className="cursor-pointer"
            onClick={() => (setElmnt("recto"), setChooseLevel(true))}
          >
            <rect
              x="0"
              y="0"
              width="50"
              height="50"
              fill="none"
              stroke="#C0C0C1"
              strokeWidth={1}
            />
          </svg>
        </div>
        <div className="relative mr-2 my-1">
          <svg
            width="50"
            height="50"
            className="cursor-pointer"
            onClick={() => (setElmnt("rectro"), setChooseLevel(true))}
          >
            <rect
              x="0"
              y="0"
              ry={5}
              rx={5}
              width="50"
              height="50"
              fill="none"
              stroke="#C0C0C1"
              strokeWidth={1}
            />
          </svg>
        </div>

        <div className="relative mr-2 my-1">
          <svg
            height="50"
            width="50"
            className="cursor-pointer"
            onClick={() => (setElmnt("triangle"), setChooseLevel(true))}
          >
            <polygon points="25,0 50,50 0,50" fill="none" stroke="#C0C0C1" />
          </svg>
        </div>
        <div className="mr-2 mb-1">
          <svg
            version="1.1"
            height="60"
            width="62"
            onClick={() => (setElmnt("hexao"), setChooseLevel(true))}
          >
            <polygon
              className="hex"
              points="56.25,28.125 42.1875,52.5 14.0625,52.5 0,28.125 14.0625,3.75 42.1875,3.75"
              fill="none"
              stroke="#C0C0C1"
            ></polygon>
          </svg>
        </div>
        <IoStarOutline
          className="mr-2 my-1 staroo cursor-pointer"
          color="#C0C0C1"
          size={50}
          strokeWidth={1}
          onClick={() => (setElmnt("staro"), setChooseLevel(true))}
        />
        <BsPentagon
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={50}
          onClick={() => (setElmnt("pentao"), setChooseLevel(true))}
        />
        <BsHeptagon
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={50}
          onClick={() => (setElmnt("heptao"), setChooseLevel(true))}
        />
        <BsOctagon
          className="mr-2 my-1 cursor-pointer"
          color="#C0C0C1"
          size={50}
          onClick={() => (setElmnt("octao"), setChooseLevel(true))}
        />
        <IoHeartOutline
          className="mr-2 my-1 staroo cursor-pointer"
          color="#C0C0C1"
          size={60}
          onClick={() => (setElmnt("hearto"), setChooseLevel(true))}
        />
        <div
          className={`absolute rounded py-2 shadow flex flex-col  space-y-1 text-black text-xs bg-white top-1/4 left-20 ${
            chooseLevel ? "" : "hidden"
          }`}
        >
          <IoIosCloseCircle
            color="black"
            size={18}
            className="cursor-pointer absolute right-1 top-1"
            onClick={() => setChooseLevel(false)}
          />
          <div
            className="cursor-pointer hover:text-blue-600 px-2 pt-2"
            onClick={() => addElement("primary")}
            title="Shape can be edited by the user"
          >
            Primary
          </div>
          <hr className="" />
          <div
            className="cursor-pointer hover:text-blue-600 px-2"
            onClick={() => addElement("secondary")}
            title="Shape can't be edited by the user"
          >
            Secondary
          </div>
        </div>
      </div>

      {/* Common was here */}
    </div>
  );
}
