import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosCloseCircle } from "react-icons/io";
import { fabric } from "fabric";
import { changeOpacity } from "./Functions";
import axios from "axios";

// export const addImage = (img, canvas) => {
//   fabric.Image.fromURL(img.url, function (myImg) {
//     canvas.add(myImg);
//     canvas.renderAll().setActiveObject(myImg);
//   });
// };

export default function MediaInspector({ canvas, setSelected }) {
  const [localImgs, setLocalImgs] = useState([]);
  const [transparency, setTransparency] = useState(1);
  const [chooseLevel, setChooseLevel] = useState(false);
  const [activeImg, setActiveImg] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      let body = new FormData();
      body.set("key", "298034d3800cbebc036e919c320a1f11");
      body.append("image", img);

      let temp = [...localImgs];

      axios({
        method: "post",
        url: "https://api.imgbb.com/1/upload",
        data: body,
      })
        .then((res) => {
          // console.log(res.data.data.display_url);
          temp.push({
            id: Math.random(1, 10000),
            url: res.data.data.display_url,
          });
          setLocalImgs(temp);
          localStorage.setItem("photos", JSON.stringify(temp));
        })
        .catch((err) => console.log(err));
    }
  };

  const addImage = (level) => {
    setChooseLevel(false);
    fabric.Image.fromURL(
      activeImg.url,
      function (myImg) {
        // myImg.clipTo = function (ctx) {
        //   // origin is the center of the image
        //   var x = 20;
        //   var y = 50;
        //   ctx.rect(x, y, 30, 90);
        // };
        myImg.set({
          transparentCorners: false,
          cornerColor: "#5cffc3",
          strokeWidth: 2,
          cornerStrokeColor: "#a3ffe3",
          borderColor: "#a3ffe3",
          cornerStyle: "circle",
          level: level === "logo" ? "primary" : level,
          category: level === "logo" ? "logo" : "none",
          // width: 200,
          // height: 200,
        });
        canvas.add(myImg);
        canvas.centerObject(myImg);
        canvas.renderAll().setActiveObject(myImg);
        // if (myImg.onSelect()) setSelected(myImg);
      },
      { crossOrigin: "Anonymous" }
    );
  };

  useEffect(() => {
    //add some images
    let sm_imgs = localStorage.getItem("photos");
    if (sm_imgs) {
      sm_imgs = JSON.parse(sm_imgs);
      setLocalImgs(sm_imgs);
    } else {
      setLocalImgs([
        {
          id: 430,
          url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        },
      ]);
    }
  }, []);
  return (
    <div className="flex flex-col justify-center items-center pt-4 text-white relative ">
      <div className="text-lg font-bold underline">Your Uploaded Images</div>
      <div className="bg-gray-900 py-2 px-3 mt-2 rounded w-90 text-sm">
        <div className="py-1.5 px-4 bg-purple-700 rounded my-1 flex relative text-xs">
          <div className="text-center w-4/5">
            <label className="cursor-pointer">
              <input type="file" name="custom-img" onChange={onImageChange} />
              Upload media
            </label>
          </div>
          <span className="border-div"></span>
          <div className="absolute right-5 top-2">
            <HiDotsHorizontal />
          </div>
        </div>
        <div className="text-md mt-6 text-center">Images</div>
        <hr className="w-2/5 mx-auto mt-1.5" />
        <div className="flex flex-wrap space-x-2.5 mt-6 w-90 space-y-3 pb-3 items-center justify-center">
          {localImgs.length > 0 &&
            localImgs.map((img, index) => (
              <div
                className={`cursor-pointer ${index === 0 ? "mt-3" : ""}`}
                key={img.id}
                onClick={() => (setActiveImg(img), setChooseLevel(true))}
              >
                <img className="media-img" src={img.url} />
              </div>
            ))}
        </div>
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
            onClick={() => addImage("primary")}
            title="Shape can be edited by the user"
          >
            Primary
          </div>
          <hr className="" />
          <div
            className="cursor-pointer hover:text-blue-600 px-2"
            onClick={() => addImage("secondary")}
            title="Shape can't be edited by the user"
          >
            Secondary
          </div>
          <hr className="" />
          <div
            className="cursor-pointer hover:text-blue-600 px-2"
            onClick={() => addImage("logo")}
            title="Shape can't be edited by the user"
          >
            Logo
          </div>
        </div>
        {/* <div className="py-1 px-4 bg-gray-700 text-sm my-2 rounded">Add a subheading</div> */}
      </div>
      <div className="text-lg font-bold mt-6 underline ">Edit Image</div>
      <div className="bg-white mt-5 flex text-black p-2 space-x-2 w-90 text-xs">
        <div>Transparency</div>
        <div className="w-28 mt-1">
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
        <div className="border rounded-sm px-1">{transparency}</div>
      </div>
    </div>
  );
}
