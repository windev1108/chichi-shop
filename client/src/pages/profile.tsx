import Layout from "@/components/Layout";
import { Session, User } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import React, { useCallback, useState, useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getUserById, updateUser } from "@/lib/users";
import Image from "next/image";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import {
  destroySingleImage,
  genderList,
  uploadSingleImage,
} from "@/utils/constants";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/redux/hook";
import { updateProfile } from "@/redux/features/isSlice";
import { useSession } from "next-auth/react";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session: Session | null = await getServerSession(req, res, authOptions);
  const { id } = query;
  const { user } = await getUserById({ id: id as string });

  return {
    props: {
      user,
      session,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const Profile: NextPage<{ user: User }> = ({ user }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const [state, setState] = useState<{
    name: string;
    email: string;
    password: string;
    address: string;
    phone: number | null;
    gender: string;
    blobFile?: {
      url: string;
      origin: any;
      type: string;
    };
    isShowPassword?: boolean;
    isLoading?: boolean;
  }>({
    name: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    phone: null,
    blobFile: {
      type: "",
      url: "",
      origin: {},
    },
    isShowPassword: false,
    isLoading: false,
  });
  const {
    blobFile,
    name,
    email,
    password,
    address,
    gender,
    phone,
    isShowPassword,
    isLoading,
  } = state;

  useEffect(() => {
    setState({
      name: user.name!,
      address: user.address! || "",
      email: user.email!,
      gender: user.gender! || "",
      password: user.password! || "",
      phone: user.phone! || null,
    });
  }, []);

  const onChangeAvatar = (e: any) => {
    try {
      const file = e?.target?.files[0];
      setState({
        ...state,
        blobFile: {
          origin: file,
          type: file?.type,
          url: URL?.createObjectURL(file),
        },
      });
    } catch (error: any) {
      console.log("msg", error.message);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!name || !password) {
          toast.error("Vui lòng điền thông tin bắt buộc");
          return;
        }

        if (password.length < 6) {
          toast.error("Mật khẩu phải từ 6 kí tự");
          return;
        }

        if (blobFile?.url) {
          setState({ ...state, isLoading: true });
          const file = await uploadSingleImage(blobFile);
          await updateUser({
            id: user?.id!,
            user: {
              name,
              password,
              image: file,
              gender,
              address,
              phone: phone!,
            },
          });
          toast.success("Sửa thông tin thành công");
          dispatch(updateProfile());
          setState({ ...state, isLoading: false });
          router.replace(router.asPath);
          if (user?.image?.publicId) {
            await destroySingleImage(user.image);
          }
        } else {
          setState({ ...state, isLoading: true });
          await updateUser({
            id: user?.id!,
            user: {
              name,
              email,
              password,
              gender,
              address,
              phone: phone!,
            },
          });
          setState({ ...state, isLoading: false });
          toast.success("Sửa thông tin thành công");
          router.replace(router.asPath);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [name, password, address, gender, phone, blobFile]
  );

  return (
    <Layout>
      <div className="p-40 flex justify-center bg-gray-200">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[28rem] space-y-4 border p-8 rounded-lg shadow-md bg-white"
        >
          <div className="flex justify-center items-center">
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <label
                onChange={onChangeAvatar}
                htmlFor="uploadAvatar"
                className="cursor-pointer"
              >
                <input id="uploadAvatar" type="file" hidden />
                {blobFile?.url ? (
                  <Image
                    className="w-32 h-32 rounded-full object-cover"
                    src={blobFile?.url}
                    alt=""
                    width={500}
                    height={500}
                  />
                ) : (
                  <Image
                    className="w-32 h-32 rounded-full object-cover"
                    src={
                      user.image?.url
                        ? user?.image?.url
                        : require("@/resources/images/noAvatar.webp")
                    }
                    alt=""
                    width={500}
                    height={500}
                  />
                )}
              </label>
            ) : (
              <>
                {blobFile?.url ? (
                  <Image
                    className="w-32 h-32 rounded-full object-cover"
                    src={blobFile?.url}
                    alt=""
                    width={500}
                    height={500}
                  />
                ) : (
                  <Image
                    className="w-32 h-32 rounded-full object-cover"
                    src={
                      user.image?.url
                        ? user?.image?.url
                        : require("@/resources/images/noAvatar.webp")
                    }
                    alt=""
                    width={500}
                    height={500}
                  />
                )}
              </>
            )}
          </div>
          <div className="flex flex-col space-y-2 lg:text-base text-sm">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            {status === "authenticated" && session?.user?.id === user.id ? (
              <input
                disabled={true}
                className="cursor-not-allowed outline-none border-[1px] border-gray-300 bg-gray-200 px-4 py-2 rounded-lg lg:text-base text-sm"
                type="email"
                id="email"
                autoComplete="off"
                defaultValue={email}
                placeholder="Nhập email của bạn"
              />
            ) : (
              <h1 className="text-black">{email}</h1>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold" htmlFor="name">
              Tên
              {status === "authenticated" && session?.user?.id === user?.id && (
                <span className="inline-block mx-2 text-xs font-normal text-red-500">
                  (Bắt buộc*)
                </span>
              )}
            </label>
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <input
                className="outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg lg:text-base text-sm"
                type="text"
                id="name"
                autoComplete="off"
                placeholder={`Nhập tên của bạn`}
                value={name}
                onChange={({ target }) =>
                  setState({ ...state, name: target.value })
                }
              />
            ) : (
              <h1 className="text-black">{name}</h1>
            )}
          </div>

          {status === "authenticated" && session?.user?.id === user?.id && (
            <div className="flex flex-col space-y-2 lg:text-base text-sm">
              <label className="font-semibold my-2" htmlFor="password">
                Mật khẩu
                <span className="inline-block mx-2 text-xs font-normal text-red-500">
                  (Bắt buộc*)
                </span>
              </label>
              <div className="flex border px-4 py-2 items-center rounded-lg">
                <input
                  className="outline-none flex-1 border-gray-300 lg:text-base text-sm"
                  type={state.isShowPassword ? "text" : "password"}
                  id="password"
                  autoComplete="off"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={({ target }) =>
                    setState({ ...state, password: target.value })
                  }
                />
                <button
                  type="button"
                  className="text-xl text-black p-1 hover:bg-gray-100 rounded-full"
                  onClick={() =>
                    setState({ ...state, isShowPassword: !isShowPassword })
                  }
                >
                  {state.isShowPassword ? (
                    <AiOutlineEye />
                  ) : (
                    <AiOutlineEyeInvisible />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2 lg:text-base text-sm rounded-lg">
            <label htmlFor="phone" className="font-semibold">
              Số điện thoại
            </label>
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <div className="flex border-[1px]  border-gray-300 rounded-lg">
                <input
                  id="phone"
                  value={phone!}
                  onChange={(e) =>
                    setState({
                      ...state,
                      phone: +e.target.value,
                    })
                  }
                  autoComplete="off"
                  className="py-2 w-full outline-none px-4 rounded-lg"
                  type="number"
                  placeholder={`Nhập số điện thoại của bạn`}
                />
              </div>
            ) : (
              <h1 className="text-black">
                {phone ? phone : "Chưa có số điện thoại"}
              </h1>
            )}
          </div>

          <div className="flex flex-col space-y-2 lg:text-base text-sm rounded-lg">
            <label htmlFor="address" className="font-semibold">
              Địa chỉ
            </label>
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <div className="flex border-[1px]  border-gray-300 rounded-lg">
                <input
                  id="address"
                  value={address!}
                  onChange={(e) =>
                    setState({
                      ...state,
                      address: e.target.value,
                    })
                  }
                  autoComplete="off"
                  className="py-2 w-full outline-none px-4 rounded-lg"
                  type="text"
                  placeholder={`Nhập địa chỉ của bạn`}
                />
              </div>
            ) : (
              <h1 className="text-black">
                {address ? address : "Chưa có địa chỉ"}
              </h1>
            )}
          </div>

          <div className="flex flex-col w-1/2 space-y-2 lg:text-base text-sm">
            <label
              htmlFor="gender"
              className="font-semibold first-letter:uppercase"
            >
              Giới tính
            </label>
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <div className="grid grid-cols-2 order-[1px] w-full border-gray-300  border-[1px] rounded-sm ">
                {genderList.map((item) => (
                  <div
                    key={item}
                    onClick={() =>
                      setState({
                        ...state,
                        gender: item,
                      })
                    }
                    className={`${
                      gender === item
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                    }  flex items-center justify-center space-x-2 cursor-pointer text-center px-4 py-2 border`}
                  >
                    {item === "MALE" ? <BsGenderMale /> : <BsGenderFemale />}
                    <span className="font-semibold lg:block hidden">
                      {item === "MALE" ? "Nam" : "Nữ"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <h1>{gender === "FEMALE" ? "Nữ" : "Nam"}</h1>
            )}
          </div>

          {status === "authenticated" && session?.user?.id === user?.id && (
            <div className="col-span-2 py-2 flex justify-end space-x-2">
              <button
                className={`${
                  isLoading ? "cursor-not-allowed" : "cursor-pointer"
                } border bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600 w-full`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading && (
                  <AiOutlineLoading3Quarters className="inline-block mx-2 animate-spin duration-500 ease-linear " />
                )}
                <span>Lưu</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
