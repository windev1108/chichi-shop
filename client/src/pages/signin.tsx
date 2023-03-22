import { GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { Session } from "@/utils/types";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  AiFillLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
  import Layout from "@/components/Layout";
import Link from "next/link";

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
    email: string;
    password: string;
    isShowPassword?: boolean;
    isShowLogin?: boolean;
    isRemember?: boolean;
    hasRemember?: boolean;
  }>({
    email: "",
    password: "",
    isShowPassword: false,
    isShowLogin: true,
    isRemember: false,
    hasRemember: false,
  });
  const {  email, password, isShowPassword, isRemember, hasRemember } =
    form;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Vui lòng nhập email");
        return;
      }

      if (!password) {
        toast.error("Vui lòng nhập password");
        return;
      }
      const { ok, error }: any = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (!ok) {
        toast.error(error);
      } else {
        if (isRemember) {
          localStorage.setItem(
            "rememberMe",
            JSON.stringify({
              email,
              password
            })
          );
        }
        toast.success("Đăng nhập thành công");
        router.replace("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

 
  useEffect(() => {
    const rememberData = JSON.parse(localStorage.getItem("rememberMe")!);
    setForm({
      ...form,
      email: rememberData?.email ?? "",
      password: rememberData?.password ?? "",
      hasRemember: Boolean(rememberData),
    });
  }, []);

  return (
    <Layout>
      <div className="h-screen bg-gray-50 overflow-hidden flex justify-center">
        <div className="lg:my-40 lg:w-[30vw] w-screen  flex justify-center bg-white shadow-md border">
          <div className="mt-8 flex flex-col item-items-center w-full lg:p-10 p-4">
            <div className="flex justify-center items-center space-x-2 text-center w-full my-10">
              <AiFillLock className="text-2xl text-green-400" />
              <h1 className="text-2xl font-semibold text-center">Đăng nhập</h1>
            </div>
            <form className="mt-3 w-full" onSubmit={handleSignIn}>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 space-y-2">
                  <label htmlFor="email">Email</label>
                  <input
                    required
                    value={email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Nhập email của bạn"
                    className={`${
                      hasRemember ? "bg-yellow-100" : "bg-transparent"
                    } w-full px-4 py-2 border outline-none`}
                    autoComplete="email"
                  />
                </div>
                <div className="col-span-12">
                  <label htmlFor="password">Mật khẩu</label>
                  <div
                    className={`${
                      hasRemember ? "bg-yellow-100" : "bg-transparent"
                    } flex border items-center`}
                  >
                    <input
                      value={password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      name="password"
                      type={isShowPassword ? "text" : "password"}
                      id="password"
                      placeholder="Nhập mật khẩu của bạn"
                      className={`bg-transparent w-full px-4 py-2 outline-none`}
                      autoComplete="new-password"
                    />
                    <button
                      onClick={() =>
                        setForm({ ...form, isShowPassword: !isShowPassword })
                      }
                      type="button"
                      className="p-2 rounded-full hover:bg-gray-100 w-8 h-8 text-black"
                    >
                      {isShowPassword ? (
                        <AiOutlineEye />
                      ) : (
                        <AiOutlineEyeInvisible />
                      )}
                    </button>
                  </div>
                </div>
                <div className="my-3 w-full flex justify-between col-span-12">
                  <div className="flex space-x-2 w-full items-center">
                    <input
                      checked={isRemember}
                      onChange={() =>
                        setForm({ ...form, isRemember: !isRemember })
                      }
                      className="cursor-pointer"
                      id="forgot"
                      type="checkbox"
                    />
                    <label className="cursor-pointer" htmlFor="forgot">
                      Ghi nhớ tôi?
                    </label>
                  </div>
                  <Link href="forgot">
                    <span className="cursor-pointer hover:underline text-[#1976dE] whitespace-nowrap">
                      Quên mật khẩu?
                    </span>
                  </Link>
                </div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 my-2 w-full px-4 py-2 text-white font-semibold"
                type="submit"
              >
                Đăng nhập
              </button>
              <div className="flex justify-end lg:py-10 py-0">
                <div>
                  <div className="flex justify-center items-center space-x-1">
                    <div>
                      <h1>Bạn chưa có tài khoản ?</h1>
                    </div>
                    <div>
                      <Link
                        href="/signup"
                        className="text-[#1976dE] font-semibold"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
