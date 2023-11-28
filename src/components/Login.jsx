import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { account } from "../appwrite/appwriteConfig";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { v4 as uuid } from "uuid";

function Login() {
  const [data, setData] = useState(false);
  const [changeicon, setchangeIcon] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { handleLogin } = useUser();

  const handleIcon = (e) => {
    const userInput = e;
    setData(userInput.length > 0);
  };

  const {
    handleSubmit,
    register,
    setFocus,
    formState: { errors },
  } = useForm();

  // const queryName = async (userId) => {
  //   try {
  //     const { documents } = await database.listDocuments(
  //       conf.appWriteDatabaseId,
  //       "6553c7554965890c4929",
  //       [Query.equal("userId", userId)]
  //     );
  //     const userName = documents[0].name;
  //     handlerFunction(userName);
  //     console.log(`list of the data using the user id`, documents);
  //   } catch (error) {
  //     console.log(`Error while querying the user name`);
  //   }
  // };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await account.createEmailSession(data.email, data.password);
      console.log(`Email session create successfully`, res);

      // queryName(res.userId);

      setTimeout(() => {
        setLoading(false);
        navigate(`/profile/${uuid()}`, {
          state: {
            userId: res.userId,
          },
        });
        handleLogin();
      }, 2000);
      
    } catch (error) {
      console.log(`Error in the login session`, error);
      setError(error.message);
    }
  };

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <div className="h-[calc(100vh-48px)] bg-gray-500 flex flex-col justify-center items-center">
      {loading && !error && <h1 className="text-red-500">Loading...</h1>}

      {error && <p className="text-red-500">{error}</p>}

      <form
        className={`flex flex-col rounded-md w-[350px] text-white px-6 py-6 gap-3 bg-gray-600`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold text-xl text-center">Login</h1>

        {errors.email && <p className="text-red-400">{errors.email.message}</p>}

        <input
          {...register("email", {
            required: "Email is required!",
            pattern: {
              value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
              message: "Enter a valid email address",
            },
          })}
          type="text"
          className="border-2 border-gray-600 w-full rounded-md outline-none text-black px-2 py-1"
          placeholder="Enter your email"
        />

        <span className="relative">
          {data === true && changeicon === false && (
            <AiFillEyeInvisible
              onClick={() => setchangeIcon((prev) => !prev)}
              className="absolute top-[50%] translate-y-[-50%] right-[12px] text-2xl text-black"
            />
          )}

          {data === true && changeicon == true && (
            <AiFillEye
              onClick={() => setchangeIcon((prev) => !prev)}
              className="absolute top-[50%] translate-y-[-50%] right-[12px] text-2xl text-black"
            />
          )}

          {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
          )}

          <input
            {...register("password", {
              required: "Password is required!",
              onChange  : (e) => {
                handleIcon(e.target.value);
              },
            })}
            className="border-2 border-gray-600 w-full rounded-md outline-none text-black px-2 py-1"
            placeholder="Enter your password"
            type={!changeicon ? "password" : "text"}
          />
        </span>

        <a href="#" className="w-fit">
          {"Forgot Password"}
        </a>

        <button className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-md">
          Login
        </button>
        <span href="#" className="w-fit">
          {"Don't have an account? "}{" "}
          <Link to="/signup" className="ml-1 text-orange-300  ">
            Sign Up
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
