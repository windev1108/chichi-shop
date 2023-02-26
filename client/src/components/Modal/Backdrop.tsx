import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Backdrop = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[20002] bg-[#11111170]"></div>
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-center items-center z-[20003]">
        <AiOutlineLoading3Quarters className="animate-spin duration-500 ease-linear text-6xl text-white" />
      </div>
    </>
  );
};

export default Backdrop;
