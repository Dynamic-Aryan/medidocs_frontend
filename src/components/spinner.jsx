import React from "react";
import { FadeLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <FadeLoader color="#1E3A8A" loading={true} size={15} margin={5} speedMultiplier={2} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
