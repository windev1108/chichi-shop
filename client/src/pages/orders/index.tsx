import Layout from "@/components/Layout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { Order, Session, User } from "@/utils/types";
import { useSession } from "next-auth/react";
import { getOrdersByUser } from "@/lib/orders";
import { getUserById } from "@/lib/users";
import { FiEdit2 } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { IoMdListBox } from "react-icons/io";
import { MdPendingActions } from "react-icons/md";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);
  const { orders } = await getOrdersByUser({ userId: session.user.id });
  const { user } = await getUserById({ id: session.user.id });
  return {
    props: {
      session,
      orders: orders || null,
      user: user || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const Orders: NextPage<{ orders: Order[]; user: User }> = ({
  orders,
  user,
}) => {
  console.log("user", user);
  console.log("orders", orders);
  return (
    <Layout>
      <div className="grid grid-cols-9 m-40 gap-2">
        <div className="col-span-2">
          <div className="flex items-center space-x-4">
            <Image
              src={user?.image?.url!}
              alt=""
              width={500}
              height={500}
              className="object-cover w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-sm font-semibold">{user?.name}</h1>
              <div className="flex items-center">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <FiEdit2 size={16} />
                </button>
                <h1 className="text-sm text-gray-500">Sửa hồ sơ</h1>
              </div>
            </div>
          </div>
          <div className="border-b my-6"></div>

          <div className="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 cursor-pointer">
            <BiUser className="text-xl text-blue-300" />
            <h1 className="text-sm">Tài khoản của tôi</h1>
          </div>

          <div className="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 cursor-pointer">
            <IoMdListBox className="text-xl text-blue-300" />
            <h1 className="text-sm">Đơn hàng của tôi</h1>
          </div>
        </div>

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

          <div>
            {orders.map(
              ({ total, status, products, feeShip, createdAt, id }) => (
                <div className="bg-white shadow-md h-52">
                  {status === "PENDING" && (
                    <div className="flex space-x-2 items-center justify-end">
                      <MdPendingActions className="text-xl text-blue-300" />
                      <h1>Chờ xác nhận</h1>
                    </div>
                  )}

                  <div className="flex h-full">
                      <div className="grid grid-cols-2 h-full">
                           {products?.map(({ product }) => (
                            <Image
                            src={product?.files[0].url as string}
                            alt=""
                            width={500}
                            height={500}
                            className="w-fit h-52 object-cover"
                            />
                           ))}
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
