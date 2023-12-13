import loader from "/src/animated-icon/loading.json";
import Lottie from "lottie-react";

function Loading() {
  return (
    <div className="text-red-500 text-2xl min-h-screen bg-gray-800 flex items-start justify-center pt-[-800px]">
      <Lottie animationData={loader} className="w-[220px]" />
    </div>
  );
}

export default Loading;
