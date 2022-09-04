import Editor from "./components/Editor";
import "./assets/styles/editor.css";
import React, { useEffect, useState } from "react";

function App() {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    let url = new URL(window.location.href);
    let enc_token = url.searchParams.get("AUTH_TOKEN");
    if (enc_token) setAuth(true);
  }, []);
  return (
    <div className="App relative">
      {auth ? (
        <Editor />
      ) : (
        <div
          className="shadow-xl absolute top-32 p-5 rounded text-black text-center font-semibold w-48 cursor-pointer"
          style={{ backgroundColor: "#F6FBF9", left: "45%" }}
          onClick={() => (window.location.href = "https://www.skidesign.xyz")}
        >
          Please Login
        </div>
      )}
    </div>
  );
}

export default App;
