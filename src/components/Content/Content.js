import React, { Component } from "react";
import { IoIosClose } from "react-icons/io";
import { fabric } from "fabric";
import Select from "react-select";
import { designs } from "../../utils/designs";
import { FiPlus, FiMinus } from "react-icons/fi";
const customStyles = {
  control: (base) => ({
    ...base,
    height: 35,
    minHeight: 35,
    width: 180,
  }),
};

export default class Content extends Component {
  state = {
    widVar: 18,
    editable: false,
    nameHandler: "",
    ctrlDown: false,
    clonedObj: {},
    canvaDesign: "",
    newTab: false,
    called: false,
    zoomVal: 100,
    ztempVal: 100,
  };

  initCanvas = (width, height) =>
    new fabric.Canvas("canvas", {
      height: height,
      width: width,
      backgroundColor: "white",
      opacity: 0.3,
      disabled: false,
      rectangle: "",
    });

  removeEl = () => {
    const { canvas, updatePast } = this.props;
    let canviCopy = JSON.stringify(canvas);
    // console.log("Active:", canvas.getActiveObjects());

    if (canvas.getActiveObject()) {
      updatePast(canviCopy);
      canvas.remove(canvas.getActiveObject());
    }
    if (canvas.getActiveObjects()) {
      updatePast(canviCopy);
      let objs = canvas.getActiveObjects();
      for (let i = 0; i < objs.length; i++) {
        canvas.remove(objs[i]);
      }
    }
  };

  addTab = (canvas_design) => {
    const { setTabs, tabs } = this.props;
    let tab = {
      Name: "Untitled",
      _id: Math.random(1, 10000).toString(),
      templateFile: {},
      width: canvas_design === "" ? designs[3].width : canvas_design.width,
      height: canvas_design === "" ? designs[3].height : canvas_design.height,
      isPublished: false,
      Category: canvas_design.value,
    };
    // this.props.saveFunc(false);
    setTabs(tabs.concat(tab));
    this.setState({ newTab: false });
    // setActiveTab(tabs.length);
  };

  closeTab = (i) => {
    const { setTabs, tabs, activeTab, setActiveTab } = this.props;
    let temp = [...tabs];
    temp.splice(i, 1);
    setTabs(temp);
    if (activeTab === i) setActiveTab(temp.length - 1);
  };

  setImgAs = (catg) => {
    const { canvas } = this.props;
    let active_obj = canvas.getActiveObject();
    if (!active_obj) return;
    if (active_obj.type !== "image") return;
    //remove logo prop on another image
    let index = canvas._objects.findIndex((x) => x.category === catg);
    if (index > 0) canvas._objects[index].set({ category: "none" });
    active_obj.set({ category: catg });
    canvas.renderAll();
  };

  setTextAs = (category) => {
    const { canvas } = this.props;
    let active_obj = canvas.getActiveObject();
    if (!active_obj) return;
    if (active_obj.type !== "textbox") return;
    let index = canvas._objects.findIndex((x) => x.category === category);
    if (index > 0) canvas._objects[index].set({ category: "none" });
    active_obj.set({ category: category });
    canvas.renderAll();
  };

  handleKeyDown = (e) => {
    const { canvas } = this.props;
    if (e.keyCode === 46 || e.keyCode === 8) {
      this.removeEl();
    }

    if (e.keyCode === 16) {
      //shift key
      this.setState({ ctrlDown: true });
    }

    if (e.keyCode === 68 && this.state.ctrlDown) {
      var activeObjects = canvas.getActiveObjects();

      if (activeObjects) {
        activeObjects.forEach(function (object) {
          object.clone(function (clone) {
            canvas.add(
              clone.set({
                left: object.left + 10,
                top: object.top + 10,
              })
            );
          });
        });
      }
      canvas.renderAll();
    }

    if (e.keyCode === 76 && this.state.ctrlDown) this.setImgAs("logo");

    if (e.keyCode === 73 && this.state.ctrlDown) this.setImgAs("cimg");

    if (e.keyCode === 84 && this.state.ctrlDown) this.setTextAs("title");

    if (e.keyCode === 87 && this.state.ctrlDown) this.setTextAs("website");

    if (e.keyCode === 69 && this.state.ctrlDown) this.setTextAs("email");

    if (e.keyCode === 80 && this.state.ctrlDown) this.setTextAs("phone");
  };

