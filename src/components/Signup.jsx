import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../context/userContext";

function Signup() {
  const [data, setData] = useState(false);
  const [changeicon, setchangeIcon] = useState(false);

  const { signUpHandler } = useUser();

  const navigate = useNavigate();

  const handleIcon = (e) => {
    const userInput = e;
    setData(userInput.length > 0);
  };

  const schema = yup.object().shape({
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

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const res = await signUpHandler(data);

    if (res) {
      console.log("user signed up successfully", res);
      navigate("/login");
    }
  };

  // useEffect(() => {
  //   setFocus("name");
  // }, [setFocus]);

  return (
    <div className="h-[calc(100vh-48px)] bg-gray-500 flex justify-center items-center">
      <form
        className={`flex flex-col rounded-md w-[350px] text-white px-6 py-6 gap-3 bg-gray-600`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold text-xl text-center">Sign Up</h1>

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

        {errors.password && (
          <p className="text-red-400">{errors.password.message}</p>
        )}

        <span className="relative">
          {data === true && (
            <span>
              {changeicon === false ? (
                <AiFillEyeInvisible
                  onClick={() => setchangeIcon((prev) => !prev)}
                  className="absolute text-2xl z-10 top-[50%] translate-y-[-50%] right-[12px] text-black"
                />
              ) : (
                <AiFillEye
                  onClick={() => setchangeIcon((prev) => !prev)}
                  className="absolute top-[50%] translate-y-[-50%] right-[12px] text-2xl z-10 text-black"
                />
              )}
            </span>
          )}

          <input
            {...register("password", {
              required: "Password is required!",
              onChange: (e) => {
                handleIcon(e.target.value);
              },
              pattern: {
                value: /^(?=.*[!@#$%^&*])/,
                message: "Password should contains special characters",
              },
              minLength: {
                value: 8,
                message: "Password should be 8 characters long",
              },
            })}
            className="border-2 border-gray-600 w-full rounded-md outline-none text-black px-2 py-1"
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
