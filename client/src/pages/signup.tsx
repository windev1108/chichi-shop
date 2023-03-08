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
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import { ImPointDown } from "react-icons/im";
import { createUser } from "@/lib/users";
import Logo from "@/components/Logo";
import Layout from "@/components/Layout";
import Link from "next/link";
import { isValidName, isValidPassword, isValidPhone } from "@/utils/constants";

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
    phone: string;
    password: string;
    isShowPassword?: boolean;
  }>({
    name: "",
    email: "",
    password: "",
    phone: "",
    isShowPassword: false,
  });
  const { name, email, password, phone, isShowPassword } = form;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isValidName(name)) {
        toast.error("Họ tên phải lớn hơn 2 kí tự");
        return;
      }

      if (!isValidPassword(password)) {
        toast.error(
          "Mật khẩu phải từ 8 kí tự và có ít nhất 1 kí tự đặc biệt và 1 số"
        );
        return;
      }

      if (!isValidPhone(phone)) {
        toast.error("Số điện thoại không hợp lệ");
        return;
      }

      const { success, message }: any = await createUser({
        email,
        name,
        password,
        phone,
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
          phone: "",
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="h-screen bg-gray-50 overflow-hidden flex justify-center">
        <div className="my-28 lg:w-[30vw] w-[95vw] flex justify-center bg-white shadow-md border">
          <div className="mt-8 flex flex-col item-items-center w-full p-10">
            <div className="flex justify-center items-center space-x-2 text-center w-full my-10">
              <AiFillLock className="text-2xl text-green-400" />
              <h1 className="text-2xl font-semibold text-center">Đăng ký</h1>
            </div>
            <form className="mt-3 w-full" onSubmit={handleSignUp}>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 space-y-2">
                  <label htmlFor="name">Họ tên</label>
                  <input
                    value={name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    name="name"
                    id="name"
                    placeholder="Nhập họ tên  của bạn"
                    className={`bg-gray-50 w-full px-4 py-2 outline-none border`}
                    autoComplete="new-password"
                  />
                </div>
                <div className="col-span-12 space-y-2">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    value={phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    id="phone"
                    type="number"
                    placeholder="Nhập số điện thoại của bạn"
                    className={`bg-gray-50 w-full px-4 py-2 outline-none border`}
                  />
                </div>
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
                    className={`bg-gray-50 w-full px-4 py-2 border outline-none`}
                    autoComplete="email"
                  />
                </div>
                <div className="col-span-12 space-y-2">
                  <label htmlFor="password">Mật khẩu</label>
                  <div className={`flex border items-center`}>
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
                      className={`bg-gray-50  w-full px-4 py-2 outline-none`}
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
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 my-4 w-full px-4 py-2 text-white font-semibold"
                type="submit"
              >
                Đăng ký
              </button>
              <div className="flex justify-end py-10">
                <div>
                  <div className="flex justify-center items-center space-x-1">
                    <div>
                      <h1>Bạn đã có tài khoản ?</h1>
                    </div>
                    <div>
                      <Link
                        href="/signin"
                        className="text-[#1976dE] font-semibold"
                      >
                        Đăng nhập
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
