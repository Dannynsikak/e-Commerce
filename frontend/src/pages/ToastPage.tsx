import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast: React.FC = () => {
  const notify = () => {
    toast.success("Wow, so easy!", {
      position: "top-right", // Use string instead of toast.POSITION.TOP_RIGHT
      autoClose: 3000, // Duration in milliseconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <button onClick={notify}>Notify!</button>
      <ToastContainer limit={3} />
    </div>
  );
};

export default Toast;
