import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import { BiSearch } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import { BsFilter } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";
import { createApi } from "unsplash-js";
import { changeOpacity } from "./Functions";
import { fabric } from "fabric";

//temp
const ACCESS_KEY = "dt3llEYAVbaWKe2TkN6M4LSv-JoXLFHyAMk2vLeLWvI";

const unsplash = createApi({ accessKey: ACCESS_KEY });

export default function PhotosInspector({ canvas, setSelected }) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [localImgs, setLocalImgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transparency, setTransparency] = useState(1);
  const [chooseLevel, setChooseLevel] = useState(false);
  const [activeImg, setActiveImg] = useState(null);

  const searchPhotos = async () => {
    setLoading(true);
    unsplash.search
      .getPhotos({
        query: search,
        perPage: 35,
      })
      .then((result) => {
        //handle fals-
        console.log("Result:", result);
        let temp = result.response.results.map((pic) => {
          return {
            id: pic.id,
            url: pic.urls.small,
          };
        });

        setLocalImgs(temp);
        setLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      searchPhotos();
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
        let scaleX = myImg.width / 300;
        let scaleY = myImg.height / 300;
        myImg.set({
          transparentCorners: false,
          cornerColor: "#5cffc3",
          strokeWidth: 2,
          cornerStrokeColor: "#a3ffe3",
          borderColor: "#a3ffe3",
          cornerStyle: "circle",
          level: level === "logo" ? "primary" : level,
          category: level === "logo" ? "logo" : "none",
          // scaleX: 1 / scaleX,
          // scaleY: 1 / scaleY,
        });
        canvas.add(myImg);
        canvas.centerObject(myImg);
        canvas.renderAll().setActiveObject(myImg);
        // if (myImg.onSelect()) setSelected(myImg);
        // myImg.onSelect(setSelected(myImg));
      },
      { crossOrigin: "Anonymous" }
    );
  };

  useEffect(() => {
    setLocalImgs([
      {
        id: 430,
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      },
      {
        id: 450,
        url: "https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg",
      },
      {
        id: 410,
        url: "https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg",
      },
      {
        id: 409,
        url: "https://wallpaperaccess.com/full/1313700.jpg",
      },
    ]);
  }, []);
  return (
    <div className="flex flex-col justify-center items-center pt-4 text-white relative ">
      <div className="text-lg font-bold underline">Choose Free Photos</div>
      <div className="bg-gray-900 py-2 px-3 mt-2 rounded w-90 text-sm">
        <div className="bg-white px-2 py-2 rounded-sm text-xs flex text-black">
          <BiSearch
            color="black"
            size={15}
            className="mt-1 cursor-pointer"
            onClick={searchPhotos}
          />
          <input
            type="text"
            placeholder="Magic recommendations"
            className="ml-1 focus:outline-none"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <IoIosClose
            color="black"
            size={20}
            className="mt-0.5 cursor-pointer"
            onClick={() => setSearch("")}
          />
          <BsFilter
            color="black"
            size={15}
            className="mt-1 ml-1 cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          />
        </div>
        <div
          className={`${
            showFilters ? "hidden" : ""
          } bg-white px-2 py-2 rounded-sm text-xs flex text-black mt-2`}
        >
          Filters
        </div>
        <div className="flex flex-wrap mt-6 pb-3 items-center justify-center">
          <div
            className="w-full my-3"
            style={{ marginLeft: "45%" }}
            hidden={!loading}
          >
            <FiLoader size={20} />
          </div>
          {localImgs.length > 0 &&
            localImgs.map((img, index) => (
              <div
                className={`cursor-pointer mt-3 px-2`}
                key={img.id}
                // onClick={() => addImage(img)}
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
