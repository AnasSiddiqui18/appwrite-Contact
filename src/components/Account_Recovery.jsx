import { useForm } from "react-hook-form";
import { useUser } from "../context/userContext";

function Account_Recovery() {
  const { handleRecovery } = useUser();
  const { handleSubmit, register } = useForm();

  const onSubmit = async (data) => {
    const res = await handleRecovery(data);
    console.log(`account recovery response`, res);
  };

  return (
    <div className="bg-gray-500 min-h-[100vh] flex justify-center pt-20">
      <form
        className="py-4 h-[170px] w-[400px] rounded-md bg-gray-800 text-white px-5 flex flex-col gap-2 border-2 border-red-500 items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-2">Reset Password</h1>
        <div className="flex flex-col w-full gap-4 items-start">
          <input
            {...register("email")}
            type="text"
            placeholder="ENTER YOUR EMAIL"
            className="w-[300px] outline-none text-black px-2 py-[2px] rounded-md "
          />

          <button
            type="submit"
            className="bg-[royalBlue] text-white px-2 py-1 rounded-md hover:bg-[#72A0C1] transition-all"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default Account_Recovery;
