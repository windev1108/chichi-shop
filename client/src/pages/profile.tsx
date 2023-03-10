import Layout from "@/components/Layout";
import { Session, User } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import React, { useCallback, useState, useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getUserById, updateUser } from "@/lib/users";
import Image from "next/image";
import {
  destroySingleImage,
  isValidName,
  isValidPassword,
  isValidPhone,
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
import { getDistrict, getProvince, getWard } from "@/lib/ghn";
import { FiEdit2 } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { IoMdListBox } from "react-icons/io";
import Link from "next/link";
import Navigation from "@/components/Nav/Navigation";

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
      user: user || null,
      session: session || null,
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
    phone: string;
    gender: string;
    provinceId?: number | null;
    provinceName?: string;
    districtId?: number | null;
    districtName?: string;
    wardId?: number | null;
    wardName?: string;
    street?: string;
    listProvince?: any[];
    listDistrict?: any[];
    listWard?: any[];
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
    gender: "",
    phone: "",
    provinceId: null,
    provinceName: "",
    districtName: "",
    districtId: null,
    wardName: "",
    wardId: null,
    street: "",
    listProvince: [],
    listDistrict: [],
    listWard: [],
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
    gender,
    phone,
    provinceId,
    provinceName,
    districtId,
    districtName,
    wardName,
    wardId,
    street,
    listProvince,
    listDistrict,
    listWard,
    isShowPassword,
    isLoading,
  } = state;

  useEffect(() => {
    if (!user.address) {
      getProvince().then(({ data }) => {
        setState({
          name: user.name!,
          email: user.email!,
          gender: user.gender! || "",
          password: user.password! || "",
          phone: `${user.phone!}` || "",
          listProvince: data,
        });
      });
    } else {
      getProvince().then(({ data: listProvince }) => {
        getDistrict({ provinceId: user?.address?.provinceId! }).then(
          ({ data: listDistrict }) => {
            getWard({ districtId: user.address?.districtId! }).then(
              ({ data: listWard }) => {
                setState({
                  name: user.name!,
                  email: user.email!,
                  gender: user.gender! || "",
                  password: user.password! || "",
                  phone: `${user.phone!}` || "",
                  listProvince,
                  listDistrict,
                  listWard,
                  provinceName: user?.address?.provinceName,
                  provinceId: user?.address?.provinceId,
                  districtId: user?.address?.districtId,
                  districtName: user?.address?.districtName,
                  wardId: user?.address?.wardId,
                  wardName: user?.address?.wardName,
                  street: user?.address?.street,
                });
              }
            );
          }
        );
      });
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name || !password) {
        toast.error("Vui l??ng ??i???n th??ng tin b???t bu???c");
        return;
      }
      if (!isValidName(name)) {
        toast.error("T??n ??t nh???t 2 k?? t???");
        return;
      }

      if (!isValidPassword(password)) {
        toast.error("M???t kh???u t??? 8 k?? t??? v?? ??t nh???t 1 s??? v?? 1 k?? t??? ?????c bi???t");
        return;
      }

      if (!isValidPhone(String(phone))) {
        toast.error("S??? ??i???n tho???i kh??ng h???p l???");
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
            phone,
            address: {
              provinceId: provinceId!,
              provinceName: provinceName!,
              districtId: districtId!,
              districtName: districtName!,
              wardId: wardId!,
              wardName: wardName!,
              street: street!,
            },
          },
        });
        toast.success("S???a th??ng tin th??nh c??ng");
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
            phone,
            address: {
              provinceId: provinceId!,
              provinceName: provinceName!,
              districtId: districtId!,
              districtName: districtName!,
              wardId: wardId!,
              wardName: wardName!,
              street: street!,
            },
          },
        });
        setState({ ...state, isLoading: false });
        toast.success("S???a th??ng tin th??nh c??ng");
        router.replace(router.asPath);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-9 m-40 gap-6">
        <Navigation user={user} />
        <form
          onSubmit={handleSubmit}
          className="col-span-7 flex flex-col  space-y-4 p-8 rounded-lg"
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
                      user?.image?.url
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
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <input
                disabled={true}
                className="cursor-not-allowed outline-none border-[1px] border-gray-300 bg-gray-200 px-4 py-2 rounded-lg lg:text-base text-sm"
                type="email"
                id="email"
                autoComplete="off"
                defaultValue={email}
                placeholder="Nh???p email c???a b???n"
              />
            ) : (
              <h1 className="text-black">{email}</h1>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold" htmlFor="name">
              T??n
              {status === "authenticated" && session?.user?.id === user?.id && (
                <span className="inline-block mx-2 text-xs font-normal text-red-500">
                  (B???t bu???c*)
                </span>
              )}
            </label>
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <input
                className="outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg lg:text-base text-sm"
                type="text"
                id="name"
                autoComplete="off"
                placeholder={`Nh???p t??n c???a b???n`}
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
                M???t kh???u
                <span className="inline-block mx-2 text-xs font-normal text-red-500">
                  (B???t bu???c*)
                </span>
              </label>
              <div className="flex border px-4 py-2 items-center rounded-lg">
                <input
                  className="outline-none flex-1 border-gray-300 lg:text-base text-sm"
                  type={state.isShowPassword ? "text" : "password"}
                  id="password"
                  autoComplete="off"
                  placeholder="Nh???p m???t kh???u c???a b???n"
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
              S??? ??i???n tho???i
            </label>
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <div className="flex border-[1px]  border-gray-300 rounded-lg">
                <input
                  id="phone"
                  value={phone!}
                  onChange={({ target }) =>
                    setState({
                      ...state,
                      phone: target.value,
                    })
                  }
                  autoComplete="off"
                  className="py-2 w-full outline-none px-4 rounded-lg"
                  type="number"
                  placeholder={`Nh???p s??? ??i???n tho???i c???a b???n`}
                />
              </div>
            ) : (
              <h1 className="text-black">
                {phone ? phone : "Ch??a c?? s??? ??i???n tho???i"}
              </h1>
            )}
          </div>

          <div className="flex flex-col space-y-2 lg:text-base text-sm rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col space-y-2">
                <label htmlFor="address" className="font-semibold">
                  Th??nh ph???
                </label>
                <select
                  value={JSON.stringify({
                    provinceId,
                    provinceName,
                  })}
                  onChange={async ({ target }) => {
                    const json = JSON.parse(target.value);
                    const { data } = await getDistrict({
                      provinceId: json.provinceId!,
                    });
                    setState({
                      ...state,
                      provinceId: json.provinceId!,
                      provinceName: json.provinceName,
                      listDistrict: data,
                    });
                  }}
                  className="border px-4 py-2 outline-none rounded-lg"
                >
                  <option value={""} hidden>
                    Ch???n th??nh ph???
                  </option>
                  {listProvince?.map((province) => (
                    <option
                      key={province.ProvinceID}
                      value={JSON.stringify({
                        provinceId: province.ProvinceID,
                        provinceName: province.ProvinceName,
                      })}
                    >
                      {province.ProvinceName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="address" className="font-semibold">
                  Qu???n
                </label>
                <select
                  value={JSON.stringify({
                    districtId,
                    districtName,
                  })}
                  disabled={listDistrict?.length === 0}
                  onChange={async ({ target }) => {
                    const json = JSON.parse(target?.value!);
                    const { data } = await getWard({
                      districtId: json.districtId!,
                    });
                    setState({
                      ...state,
                      districtId: json.districtId,
                      districtName: json.districtName!,
                      listWard: data,
                    });
                  }}
                  className={`${
                    !provinceId && "bg-gray-200 cursor-not-allowed"
                  } border px-4 py-2 outline-none rounded-lg`}
                >
                  <option value={""} hidden>
                    Ch???n qu???n
                  </option>
                  {listDistrict?.map((district) => (
                    <option
                      key={district.DistrictID}
                      value={JSON?.stringify({
                        districtId: district.DistrictID!,
                        districtName: district.DistrictName!,
                      })}
                    >
                      {district.DistrictName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="address" className="font-semibold">
                  Ph?????ng / x??
                </label>
                <select
                  disabled={listWard?.length === 0}
                  onChange={({ target }) => {
                    const json = JSON.parse(target.value!);
                    setState({
                      ...state,
                      wardId: json.wardId,
                      wardName: json.wardName,
                    });
                  }}
                  value={JSON.stringify({
                    wardId,
                    wardName,
                  })}
                  className={`${
                    !districtId! && "bg-gray-200 cursor-not-allowed"
                  } border px-4 py-2 outline-none rounded-lg`}
                >
                  <option value={""} hidden>
                    Ch???n ph?????ng / x??
                  </option>
                  {listWard?.map((ward) => (
                    <option
                      key={ward.WardCode}
                      value={JSON.stringify({
                        wardId: +ward.WardCode!,
                        wardName: ward.WardName!,
                      })}
                    >
                      {ward.WardName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="address" className="font-semibold">
                  ???????ng / s??? nh??
                </label>
                <input
                  disabled={wardId ? false : true}
                  value={street}
                  onChange={({ target }) =>
                    setState({ ...state, street: target.value! })
                  }
                  type="text"
                  className={`${
                    !wardId! && "bg-gray-200 cursor-not-allowed"
                  } border px-4 py-2 outline-none rounded-lg h-[37px]`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col w-1/2 space-y-2 lg:text-base text-sm">
            <label
              htmlFor="gender"
              className="font-semibold first-letter:uppercase"
            >
              Gi???i t??nh
            </label>
            {status === "authenticated" && session?.user?.id === user?.id ? (
              <div className="grid grid-cols-3 w-full border-gray-300  px-4 py-2 rounded-sm ">
                <div className="flex space-x-2">
                  <label htmlFor="male">Nam</label>
                  <input
                    defaultChecked={user?.gender === "MALE" ? true : false}
                    onChange={() => setState({ ...state, gender: "MALE" })}
                    id="male"
                    name="gender"
                    type="radio"
                  />
                </div>
                <div className="flex space-x-2">
                  <label htmlFor="female">N???</label>
                  <input
                    defaultChecked={user?.gender === "FEMALE" ? true : false}
                    onChange={() => setState({ ...state, gender: "FEMALE" })}
                    id="female"
                    name="gender"
                    type="radio"
                  />
                </div>
                <div className="flex space-x-2">
                  <label htmlFor="other">Kh??c</label>
                  <input
                    defaultChecked={user?.gender === "OTHER" ? true : false}
                    onChange={() => setState({ ...state, gender: "OTHER" })}
                    id="other"
                    name="gender"
                    type="radio"
                  />
                </div>
              </div>
            ) : (
              <h1>{gender === "FEMALE" ? "N???" : "Nam"}</h1>
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
                <span>L??u</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
