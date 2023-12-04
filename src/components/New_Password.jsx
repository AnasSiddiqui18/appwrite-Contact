import { useForm } from "react-hook-form";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

function New_Password() {
  const { handleUpdate } = useUser();
  const { handleSubmit, register } = useForm();

  const navigate = useNavigate();

  const onsubmit = async (data) => {
    const response = await handleUpdate(data);
    console.log("password updated successfully", response);
    navigate("/login");
  };

  return (
    <div className="bg-gray-700 h-[calc(100vh-48px)] flex justify-center">
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="bg-gray-800 flex flex-col gap-5 h-[200px] items-center w-[400px] border-2 border-red-600 py-10 rounded-md mt-10"
      >
        <input
          {...register("password")}
          type="text"
          className="w-[250px] outline-none px-2 rounded-md py-1"
          placeholder="Enter new password"
        />
        <input
          {...register("confirmPassword")}
          type="text"
          className="w-[250px] outline-none px-2 rounded-md py-1"
          placeholder="Re-Enter new password"
        />
        <button type="submit" className=" bg-blue-500 px-3 py-1 rounded-md">
          Change Password
        </button>
      </form>
    </div>
  );
}

export default New_Password;
