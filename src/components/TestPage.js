import React, { useEffect, useState } from "react";
import Select from "react-select";
import { fabric } from "fabric";
import { jsPDF } from "jspdf";

const design_cats = [
  {
    value: "ig",
    label: "Instagram Post",
  },
  {
    value: "fb",
    label: "Facebook Post",
  },
  {
    value: "flyer",
    label: "Digital Flyer",
  },
];

export default function TestPage() {
  const [designs, setDesigns] = useState([]);
  const [design, setDesign] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [logo, setLogo] = useState(null);
  const [color, setColor] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designCanvas, setDesignCanvas] = useState("");
  const [canviNum, setCanviNum] = useState([]);
  const [canviDesigns, setCanviDesigns] = useState([]);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 35,
      minHeight: 35,
      width: 280,
    }),
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setLogo(URL.createObjectURL(img));
    }
  };

  const createDesign = () => {
    //limit to 20

    if (!design) return;
    let temp_nums = [];
    let count = 0;
    // let temp_design = designs.filter((d,i) => d.design === design.value);
    // if (temp_design.length < 1) return;
    designs.map((d, i) => {
      if (d.design === design.value) {
        temp_nums.push(i);
      }
    });
    console.log("TEMPP::", temp_nums);
    if (temp_nums.length > 0) setCanviNum(temp_nums);
  };

  const addDesigns = () => {
    // let temp_designs = designs.filter((d) => d.design === design.value);
    let canvaDesings_temp = [];
    canviNum.map((i) => {
      let canvi = new fabric.Canvas(`canvas${i}`, {
        height: designs[i].height,
        width: designs[i].width,
        backgroundColor: "white",
        // opacity: 0.3,
        // disabled: false,
        // rectangle: "",
      });
      canvi.loadFromJSON(
        designs[i].canvas,
        canvi.renderAll.bind(canvi),
        function (o, object) {
          object.editable = false;
          if (o.type === "textbox" && o.name === "title") {
            object.text = title;
          }
          if (o.type === "textbox" && o.name === "body") {
            object.text = content;
          }
          if (o.type === "image" && o.category === "logo" && logo) {
            object.setSrc(logo, () => canvi.renderAll());
          }
          if (
            o.type === "triangle" ||
            o.type === "circle" ||
            o.type === "rect"
          ) {
            if (o.level === "primary" && color !== "") {
              object.fill = color;
              // canvi.renderAll();
            }
          }
          canvi.renderAll();
        }
      );
      canvi.renderAll();
      canvaDesings_temp.push(canvi);
    });
    setCanviDesigns(canvaDesings_temp);
    // for (let i = 0; i < canviNum.length; i++)

    // setDesignCanvas(canvi);
  };

  // useEffect(() => {
  //   if (modalIsOpen && design) createDesign();
  // }, [modalIsOpen]);

  const downloadAsPng = (index) => {
    const dataURL = canviDesigns[index].toDataURL({
      width: designCanvas.width,
      height: designCanvas.height,
      left: 0,
      top: 0,
      format: "png",
    });
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rasterizeSVG = (index) => {
    let w = window.open("");
    w.document.write(canviDesigns[index].toSVG());
    return (
      "data:image/svg+xml;utf8," + encodeURIComponent(designCanvas.toSVG())
    );
  };

  const downloadAsPdf = (index) => {
    var imgData = canviDesigns[index].toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF();

    pdf.addImage(imgData, "JPEG", 0, 0);
    pdf.save("download.pdf");
  };

  useEffect(() => {
    if (localStorage.getItem("tabs")) {
      let tabs = JSON.parse(localStorage.getItem("tabs"));
      // tabs = tabs.map((t) => {
      //   return { ...t, value: t.id, label: t.name };
      // });
      setDesigns(tabs);
    }

    // For Modal
    var modal = document.getElementById("modal");

    // Get the button that opens the modal
    var btn = document.getElementById("openBtn");
    btn.onclick = function () {
      modal.style.display = "block";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }, []);

  useEffect(() => {
    if (canviNum.length > 0) addDesigns();
  }, [canviNum]);
  return (
    <div className=" relative testing pb-10 w-full">
      <div
        className={`w-4/12 mx-auto mt-10 shadow-xl p-10 rounded-lg top-10 text-black flex flex-col justify-center items-center`}
        style={{ backgroundColor: "#F6FBF9", left: "33%" }}
      >
        <div className="font-bold text-lg">Create a design</div>
        <div className="text-xs mt-1">Tell us want you want Ski to design</div>
        <Select
          options={design_cats}
          onChange={(newValue) => setDesign(newValue)}
          className="text-xs mt-8"
          styles={customStyles}
          placeholder="What do you want to design?"
        />
        <input
          type="text"
          placeholder="Add Header/Title"
          className="text-xs text-black py-2 px-3 mt-3 rounded-sm border border-gray-300 focus:outline-none"
          style={{ width: 280 }}
          maxLength={30}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name="content"
          cols="30"
          rows="10"
          placeholder="Add Any Further Content"
          className="text-xs text-black py-2 px-3 mt-3 rounded-sm border border-gray-300 focus:outline-none"
          style={{ width: 280 }}
          maxLength={100}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex space-x-3">
          <div
            className="text-xs mt-3 bg-white rounded-sm border border-gray-300 py-2 px-3 text-gray-400"
            style={{ width: 135 }}
          >
            <label className="cursor-pointer">
              <input type="file" name="custom-img" onChange={onImageChange} />
              {logo ? "Logo Uploaded" : "Upload a Logo"}
            </label>
          </div>
          <input
            type="text"
            placeholder="Choose main color"
            className="text-xs text-black py-2 px-3 mt-3 rounded-sm border border-gray-300 focus:outline-none"
            style={{ width: 135 }}
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="(Optional) Add website link"
          className="text-xs text-black py-2 px-3 mt-3 rounded-sm border border-gray-300 focus:outline-none"
          style={{ width: 280 }}
          value={website}
          maxLength={30}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <input
          type="text"
          placeholder="(Optional) Add email address"
          className="text-xs text-black py-2 px-3 mt-3 rounded-sm border border-gray-300 focus:outline-none"
          style={{ width: 280 }}
          maxLength={30}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="(Optional) Add phone contact"
          className="text-xs text-black py-2 px-3 mt-3 rounded-sm border border-gray-300 focus:outline-none"
          style={{ width: 280 }}
          maxLength={30}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div
          className="bg-blue-500 text-white text-xs font-bold rounded px-4 py-2 cursor-pointer mt-5"
          onClick={createDesign}
          id="openBtn"
          // onClick={() => setIsOpen(true)}
        >
          START
        </div>
      </div>
      {/* <button onClick={() => setIsOpen(true)} id="openBtn">
        Open
      </button> */}
      <div
        className={`modal hidden fixed z-10 pt-10 left-0 top-0 w-full h-full overflow-auto`}
        style={{
          backgroundColor: "rgb(0,0,0)",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
        id="modal"
      >
        <div
          className="modal-content m-auto p-10 border border-gray-200 rounded-lg w-4/5"
          style={{
            backgroundColor: "#F6FBF9",
            height: "99%",
            overflowY: "scroll",
          }}
        >
          <div className="font-bold text-lg text-center relative">
            Your Designs
          </div>
          {canviNum.length > 0 &&
            canviNum.map((i, index) => (
              <div className="mt-4 relative" key={i}>
                <div className="float-left mt-6">
                  <canvas id={`canvas${i}`} className="" />
                </div>
                <div className="float-right mt-32 mr-32 ">
                  <div className="font-medium">Download</div>
                  <div
                    className="bg-blue-500 text-white text-xs font-bold rounded px-4 py-2 cursor-pointer mt-5 text-center"
                    onClick={() => downloadAsPng(index)}
                  >
                    PNG
                  </div>
                  <div
                    className="bg-blue-500 text-white text-xs font-bold rounded px-4 py-2 cursor-pointer mt-5 text-center"
                    onClick={() => rasterizeSVG(index)}
                  >
                    SVG
                  </div>
                  <div
                    className="bg-blue-500 text-white text-xs font-bold rounded px-4 py-2 cursor-pointer mt-5 text-center"
                    onClick={() => downloadAsPdf(index)}
                  >
                    PDF
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
