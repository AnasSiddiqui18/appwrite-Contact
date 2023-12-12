import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function Login() {
  const [data, setData] = useState(false);
  const [changeicon, setchangeIcon] = useState(false);

  const handleIcon = (e) => {
    const userInput = e;
    setData(userInput.length > 0);
  };

  const { handleLogin, googleLogin, discordLogin, githubLogin } = useUser();

  const schema = yup.object().shape({
    email: yup
      .string("Should be in string")
      .required("Email Is Required!")
      .email("Enter a valid email address"),

    password: yup
      .string("Should be in string")
      .required("Password Is Required!"),
  });

  const {
    handleSubmit,
    register,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-unused-vars
    const userId = await handleLogin(data);
  };

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <div className="h-[calc(100vh-48px)] bg-gray-500 flex flex-col justify-center items-center">
      <form
        className={`flex flex-col rounded-md w-[350px] text-white px-6 py-6 gap-3 bg-gray-600`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold text-xl text-center">Login</h1>

        <p className="text-red-400">{errors.email?.message}</p>
        <input
          {...register("email")}
          id="input"
          type="text"
          className="border-2 border-gray-600 w-full rounded-md outline-none text-black px-2 py-1"
          placeholder="Enter your email"
        />

        <p className="text-red-400">{errors.password?.message}</p>

        <span
          className=" flex flex-row-reverse items-center bg-white rounded-md"
          id="second"
        >
          {data === true && (
            <span className=" mr-[5px]">
              {!changeicon ? (
                <AiFillEyeInvisible
                  onClick={() => setchangeIcon((prev) => !prev)}
                  className="text-2xl text-black "
                />
              ) : (
                <AiFillEye
                  onClick={() => setchangeIcon((prev) => !prev)}
                  className="text-2xl text-black "
                />
              )}
            </span>
          )}

          <input
            {...register("password", {
              onChange: (e) => {
                handleIcon(e.target.value);
              },
            })}
            className="w-full outline-none text-black px-2 py-1 rounded-md"
            placeholder="Enter your password"
            type={!changeicon ? "password" : "text"}
          />
        </span>

        <a href="#" className="w-fit" onClick={() => navigate("/recovery")}>
          {"Forgot Password"}
        </a>
        <button className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-2">
          Login
        </button>

        <div className="flex justify-center gap-10 my-2">
          <img
            src="/images/google.png"
            alt="#"
            className="w-[40px] bg-white p-2 rounded-lg cursor-pointer"
            onClick={googleLogin}
          />
          <img
            src="/images/discord.png"
            alt="#"
            className="w-[40px] bg-white p-2 rounded-lg cursor-pointer"
            onClick={discordLogin}
          />
          <img
            src="/images/github.png"
            alt="#"
            className="w-[40px] bg-white p-2 rounded-lg cursor-pointer"
            onClick={githubLogin}
          />
        </div>

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
