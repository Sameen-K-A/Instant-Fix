import React from "react";
import { Send, Account } from "../../../public/svgs/Icons";

function Sidebaaaar() {
  return (
    <div
      className="d-flex flex-column align-items-center p-3 bg-white"
      style={{
        position: "fixed",
        top: "0",
        right: "0",
        width: "60px",
        height: "100vh",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="mb-5">
        <Send className="text-white" />
      </div>
      <div className="mb-5">
        <Account className="text-white" />
      </div>
      <div className="mb-5">
        <Send className="text-white" />
      </div>
      <div className="mb-5">
        <Send className="text-white" />
      </div>
      <div className="mb-5">
        <Account className="text-white" />
      </div>
      <div className="mb-5">
        <Send className="text-white" />
      </div>
      <div className="mb-0">
        <Account className="text-white" />
      </div>
    </div>
  );
}

export default Sidebaaaar;