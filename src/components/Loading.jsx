import loader from "../../public/animated-icon/loading.json";
import Lottie from "lottie-react";

function Loading() {
  return (
    <div className="text-red-500 text-2xl h-[calc(100vh-48px)] bg-gray-800 flex items-start justify-center pt-[-800px]">
      <Lottie animationData={loader} className="w-[220px]" />
    </div>
  );
}

export default Loading;
