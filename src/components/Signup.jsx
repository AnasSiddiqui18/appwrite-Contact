import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../context/userContext";

function Signup() {
  const [data, setData] = useState(false);
  const [changeicon, setchangeIcon] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUpHandler } = useUser();

  const navigate = useNavigate();

  const handleIcon = (e) => {
    const userInput = e;
    setData(userInput.length > 0);
  };

  const schema = yup.object().shape({
    name: yup
      .string("Should be in string")
      .required("Email Is Required!")
      .max(10, "Email must be maximum of 60 characters")
      .min(4, "Email must be minimum of 10 characters"),

    email: yup
      .string("Should be in string")
      .required("Email Is Required!")
      .max(60, "Email must be maximum of 60 characters")
      .min(10, "Email must be minimum of 10 characters")
      .email("Enter a valid email address"),

    password: yup
      .string("Should be in string")
      .required("Password Is Required!")
      .min(7, "password must be atleast 7 char long")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain special character"
      ),
  });

  const {
    handleSubmit,
    register,
    setFocus,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await signUpHandler(data);
      if (res) {
        console.log("user signed up successfully", res);
        navigate(`/login`);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in the sign function", error);
    }
  };

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <div className="h-[calc(100vh-48px)] bg-gray-500 flex flex-col justify-center items-center gap-5">
      {loading && (
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}

      <form
        className={`flex flex-col rounded-md w-[350px] text-white px-6 py-6 gap-3 bg-gray-600`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold text-xl text-center">Sign Up</h1>

        {errors.email && <p className="text-red-400">{errors.email.message}</p>}

        <input
          {...register("name", {
            required: "Name is required!",
            pattern: {
              message: "Enter a valid email address",
            },
          })}
          type="text"
          className="border-2 border-gray-600 w-full rounded-md outline-none text-black px-2 py-1"
          placeholder="Enter your email"
        />

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

        {errors.password && (
          <p className="text-red-400">{errors.password.message}</p>
        )}

        <span className=" flex flex-row-reverse items-center bg-white rounded-md">
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

        <button className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-md">
          Sign Up
        </button>
        <span href="#" className="w-fit">
          {"Have an account? "}{" "}
          <Link to="/login" className="ml-1 text-orange-300  ">
            Log In
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Signup;