  handleDClick = (e) => {
    this.setState({ editable: true });
  };

  handleOnBlur = (e) => {
    let { activeTab, saveFunc, tabs } = this.props;
    let temp = [...tabs];
    temp[activeTab].Name = this.state.nameHandler;
    this.props.setTabs(temp);
    saveFunc(false, activeTab, 2, this.state.nameHandler);
    this.setState({ editable: false, nameHandler: "" });
  };

  zoomFunc = (val) => {
    // let { canvas } = this.props;
    // let delta = e.deltaY;
    // let zoom = canvas.getZoom();
    // zoom *= 0.999 ** delta;
    // if (zoom > 20) zoom = 20;
    // if (zoom < 0.01) zoom = 0.01;
    // canvas.setZoom(zoom);
    // // e.preventDefault();
    // e.stopPropagation();
    if (val === "reset") this.setState({ zoomVal: 100 });
    else this.setState({ zoomVal: this.state.zoomVal + val });
  };

  componentDidMount() {
    let { tabs } = this.props;
    if (tabs.length < 1) this.setState({ newTab: true });
  }

  componentDidUpdate(prevProps) {
    let { tabs, activeTab, canvas, setColors, setCanvas } = this.props;
    if (tabs !== prevProps.tabs) {
      if (
        tabs.length > 0 &&
        tabs.length !== prevProps.tabs.length &&
        !this.state.called
      ) {
        this.setState({ newTab: false });
        let tempDesign = designs.find(
          (x) => x.value === tabs[activeTab].Category
        );
        canvas = this.initCanvas(tempDesign.width, tempDesign.height);
        console.log("CALLED1");

        if (Object.keys(tabs[activeTab].templateFile).length > 0) {
          // console.log("Parsed::", JSON.parse(tabs[activeTab].templateFile));
          canvas.loadFromJSON(tabs[activeTab].templateFile, () => {
            canvas.renderAll.bind(canvas);
          });
          let tempColors = JSON.parse(tabs[activeTab].templateFile).objects.map(
            (o) => o.fill
          );
          setColors(tempColors);
        } else {
          canvas.renderAll();
        }
        setCanvas(canvas);
        this.setState({ called: true });
      }
    }
    if (
      activeTab !== prevProps.activeTab &&
      activeTab > -1 &&
      tabs.length > 0
    ) {
      console.log("CALLED2");
      canvas.dispose();
      localStorage.setItem("active_tab", activeTab);
      canvas = this.initCanvas(tabs[activeTab].width, tabs[activeTab].height);

      if (Object.keys(tabs[activeTab].templateFile).length > 0) {
        if (JSON.parse(tabs[activeTab].templateFile).objects.length > 0) {
          canvas.loadFromJSON(tabs[activeTab].templateFile, () => {
            canvas.renderAll.bind(canvas);
          });
          let tempColors = JSON.parse(tabs[activeTab].templateFile).objects.map(
            (o) => o.fill
          );
          setColors(tempColors);
        }
      }

      setCanvas(canvas);
    }
  }

