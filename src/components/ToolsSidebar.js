import React, { useState } from "react";
import { GrRedo, GrUndo } from "react-icons/gr";
import { IoShapesOutline } from "react-icons/io5";
import { BiCrop, BiSave, BiCloudUpload, BiText, BiCheck,BiHeadphone } from "react-icons/bi";
import { BsCast,BsFillEyeFill } from "react-icons/bs";
import{MdVideoLibrary}  from 'react-icons/md'
import { IoIosSend, IoMdImages } from "react-icons/io";
import { useEffect } from "react";

export default function Sidebar({
  active,
  setActive,
  unDo,
  reDo,
  save,
  past,
  future,
  publish,
  isPublished,
  // animate,
  // soundeffect,
  // preview
 

}) {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (saving) {
      setTimeout(() => {
        setSaving(false);
      }, 3000);
    }
  }, [saving]);
  return (
    <div className="flex flex-col items-center pt-20 space-y-2">
      <GrUndo
        size={30}
        color={`${past.length > 0 ? "white" : "#aabbcc"}`}
        className={`w-full cursor-pointer py-1 hover:bg-gray-700`}
        onClick={unDo}
        title="Undo"
      />
      <GrRedo
        size={30}
        color={`${future.length > 0 ? "white" : "#aabbcc"}`}
        className={`w-full cursor-pointer py-1 hover:bg-gray-700`}
        onClick={reDo}
        title="Redo"
      />
      <BiText
        size={30}
        color="white"
        className={`${
          active === 2 ? "border-r-2 border-red-500 bg-gray-800" : ""
        } w-full cursor-pointer py-1 hover:bg-gray-700 `}
        onClick={() => {
          setActive(2);
        }}
        title="Text"
      />
      <IoShapesOutline
        size={30}
        color="white"
        className={`${
          active === 3 ? "border-r-2 border-red-500 bg-gray-800" : ""
        } w-full cursor-pointer py-1 hover:bg-gray-700 `}
        onClick={() => {
          setActive(3);
        }}
        title="Shapes"
      />
      <BiCloudUpload
        size={30}
        color="white"
        className={`${
          active === 4 ? "border-r-2 border-red-500 bg-gray-800" : ""
        } w-full cursor-pointer py-1 hover:bg-gray-700`}
        onClick={() => {
          setActive(4);
        }}
        title="Upload Images"
      />
      <IoMdImages
        size={30}
        color="white"
        className={`${
          active === 5 ? "border-r-2 border-red-500 bg-gray-800" : ""
        } w-full cursor-pointer py-1 hover:bg-gray-700`}
        onClick={() => {
          setActive(5);
        }}
        title="Search Images"
      />
      <BiCrop
        size={30}
        color="white"
        className={`${
          active === 6 ? "border-r-2 border-red-500 bg-gray-800" : ""
        } w-full cursor-pointer py-1 hover:bg-gray-700`}
        onClick={() => {
          setActive(6);
        }}
        title="Crop"
      />

      <BsCast
        size={27}
        color="white"
        className={`${
          active === 8 ? "border-r-2 border-red-500 bg-gray-800" : ""
        } w-full cursor-pointer py-1 hover:bg-gray-700`}
        onClick={() => {
          setActive(8);
        }}
        title="Change Background"
      />
      <BiSave
        size={30}
        color="white"
        className={`w-full cursor-pointer py-1 hover:bg-gray-700 ${
          saving ? "hidden" : ""
        }`}
        onClick={() => (save(true, -1, 3), setSaving(true))}
        title="Save"
      />
      <BiCheck
        size={30}
        color="#6afc6a"
        className={`w-full cursor-pointer py-1 ${saving ? "" : "hidden"}`}
        title="Saved"
      />
      {!isPublished && (
        <IoIosSend
          size={30}
          // color="white"
          className={`text-white cursor-pointer py-1 hover:text-green-400 absolute bottom-6 left-2.5`}
          onClick={publish}
          title="Publish"
        />
      )}
        <MdVideoLibrary
        size={30}
        color="#6afc6a"
        className={`w-full cursor-pointer py-1 ${saving ? "" : "hidden"}`}
        title="animate"
      />
        <BiHeadphone
        size={30}
        color="#6afc6a"
        className={`w-full cursor-pointer py-1 ${saving ? "" : "hidden"}`}
        title="soundeffect"
      />
      <BsFillEyeFill
        size={30}
        color="#6afc6a"
        className={`w-full cursor-pointer py-1 ${saving ? "" : "hidden"}`}
        title="preview"
      />

      
      
    </div>
  );
}
