import Layout from "@/components/Layout";
import Logo from "@/components/Logo";
import { createUser } from "@/lib/users";
import { Session, User } from "@/utils/types";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session: Session | null = await getServerSession(req, res, authOptions);

  console.log("session  ", session);

  if (session?.user?.email!) {
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
      session: session || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const SignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState<{
    email: string;
    name: string;
    password: string;
    repeatPassword: string;
  }>({
    email: "",
    name: "",
    password: "",
    repeatPassword: "",
  });
  const { email, name, password, repeatPassword } = form;

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !name || !password || !repeatPassword) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if (password !== repeatPassword) {
        toast.error("Nhập lại mật khẩu không chính xác");
        return;
      }

      if (password.length < 6 || repeatPassword.length < 6) {
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
          repeatPassword: "",
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-center font-bold text-2xl">Đăng ký</h1>
          <div className="bg-white rounded-lg overflow-hidden shadow-md p-8 mt-6">
            <form onSubmit={onSubmitForm}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  value={email}
                  onChange={({ target }) =>
                    setForm({ ...form, email: target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="email"
                >
                  Tên
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="text"
                  value={name}
                  onChange={({ target }) =>
                    setForm({ ...form, name: target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  value={password}
                  onChange={({ target }) =>
                    setForm({ ...form, password: target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="password"
                >
                  Nhập lại Password
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  value={repeatPassword}
                  onChange={({ target }) =>
                    setForm({ ...form, repeatPassword: target.value })
                  }
                />
              </div>

              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
