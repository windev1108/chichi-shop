import { GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { Session } from "@/utils/types";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import { ImPointDown } from "react-icons/im";
import { createUser } from "@/lib/users";
import Logo from "@/components/Logo";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session: Session | null = await getServerSession(req, res, authOptions);
  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
      props: {},
    };
  }

  return {
    props: {
      session,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const SignIn = () => {
  const router = useRouter();
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    isShowPassword?: boolean;
    isShowLogin?: boolean;
    isRemember?: boolean;
    rememberData?: {
      email: string;
      password: string;
    };
  }>({
    name: "",
    email: "",
    password: "",
    isShowPassword: false,
    isShowLogin: true,
    isRemember: false,
    rememberData: {
      email: "",
      password: "",
    },
  });
  const {
    name,
    email,
    password,
    isShowPassword,
    isShowLogin,
    isRemember,
    rememberData,
  } = form;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Vui lòng nhập email");
      } else if (!password) {
        toast.error("Vui lòng nhập password");
      } else {
        const { ok, error }: any = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (!ok) {
          toast.error(error);
        } else {
          if (isRemember) {
            localStorage.setItem(
              "rememberMe",
              JSON.stringify({ email, password })
            );
          }
          toast.success("Đăng nhập thành công");
          router.replace("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !name || !password) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }
      if (password.length < 6) {
        toast.error("Mật khẩu phải từ 6 kí tự");
        return;
      }
      const { success, message }: any = await createUser({
        email,
        name,
        password,
      });

      if (!success) {
        toast.error(message);
        return;
      } else {
        const { ok, error }: any = await signIn("credentials", {
          redirect: false,
          callbackUrl: "/",
          email,
          password,
        });
        if (!ok) {
          toast.error(error);
        } else {
          toast.success("Đăng ký tài khoản thành công");
          router.replace("/");
        }
        setForm({
          email: "",
          name: "",
          password: "",
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const rememberData = JSON.parse(localStorage.getItem("rememberMe")!);
    setForm({
      ...form,
      email: rememberData?.email,
      password: rememberData?.password,
    });
  }, []);

  return (
    <div className="bg-gray-100  min-h-screen flex items-center justify-center">
      <div
        className={`${
          !isShowLogin ? "right-panel-active" : ""
        } container border bg-white lg:!rounded-[25px] !rounded-none shadow-lg relative overflow-hidden lg:w-[768px] lg:min-h-full lg:h-[660px] h-screen max-w-full`}
      >
        <div className="form-container register-container">
          <form
            onSubmit={handleSignUp}
            className="flex bg-white items-center justify-center flex-col py-0 px-[50px] h-full text-center"
          >
            <div className="flex justify-center">
              <Logo />
            </div>
            <h1 className="text-2xl font-[700] leading-[-1.5px] m0 mb-[15px]">
              Đăng ký
            </h1>
            <input
              value={name}
              onChange={({ target }) =>
                setForm({ ...form, name: target.value })
              }
              className="outline-none bg-[#eee] rounded-[10px] border-none py-[12px] px-[15px] my-[8px] mx-0 w-full"
              type="text"
              placeholder="Tên"
            />
            <input
              value={email}
              onChange={({ target }) =>
                setForm({ ...form, email: target.value })
              }
              className="outline-none bg-[#eee] rounded-[10px] border-none py-[12px] px-[15px] my-[8px] mx-0 w-full"
              type="email"
              placeholder="Email"
            />
            <div className="flex rounded-[10px] bg-[#eee] items-center w-full">
              <input
                value={password}
                onChange={({ target }) =>
                  setForm({ ...form, password: target.value })
                }
                className="flex-1 outline-none bg-transparent rounded-[10px] border-none py-[12px] px-[15px] mx-0 w-full"
                type={isShowPassword ? "text" : "password"}
                placeholder="Mật khẩu"
              />
              <button
                onClick={() =>
                  setForm({ ...form, isShowPassword: !isShowPassword })
                }
                type="button"
                className="p-1 hover:bg-gray-100 rounded-full active:scale-105 mr-2"
              >
                {isShowPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            <button
              type="submit"
              className="relative rounded-[20px] border-[1px] border-[#4bb6b7] bg-[#4bb6b7] text-white text-[15px] font-[700] m-[10px] py-[12px] px-[80px] tracking-[1px] capitalize transition-all duration-[.3s] ease-in-out hover:tracking-[3px] active:scale-[.95] focus:outline-none"
            >
              Đăng ký
            </button>
            <span className="text-sm font-semibold">
              hoặc sử dụng tài khoản của bạn
            </span>
            <div className="flex items-center space-x-2 pt-10">
              <Image
                src={require("@/resources/images/facebook.webp")}
                alt=""
                width={100}
                height={100}
                className="w-6 h-6 object-cover cursor-pointer"
              />
              <Image
                src={require("@/resources/images/google.png")}
                alt=""
                width={100}
                height={100}
                className="w-8 h-8 object-cover cursor-pointer"
              />
            </div>
          </form>
        </div>

        <div className="form-container login-container">
          <form
            onSubmit={handleSignIn}
            className="flex bg-white items-center justify-center flex-col py-0 lg:px-[50px] px-2 h-full text-center"
          >
            <div className="flex justify-center">
              <Logo />
            </div>
            <h1 className="lg:text-2xl text-lg font-[700] leading-[-1.5px] m0 mb-[15px]">
              Đăng nhập
            </h1>
            <input
              value={email}
              onChange={({ target }) =>
                setForm({ ...form, email: target.value })
              }
              className="outline-none bg-[#eee] rounded-[10px] border-none py-[12px] px-[15px] my-[8px] mx-0 w-full"
              type="email"
              placeholder="Email"
            />
            <div className="flex rounded-[10px] bg-[#eee] items-center w-full">
              <input
                value={password}
                onChange={({ target }) =>
                  setForm({ ...form, password: target.value })
                }
                className="flex-1 outline-none bg-transparent rounded-[10px] border-none py-[12px] px-[15px] mx-0 w-full"
                type={isShowPassword ? "text" : "password"}
                placeholder="Mật khẩu"
              />
              <button
                onClick={() =>
                  setForm({ ...form, isShowPassword: !isShowPassword })
                }
                type="button"
                className="p-1 hover:bg-gray-100 rounded-full active:scale-105 mr-2"
              >
                {isShowPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>

            <div className="flex w-full h-[50px] items-center justify-between">
              <div className="flex items-center justify-center whitespace-nowrap text-sm">
                <input
                  checked={isRemember}
                  onChange={({ target }) =>
                    setForm({ ...form, isRemember: target.checked })
                  }
                  className="w-[12px] h-[12px]"
                  type="checkbox"
                  name="checkbox"
                  id="remember"
                />
                <label
                  className="text-[14px] select-none pl-[5px]"
                  htmlFor="remember"
                >
                  Ghi nhớ tôi
                </label>
              </div>
              <div className="pass-link">
                <a href="#" className="hover:text-[#4bb6b7] lg:text-sm text-xs whitespace-nowrap">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <button className="relative rounded-[20px] border-[1px] border-[#4bb6b7] bg-[#4bb6b7] text-white text-[15px] font-[700] hover:scale-x-110 m-[10px] py-[12px] px-[80px] tracking-[1px] capitalize transition-all duration-[.3s] ease-in-out hover:tracking-[1px] active:scale-[.95] focus:outline-none">
              Đăng nhập
            </button>
            <span className="text-sm font-semibold">
              hoặc sử dụng tài khoản của bạn
            </span>
            <div className="flex items-center space-x-2 pt-10">
              <Image
                src={require("@/resources/images/facebook.webp")}
                alt=""
                width={100}
                height={100}
                className="w-6 h-6 object-cover cursor-pointer"
              />
              <Image
                src={require("@/resources/images/google.png")}
                alt=""
                width={100}
                height={100}
                className="w-8 h-8 object-cover cursor-pointer"
              />
            </div>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay relative">
            <Image
              className="absolute top-0 right-0 bottom-0 left-0 object-cover"
              width={1000}
              height={1000}
              alt=""
              src={require("@/resources/images/background.gif")}
            />
            <div className="overlay-panel overlay-left">
              <h1 className="text-[45px] leading-[45px] font-[700] m-0 mb-[15px]">
                Chào <br /> bạn
              </h1>
              <p>
                Nếu bạn chưa có tài khoản , đăng nhập ở đây{" "}
                <ImPointDown className="inline text-black" />{" "}
              </p>
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    isShowLogin: true,
                    email: "",
                    name: "",
                    password: "",
                  })
                }
                id="login"
                className="group border-2 border-white  relative rounded-[20px] text-white text-[15px] font-[700] m-[10px] py-[12px] px-[80px] tracking-[1px] capitalize transition-all duration-[.3s] ease-in-out hover:tracking-[3px] active:scale-[.95] focus:outline-none"
              >
                Đăng nhập
                <HiOutlineArrowNarrowRight className="group-hover:opacity-100 group-hover:right-[20%] top-[35%] right-[50%]  absolute opacity-0 transition-all duration-[.3s] ease-in-out" />
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="text-[45px] leading-[45px] font-[700] m-0 mb-[15px]">
                Đăng ký <br />
              </h1>
              <p className="text-[14px] font-[100px] leading-[20px] tracking-[.5px] mt-[20px] mx-0 mb-[30px]">
                nếu bạn chưa có tài khoản hãy đăng ký ở đây{" "}
                <ImPointDown className="inline text-black" />
              </p>
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    isShowLogin: false,
                    email: "",
                    name: "",
                    password: "",
                  })
                }
                className="group border-2 border-white  relative rounded-[20px] text-white text-[15px] hover:scale-x-110 font-[700] m-[10px] py-[12px] px-[80px] tracking-[1px] capitalize transition-all duration-[.3s] ease-in-out hover:tracking-[3px] active:scale-[.95] focus:outline-none"
                id="register"
              >
                Đăng ký
                <HiOutlineArrowNarrowLeft className="group-hover:opacity-100 group-hover:left-[20%] top-[35%] left-[50%]  absolute opacity-0 transition-all duration-[.3s] ease-in-out" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
