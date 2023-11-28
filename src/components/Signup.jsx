import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { account, database } from "../appwrite/appwriteConfig";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";
import conf from "../conf/conf";

function Signup() {
  // const { handlerFunction } = useContext(userContext);

  const [data, setData] = useState(false);
  const [changeicon, setchangeIcon] = useState(false);

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

  const navigate = useNavigate();

  const storeUserName = async (userID, name) => {
    try {
      const res = await database.createDocument(
        conf.appWriteDatabaseId,
        "6553c7554965890c4929",
        "unique()",
        {
          name: name,
          userId: userID,
        }
      );

      console.log(`Username stored successfully`, res);
    } catch (error) {
      console.error("Error storing user name:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await account.create(
        "unique()",
        data.email,
        data.password,
        data.name
      );
      console.log(`User created successfully`, res);

      // handlerFunction(res.name);
      storeUserName(res.$id, res.name);

      navigate("/login");
    } catch (error) {
      console.log(`Error while creating the user`, error);
    }
  };

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  return (
    <div className="h-[calc(100vh-48px)] bg-gray-500 flex justify-center items-center">
      <form
        className={`flex flex-col rounded-md w-[350px] text-white px-6 py-6 gap-3 bg-gray-600`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold text-xl text-center">Sign Up</h1>
        {errors.name && <p className="text-red-400">{errors.name.message}</p>}
        <input
          {...register("name", { required: "Name is required!" })}
          type="text"
          className="border-2 border-gray-600 w-full rounded-md outline-none text-black px-2 py-1"
          placeholder="Enter your name"
        />

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
