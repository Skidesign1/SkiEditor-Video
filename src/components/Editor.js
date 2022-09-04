import React, { useEffect, useState } from "react";
import Inspector from "./Inspector/Inspector";
import ToolsSidebar from "./ToolsSidebar";
import Content from "./Content/Content";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { designs } from "../utils/designs";

const TIME_MS = 30000;
const ENDPOINT = "https://ski-backend.herokuapp.com/";

export default function Editor() {
  const [active, setActive] = useState(2);
  const [canvas, setCanvas] = useState("");
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showMsg, setShowMsg] = useState(true);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [cropping, setCropping] = useState(false);
  const [colors, setColors] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);

  const unDo = () => {
    if (past.length > 0) {
      setFuture(future.concat(JSON.stringify(canvas)));
      canvas.clearContext(canvas.getContext());
      canvas.loadFromJSON(past[past.length - 1], () => {
        canvas.renderAll.bind(canvas);
      });
      setPast(past.slice(0, past.length - 1));
    }
  };
  const reDo = () => {
    if (future.length > 0) {
      setPast(past.concat(canvas));
      canvas.clearContext(canvas.getContext());
      canvas.loadFromJSON(future[future.length - 1], () => {
        canvas.renderAll.bind(canvas);
      });
      setFuture(future.slice(0, future.length - 1));
    }
  };

  const updatePast = (canvi) => {
    if (typeof canvi === "string") setPast(past.concat(canvi));
    else setPast(past.concat(JSON.stringify(canvi)));
  };

  const saveFunc = (show, tabIndex, indic, newValue) => {
    if (tabs.length < 1) return;
    let temp = [...tabs];
    let toSave = tabIndex > 0 ? tabIndex : activeTab;
    temp[toSave].templateFile = JSON.stringify(
      canvas.toJSON([
        "transparentCorners",
        "cornerColor",
        "strokeWidth",
        "cornerStrokeColor",
        "borderColor",
        "cornerStyle",
        "name",
        "category",
        "level",
        "splitByGrapheme",
      ])
    );

    //update in db
    if (!temp[toSave].CreatedAt) {
      //save for first time
      axios
        .post(
          `${ENDPOINT}creatives/designs/create`,
          {
            Name: temp[toSave].Name,
            isPublished: temp[toSave].isPublished,
            templateFile: temp[toSave].templateFile,
            Category: temp[toSave].Category,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          temp[toSave] = { ...res.data.data };
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //update
      let obj_to_save = {};
      if (indic === 2) obj_to_save.Name = newValue;
      if (indic === 1) obj_to_save.isPublished = newValue;
      if (indic === 3) obj_to_save.templateFile = temp[toSave].templateFile;

      // console.log("UPdate OBJ::", obj_to_save);
      axios
        .put(
          `${ENDPOINT}creatives/designs/${temp[toSave]._id}/update`,
          obj_to_save,
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          temp[toSave] = { ...res.data.data };
          // console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setTabs(temp);
    if (show) {
      setShowMsg(false);
      setTimeout(() => {
        setShowMsg(true);
      }, 3000);
    }
  };

  const publish = () => {
    let temp_tabs = [...tabs];
    temp_tabs[activeTab].isPublished = true;
    setTabs(temp_tabs);
    saveFunc(false, activeTab, 1, true);
  };

  useEffect(() => {
    let url = new URL(window.location.href);
    let enc_token = url.searchParams.get("AUTH_TOKEN");
    let activeId = url.searchParams.get("id");
    let createD = url.searchParams.get("create");
    let user = jwtDecode(enc_token);
    setToken(`Bearer ${enc_token}`);
    setUser(user);

    if (activeId && enc_token) {
      axios
        .get(`${ENDPOINT}templates/${activeId}`, {
          headers: {
            Authorization: `Bearer ${enc_token}`,
          },
        })
        .then((res) => {
          setTabs(tabs.concat(res.data.data));
        })
        .catch((err) => console.log(err));
    }

    if (createD && enc_token) {
      let canvas_design = designs.find((x) => x.value === createD);

      if (canvas_design) {
        let tab = {
          Name: "Untitled",
          _id: Math.random(1, 10000).toString(),
          templateFile: {},
          width: canvas_design.width,
          height: canvas_design.height,
          isPublished: false,
          Category: canvas_design.value,
        };
        setTabs(tabs.concat(tab));
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvas._objects) {
        let tempColors = canvas._objects.map((o) => o.fill).sort();
        let colors_t = colors.sort();
        let exp = true;
        if (tempColors.length === colors_t.length) {
          for (let i = 0; i < colors_t.length; i++) {
            if (tempColors[i] !== colors_t[i]) exp = false;
          }
        } else setColors(tempColors);

        if (!exp) setColors(tempColors);
      }
    }, TIME_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-editor w-full h-full fixed">
      <div
        className="text-green-400 font-semibold text-sm absolute top-24"
        style={{ left: "40%" }}
        hidden={showMsg}
      >
        Saved!
      </div>
      <div className="flex text-white space-x-4 p-2 text-xs font-medium ">
        <div className="w-20 h-8 cursor-pointer">
          <img src="/SVG/Blue-ski-studio-sign.svg" alt="Ski sign" />
        </div>
        <div
          className="cursor-pointer mt-2"
          onClick={() => (window.location.href = "http://skidesign.xyz")}
        >
          Home
        </div>
        {/* <div className="cursor-pointer mt-2">Help</div> */}
      </div>
      <hr className="border-t border-gray-600" />
      <div className="flex bg-editor">
        <div className="w-14 border-r-1 border-fuchsia-600 bg-editor">
          <ToolsSidebar
            active={active}
            setActive={setActive}
            unDo={unDo}
            reDo={reDo}
            save={saveFunc}
            past={past}
            future={future}
            publish={publish}
            isPublished={tabs[activeTab] ? tabs[activeTab].isPublished : 2}
          />
        </div>
        <Content
          canvas={canvas}
          setCanvas={setCanvas}
          tabs={tabs}
          setTabs={setTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          updatePast={updatePast}
          saveFunc={saveFunc}
          colors={colors}
          setColors={setColors}
        />
        {/* style={{ width: "22%", maxHeight: "100%" }} */}
        <div className="bg-editor overflow-auto" style={{ width: "22%" }}>
          <Inspector
            active={active}
            canvas={canvas}
            updatePast={updatePast}
            cropping={cropping}
            setCropping={setCropping}
            colors={colors}
            setColors={setColors}
          />
        </div>
      </div>
    </div>
  );
}