  render() {
    let { tabs, widVar, activeTab, setActiveTab, saveFunc, canvas } =
      this.props;
    return (
      <div
        className="border-r border-gray-600 bg-editor-content text-white h-screen relative"
        style={{ width: "78%" }}
        id="editor-content"
        onKeyDown={this.handleKeyDown}
        onKeyUp={() => this.setState({ ctrlDown: false })}
        tabIndex={-1}
        // onWheel={this.zoomFunc}
      >
        <div className="bg-topbar text-xs font-medium w-full flex">
          {tabs.length > 0 &&
            tabs.map(
              (tab, i) => (
                // tab.open && (
                <div
                  className={`${
                    i === activeTab ? "bg-tab-active" : "bg-tab"
                  }  py-2 px-4 w-48 flex relative border-r border-gray-800`}
                  key={tab._id}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => (
                      saveFunc(false, activeTab, 3), setActiveTab(i)
                    )}
                    onDoubleClick={this.handleDClick}
                    onBlur={this.handleOnBlur}
                    value="value"
                    onInput={(e) =>
                      this.setState({ nameHandler: e.target.innerText })
                    }
                    // tabIndex="4"
                    contentEditable={`${
                      i === activeTab && this.state.editable === true
                    }`}
                    suppressContentEditableWarning={true}
                  >
                    {tab.Name}
                  </div>
                  <IoIosClose
                    color="gray"
                    size={20}
                    className="cursor-pointer absolute right-2 top-1.5"
                    onClick={() => this.closeTab(i)}
                    title="Close Design"
                  />
                </div>
              )
              // )
            )}
          <FiPlus
            color="white"
            size={widVar}
            className="cursor-pointer m-2 ml-1.5 mr-1.5 w-4"
            onClick={() => this.setState({ newTab: true })}
            title="New Design"
          />
        </div>
        {/* pt-14 */}
        <div className="relative">
          <div
            className={
              canvas.width === 550
                ? ""
                : canvas.width === 500
                ? "pt-12"
                : "pt-6"
            }
            id="canvas_cont"
            style={{ zoom: `${this.state.zoomVal}%` }}
          >
            {/* <button onClick={this.props.addRect}>Rectangle</button> */}
            <canvas id="canvas" />
          </div>
        </div>

        <div className="bg-white mt-5 text-black py-2 px-4 w-40 h-8 rounded-sm absolute bottom-14 right-2">
          <div className="float-left text-xs">
            <span
              onClick={() => this.setState({ editable: true })}
              onInput={(e) =>
                parseInt(e.target.innerText) !== NaN
                  ? this.setState({ ztempVal: e.target.innerText })
                  : null
              }
              onKeyDown={(e) =>
                e.key === "Enter"
                  ? this.setState({
                      editable: false,
                      zoomVal: this.state.ztempVal,
                    })
                  : null
              }
              onBlur={() =>
                this.setState({ editable: false, zoomVal: this.state.ztempVal })
              }
              // tabIndex="4"
              contentEditable={`${this.state.editable === true}`}
              suppressContentEditableWarning={true}
              className="p-1"
            >
              {this.state.zoomVal}
            </span>
            <span>%</span>
          </div>
          <div className="flex space-x-1.5 absolute right-2 top-1.5">
            <FiMinus
              size={17}
              className="mt-0.5 cursor-pointer"
              onClick={() => this.zoomFunc(-1)}
            />
            <FiPlus
              size={17}
              className="mt-0.5 cursor-pointer "
              onClick={() => this.zoomFunc(1)}
            />
            <button
              className="text-center py-0.5 px-2 rounded-xl text-xs  border border-gray-700 cursor-pointer"
              onClick={() => this.zoomFunc("reset")}
            >
              Reset
            </button>
          </div>
        </div>
        <div
          className={`absolute shadow-xl p-10 rounded top-1/4 left-1/2 text-black flex flex-col justify-center items-center ${
            this.state.newTab ? "" : "hidden"
          }`}
          style={{ backgroundColor: "#F6FBF9" }}
        >
          <div className="font-bold text-lg">Create a design</div>
          <div className="text-xs mt-1">
            Tell us want you want Ski to design
          </div>
          <Select
            options={designs}
            onChange={(newValue) => this.setState({ canvaDesign: newValue })}
            className="text-xs mt-8"
            styles={customStyles}
          />
          <div
            className="bg-blue-500 text-white text-xs font-bold rounded px-4 py-2 cursor-pointer mt-5"
            onClick={() => this.addTab(this.state.canvaDesign)}
          >
            START
          </div>
        </div>
      </div>
    );
  }
}
