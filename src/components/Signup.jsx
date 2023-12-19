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
    setFocus,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const res = await signUpHandler(data);

    console.log("new user details", res.user);

    if (res) {
      console.log("user signed up successfully", res);

      console.log(res.data.user.id);

      navigate(`/login`, {
        state: {
          userId: res.data.user.id,
        },
      });
    }
  };

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

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
