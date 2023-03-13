import Layout from "@/components/Layout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { User } from "@/utils/types";
import { getUserById } from "@/lib/users";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { formatCurrency } from "@/utils/constants";
import Navigation from "@/components/Nav/Navigation";
import { HiInboxIn, HiOutlineTruck } from "react-icons/hi";
import Link from "next/link";
import moment from "moment";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/router";
import { BsBox } from "react-icons/bs";
import { MdDeliveryDining, MdOutlineCancel } from "react-icons/md";
import { RiLoader4Fill } from "react-icons/ri";
import { AiOutlineFileDone } from "react-icons/ai";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);
  const { user }: { user: User } = await getUserById({ id: session?.user?.id });

  if (!session?.user) {
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
      user: user || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const Orders: NextPage<{ user: User }> = ({ user }) => {
  const router = useRouter();
  const { isUpdateRealtime } = useAppSelector((state) => state.isSlice);

  React.useEffect(() => {
    router.replace(router.asPath);
  }, [isUpdateRealtime]);


  return (
    <Layout>
      <div className="grid grid-cols-9 m-40 gap-2 h-screen">
        <Navigation user={user} />
        <div className="col-span-7 space-y-4">
          <div className="flex justify-around shadow-md h-12 items-center">
            <h1>Tất cả</h1>
            <h1>Chờ thanh toán</h1>
            <h1>Vận chuyển</h1>
            <h1>Đang giao</h1>
            <h1>Hoàn thành</h1>
            <h1>Đã Hủy</h1>
            <h1>Trả hàng / Hoàn tiền</h1>
          </div>

          <div className="space-y-4">
            {user?.orders?.map(
              ({
                totalPayment,
                status,
                products,
                transportFee,
                user: userOrder,
                createdAt,
                id,
              }) => (
                <div
                  key={id}
                  className="bg-white shadow-md h-auto space-y-2 p-4 border"
                >
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <div className="flex space-x-2">
                        <h1 className="text-sm">Mã đơn hàng : </h1>
                        <h1 className="text-sm text-gray-600">{id}</h1>
                      </div>
                      <div className="flex space-x-2">
                        <h1 className="text-sm">Trạng thái đơn hàng : </h1>
                        <h1 className="text-sm font-semibold">{status && status[0]?.name!}</h1>
                      </div>
                      <div className="flex space-x-2">
                        <h1 className="text-sm">Thời gian đặt hàng : </h1>
                        <h1 className="text-sm text-gray-600">
                          {moment(createdAt!).format("h:mm A DD/MM/yyyy")}
                        </h1>
                      </div>
                    </div>

                    <Link
                      href={`/orders/${id}`}
                      className="px-4 py-2 shadow-md hover:shadow-lg bg-indigo-700 text-white rounded-lg h-10 flex justify-center items-center"
                    >
                      <h1>Chi tiết đơn hàng</h1>
                    </Link>
                  </div>

                  <div className="border-b"></div>

                  <div className="w-full space-y-2 h-[80%] overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                    {products?.map(({ amount, size, product, id }) => (
                      <div key={id} className="flex space-x-2">
                        <Image
                          src={product?.files[0].url!}
                          alt=""
                          width={500}
                          height={500}
                          className="w-40 h-40  object-cover"
                        />
                        <div className="flex flex-col">
                          <div className="flex">
                            <h1 className="text-sm text-gray-400">
                              {"Tên sản phẩm :"}
                            </h1>
                            <Link
                              href={`/products/${id}`}
                              className="text-black text-sm hover hover:text-blue-600"
                            >
                              {product?.name}
                            </Link>
                          </div>

                          <h1 className="text-sm text-gray-400">{`Phân loại hàng : ${size?.name}`}</h1>

                          <h1 className="text-sm text-gray-400">{`Số lượng : ${amount}`}</h1>

                          <div className="flex space-x-2">
                            <h1 className="text-sm text-gray-400">Đơn giá :</h1>
                            <div className="flex space-x-2 items-center">
                              <span className="text-gray-500 line-through lg:text-xs text-[13px] whitespace-nowrap">
                                {product?.discount! > 0 &&
                                  formatCurrency({
                                    price:
                                      (size?.price! / 100) * product?.discount!,
                                  })}
                              </span>
                              <h1 className="text-sm font-bold text-red-500">
                                {formatCurrency({
                                  price:
                                    size?.price! -
                                    (+size?.price! / 100) * product?.discount!,
                                })}
                              </h1>
                            </div>
                          </div>

                          <div className="flex space-x-2 items-center">
                            <h1 className="text-sm text-gray-400">
                              Thành tiền :
                            </h1>
                            <h1 className="text-sm font-bold text-red-500">
                              {formatCurrency({
                                price:
                                  size?.price! -
                                  (+size?.price! / 100) * product?.discount!,
                                amount,
                              })}
                            </h1>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-b"></div>

                  <div className="h-[10%] flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <h1 className="text-sm text-gray-400">
                          Địa chỉ nhận hàng :
                        </h1>
                        <span className="text-sm text-black">{`${userOrder?.address?.street} , ${userOrder?.address?.wardName} , ${userOrder?.address?.districtName} , ${user?.address?.provinceName}`}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <h1 className="text-sm text-gray-400">
                          Tên người nhận:
                        </h1>
                        <span className="text-sm text-black">{`${userOrder?.name}`}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2 float-right">
                        <HiOutlineTruck className="text-2xl text-green-500" />
                        <h1 className="text-sm text-black">Phí vận chuyển :</h1>
                        <h1 className="font-semibold text-sm">
                          {formatCurrency({ price: transportFee! })}
                        </h1>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaRegMoneyBillAlt className="text-xl text-orange-500" />
                        <h1 className=" text-black text-sm">
                          Tổng thanh toán :
                        </h1>
                        <h1 className="font-semibold text-red-500">
                          {formatCurrency({ price: +totalPayment! })}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
