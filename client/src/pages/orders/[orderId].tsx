import Layout from "@/components/Layout";
import Navigation from "@/components/Nav/Navigation";
import {
  createEightStatus,
  createFiveStatus,
  createFourStatus,
  createSecondStatus,
  createSevenStatus,
  createSixStatus,
  createThirdStatus,
  getOrderById,
  updateOrder,
} from "@/lib/orders";
import { getUserById } from "@/lib/users";
import { formatCurrency } from "@/utils/constants";
import { Order, User } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FcDown } from "react-icons/fc";
import {
  MdCancel,
  MdOutlineCancel,
  MdOutlineDeliveryDining,
  MdPayments,
} from "react-icons/md";
import { authOptions } from "../api/auth/[...nextauth]";
import Link from "next/link";
import { HiInboxIn, HiOutlineTruck } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { BsBox } from "react-icons/bs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import {
  AiOutlineFileDone,
  AiOutlineLoading3Quarters,
  AiOutlineMessage,
  AiOutlineStar,
} from "react-icons/ai";
import { RiLoader4Fill, RiTruckLine } from "react-icons/ri";
import { Socket, io } from "socket.io-client";
import { TbInboxOff } from "react-icons/tb";
import moment from "moment";
import { useAppSelector } from "@/redux/hook";
import { CgNotes } from "react-icons/cg";
import { BiMessageRoundedDetail } from "react-icons/bi";
const socket: Socket = io(process.env.NEXT_PUBLIC_BASE_URL as string);

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);
  const { orderId } = query;
  const { order } = await getOrderById({ orderId: orderId as string });
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
      order: order || null,
      user: user || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const OrderDetail: NextPage<{ order: Order; user: User }> = ({
  order,
  user,
}) => {
  const router = useRouter();
  const { isUpdateRealtime } = useAppSelector((state) => state.isSlice);

  useEffect(() => {
    router.replace(router.asPath);
  }, [isUpdateRealtime]);
  const [state, setState] = React.useState<{
    messageOrder: string;
    isOpenMessage: boolean;
    isLoadingAccept: boolean;
    isLoadingReject: boolean
  }>({
    messageOrder: "",
    isOpenMessage: false,
    isLoadingAccept: false,
    isLoadingReject: false
  });
  const { messageOrder, isOpenMessage, isLoadingAccept , isLoadingReject } = state;

  const handleAcceptOrder = React.useCallback(async () => {
    try {
      setState({ ...state, isLoadingAccept: true });
      const { success, message } = await createSecondStatus({
        orderId: order.id!,
      });

      if (success) {
        setState({ ...state, isLoadingAccept: false });
        toast.success(message);
        router.replace(router.asPath);
        socket.emit("updateOrder");
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const handleRejectOrder = React.useCallback(async () => {
    try {
      setState({ ...state, isLoadingReject: true });
      const { success, message } = await createSixStatus({
        orderId: order.id!,
      });

      if (success) {
        setState({ ...state, isLoadingReject: false });
        toast.success(message);
        router.replace(router.asPath);
        socket.emit("updateOrder");
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const handleThirdStatus = React.useCallback(async () => {
    try {
      setState({ ...state, isLoadingAccept: true });
      const { success, message } = await createThirdStatus({
        orderId: order.id!,
      });

      if (success) {
        setState({ ...state, isLoadingAccept: false });
        toast.success(message);
        router.replace(router.asPath);
        socket.emit("updateOrder");
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const handleFourStatus = React.useCallback(async () => {
    try {
      setState({ ...state, isLoadingAccept: true });
      const { success, message } = await createFourStatus({
        orderId: order.id!,
      });

      if (success) {
        setState({ ...state, isLoadingAccept: false });
        toast.success(message);
        router.replace(router.asPath);
        socket.emit("updateOrder");
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const handleTakeGoodSuccess = React.useCallback(async () => {
    try {
      setState({ ...state, isLoadingAccept: true });
      const { success, message } = await createFiveStatus({
        orderId: order.id!,
      });

      if (success) {
        setState({ ...state, isLoadingAccept: false });
        socket.emit("updateOrder");
        router.replace(router.asPath);
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const handleRejectTakeGood = React.useCallback(async () => {
    try {
      if (!messageOrder) {
        toast.error("Vui lòng nhập lý do từ chối nhận hàng");
        return;
      }
      setState({ ...state, isLoadingReject: true });
      await createSevenStatus({
        orderId: order.id!,
      });
      const { success, message } = await updateOrder({
        orderId: order.id!,
        order: {
          message: messageOrder,
        },
      });
      if (success) {
        setState({ ...state, isLoadingReject: false });
        toast.success(message);
        router.replace(router.asPath);
        socket.emit("updateOrder");
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [messageOrder]);
  return (
    <Layout>
      <div className="grid grid-cols-9 m-40 gap-2">
        <Navigation user={user} />
        <div className="col-span-7 space-y-4">
          <div>
            <div className="bg-white shadow-md h-auto space-y-2 p-4 border">
              <div className="bg-gray-200 h-1 flex items-center justify-between mx-12 mb-16 my-4">
                <div
                  className={`${
                    order?.status &&
                    order?.status[order?.status.length - 1].step! > 1 &&
                    "bg-indigo-700"
                  } w-1/3 h-1 flex items-center`}
                >
                  <div
                    className={`${
                      order?.status &&
                      order?.status[order?.status.length - 1].step! >= 1
                        ? "bg-indigo-700 text-white"
                        : "bg-gray-100 text-indigo-700 "
                    } relative h-10 w-10  rounded-full shadow flex items-center justify-center`}
                  >
                    <CgNotes className="text-xl" />
                    <div className="absolute top-[130%] left-[50%] translate-x-[-50%] text-center whitespace-nowrap text-indigo-700 p-1 shadow-lg px-2 text-xs font-bold">
                      <p>{"Đơn hàng đã đặt"}</p>
                      {order.status?.find(({ step }) => step === 1)
                        ?.createdAt && (
                        <p className="font-normal">
                          {moment(
                            order.status?.find(({ step }) => step === 1)
                              ?.createdAt!
                          ).format("HH:mm DD/MM/yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    order?.status &&
                    order?.status[order?.status.length - 1].step! > 2 &&
                    "bg-indigo-700"
                  } w-1/3 h-1 flex items-center`}
                >
                  <div
                    className={`${
                      order?.status?.some(({ step }) => step === 2)
                        ? "bg-indigo-700 text-white"
                        : "bg-gray-100 text-indigo-700 "
                    } relative h-10 w-10  rounded-full shadow flex items-center justify-center`}
                  >
                    {order.status?.some(({ step }) => step === 6) ? (
                      <>
                        <MdCancel className="text-2xl" />
                        <div className="absolute top-[130%] left-[50%] translate-x-[-50%] text-center whitespace-nowrap text-indigo-700 p-1 shadow-lg px-2 text-xs font-bold">
                          <div className="flex space-x-2 items-center">
                            <h1>{"Từ chối đơn hàng"}</h1>
                            <div className="group relative cursor-pointer">
                              <BiMessageRoundedDetail className="text-lg" />
                              <div className="group-hover:scale-100 scale-0 transition-all origin-bottom-right duration-500 ease-in-out absolute top-[-100%] px-4 py-2 right-[100%] bg-white shadow-md">
                                {order.message}
                              </div>
                            </div>
                          </div>
                        </div>
                        {order.status?.find(({ step }) => step === 6)
                          ?.createdAt && (
                          <p className="font-normal">
                            {moment(
                              order.status?.find(({ step }) => step === 6)
                                ?.createdAt!
                            ).format("HH:mm DD/MM/yyyy")}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <MdPayments className="text-2xl" />
                        <div className="absolute top-[130%] left-[50%] translate-x-[-50%] text-center whitespace-nowrap text-indigo-700 p-1 shadow-lg px-2 text-xs font-bold">
                          {"Đã xác nhận thông tin thanh toán"}
                          {order.status?.find(({ step }) => step === 2)
                            ?.createdAt && (
                            <p className="font-normal">
                              {moment(
                                order.status?.find(({ step }) => step === 2)
                                  ?.createdAt!
                              ).format("HH:mm DD/MM/yyyy")}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={`${
                    order?.status &&
                    order?.status[order?.status.length - 1]?.step! > 3 &&
                    "bg-indigo-700"
                  } w-1/3 h-1 flex items-center`}
                >
                  <div
                    className={`${
                      order?.status && order?.status[2]?.step! >= 3
                        ? "bg-indigo-700 text-white"
                        : "bg-gray-100 text-indigo-700 "
                    } relative h-10 w-10  rounded-full shadow flex items-center justify-center`}
                  >
                    <BsBox className="text-2xl" />
                    <div className="absolute top-[130%] left-[50%] translate-x-[-50%] text-indigo-700 text-center whitespace-nowrap p-1 shadow-lg px-2 text-xs font-bold">
                      {"Đang chuẩn bị hàng"}
                      {order.status?.find(({ step }) => step === 3)
                        ?.createdAt && (
                        <p className="font-normal">
                          {moment(
                            order.status?.find(({ step }) => step === 3)
                              ?.createdAt!
                          ).format("HH:mm DD/MM/yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    order?.status &&
                    order?.status[order?.status.length - 1]?.step! > 4 &&
                    "bg-indigo-700"
                  } w-1/3 h-1 flex items-center`}
                >
                  <div
                    className={`${
                      order?.status && order?.status[3]?.step! >= 4
                        ? "bg-indigo-700 text-white"
                        : "bg-gray-100 text-indigo-700 "
                    } relative h-10 w-10  rounded-full shadow flex items-center justify-center`}
                  >
                    <RiTruckLine className="text-2xl" />
                    <div className="absolute top-[130%] left-[50%] translate-x-[-50%] text-indigo-700 text-center whitespace-nowrap p-1 shadow-lg px-2 text-xs font-bold">
                      {"Đã giao cho DVVC"}
                      {order.status?.find(({ step }) => step === 4)
                        ?.createdAt && (
                        <p className="font-normal">
                          {moment(
                            order.status?.find(({ step }) => step === 4)
                              ?.createdAt!
                          ).format("HH:mm DD/MM/yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    (order?.status &&
                      order?.status[order?.status.length - 1]?.step! > 5) ||
                    (order?.status?.some(({ step }) => step === 7) &&
                      "bg-indigo-700")
                  } h-1 flex items-center`}
                >
                  <div
                    className={`${
                      order?.status &&
                      order?.status[order?.status.length - 1]?.step! >= 5
                        ? "bg-indigo-700 text-white"
                        : "bg-gray-100 text-indigo-700"
                    } relative h-10 w-10  rounded-full shadow flex items-center justify-center`}
                  >
                    {order?.status?.some(({ step }) => step === 7) ? (
                      <>
                        <TbInboxOff className="text-2xl" />
                        <div className="absolute top-[130%] left-[50%]translate-x-[-50%] text-center whitespace-nowrap text-indigo-700 p-1 shadow-lg px-2 text-xs font-bold">
                          <div className="flex space-x-2 items-center">
                            <h1>{"Từ chối nhận hàng"}</h1>
                            <div className="group relative cursor-pointer">
                              <BiMessageRoundedDetail className="text-lg" />
                              <div className="group-hover:scale-100 scale-0 transition-all origin-bottom-right duration-500 ease-in-out absolute top-[-100%] px-4 py-2 right-[100%] bg-white shadow-md">
                                {order.message}
                              </div>
                            </div>
                          </div>
                          {order.status?.find(({ step }) => step === 7)
                            ?.createdAt && (
                            <p className="font-normal">
                              {moment(
                                order.status?.find(({ step }) => step === 7)
                                  ?.createdAt!
                              ).format("HH:mm DD/MM/yyyy")}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <HiInboxIn className="text-2xl" />
                        <div className="absolute top-[130%] left-[50%] translate-x-[-50%] text-center whitespace-nowrap text-indigo-700 p-1 shadow-lg px-2 text-xs font-bold">
                          {"Giao hàng thành công"}
                          {order.status?.find(({ step }) => step === 5)
                            ?.createdAt && (
                            <p className="font-normal">
                              {moment(
                                order.status?.find(({ step }) => step === 5)
                                  ?.createdAt!
                              ).format("HH:mm DD/MM/yyyy")}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b pb-4"></div>

              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="flex space-x-2">
                    <h1 className="text-sm">Mã đơn hàng : </h1>
                    <h1 className="text-sm text-gray-600">{order.id}</h1>
                  </div>
                  <div className="flex space-x-2">
                    <h1 className="text-sm">Thời gian đặt hàng : </h1>
                    <h1 className="text-sm text-gray-600">
                      {moment(order?.createdAt!).format("h:mm A DD/MM/yyyy")}
                    </h1>
                  </div>
                </div>
                {user?.isAdmin && (
                  <>
                    {order?.status?.length === 1 && (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAcceptOrder}
                          className="px-4 py-2 bg-green-700 flex items-center space-x-2 text-white text-center rounded-lg hover:bg-opacity-70"
                        >
                          {isLoadingAccept && (
                            <AiOutlineLoading3Quarters className="animate-spin text-white duration-500 ease-linear" />
                          )}
                          <h1>Xác nhận đơn hàng</h1>
                        </button>

                        <button
                          onClick={handleRejectOrder}
                          className="px-4 py-2 bg-red-700 flex items-center space-x-2 text-white text-center rounded-lg hover:bg-opacity-70"
                        >
                          {isLoadingReject && (
                            <AiOutlineLoading3Quarters className="animate-spin text-white duration-500 ease-linear" />
                          )}
                          <h1>Từ chối đơn hàng</h1>
                        </button>
                      </div>
                    )}

                    {order?.status &&
                      order?.status[order.status?.length - 1].step === 2 && (
                        <button
                          onClick={handleThirdStatus}
                          className="px-4 py-2 bg-green-700 flex items-center space-x-2 text-white text-center rounded-lg hover:bg-opacity-70"
                        >
                          {isLoadingAccept && (
                            <AiOutlineLoading3Quarters className="animate-spin text-white duration-500 ease-linear" />
                          )}
                          <h1>Tôi đang chuẩn bị hàng</h1>
                        </button>
                      )}

                    {order.status &&
                      order.status[order.status?.length - 1].step === 3 && (
                        <button
                          onClick={handleFourStatus}
                          className="px-4 py-2 bg-green-700 flex items-center space-x-2 text-white text-center rounded-lg hover:bg-opacity-70"
                        >
                          {isLoadingAccept && (
                            <AiOutlineLoading3Quarters className="animate-spin text-white duration-500 ease-linear" />
                          )}
                          <h1>Đã giao cho DVVC</h1>
                        </button>
                      )}
                  </>
                )}

                {user?.id === order.user?.id && (
                  <>
                    {order.status &&
                      order.status[order?.status?.length - 1].step === 4 && (
                        <div className="relative flex space-x-2">
                          <button
                            onClick={handleTakeGoodSuccess}
                            className="px-4 py-2 bg-green-700 flex items-center space-x-2 text-white text-center rounded-lg hover:bg-opacity-70"
                          >
                            {isLoadingAccept && (
                              <AiOutlineLoading3Quarters className="animate-spin text-white duration-500 ease-linear" />
                            )}
                            <h1>Tôi đã nhận được hàng</h1>
                          </button>
                          <button
                            onClick={() => {
                              isOpenMessage && messageOrder
                                ? handleRejectTakeGood()
                                : setState({ ...state, isOpenMessage: true });
                            }}
                            disabled={isOpenMessage && !messageOrder}
                            className={`${
                              isOpenMessage && !messageOrder
                                ? "cursor-not-allowed bg-opacity-50"
                                : "cursor-pointer"
                            } px-4 py-2 bg-red-700 flex items-center space-x-2 text-white text-center rounded-lg hover:bg-opacity-70`}
                          >
                            {isLoadingReject && (
                              <AiOutlineLoading3Quarters className="animate-spin text-white duration-500 ease-linear" />
                            )}
                            <h1>Từ chối nhận hàng</h1>
                          </button>

                          {isOpenMessage && (
                            <textarea
                              value={messageOrder}
                              onChange={({ target }) =>
                                setState({
                                  ...state,
                                  messageOrder: target.value,
                                })
                              }
                              placeholder="Nhập lý do từ chối nhận hàng"
                              className="absolute top-[150%] outline-none border h-28 p-4 left-0 right-0 w-full"
                            />
                          )}
                        </div>
                      )}
                  </>
                )}
              </div>

              <div className="border-b"></div>

              <div className="w-full space-y-2 h-[80%] overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                {order?.products?.map(({ amount, size, product, id }) => (
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
                          <span className="text-gray-500 line-through lg:text-xs text-[13px] text-center whitespace-nowrap">
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
                        <h1 className="text-sm text-gray-400">Thành tiền :</h1>
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

              <div className="h-[10%] flex justify-between space-x-4 items-center">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-sm text-gray-400">
                      Địa chỉ nhận hàng :
                    </h1>
                    <span className="text-sm text-black">{`${user?.address?.street} , ${user?.address?.wardName} , ${user?.address?.districtName} , ${user?.address?.provinceName}`}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-sm text-gray-400">Tên người nhận:</h1>
                    <span className="text-sm text-black">{`${user?.name}`}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 float-right">
                    <HiOutlineTruck className="text-2xl text-green-500" />
                    <h1 className="text-sm text-black">Phí vận chuyển :</h1>
                    <h1 className="font-semibold text-sm">
                      {formatCurrency({ price: +order?.transportFee! })}
                    </h1>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaRegMoneyBillAlt className="text-xl text-orange-500" />
                    <h1 className=" text-black text-sm">Tổng thanh toán :</h1>
                    <h1 className="font-semibold text-red-500">
                      {formatCurrency({ price: +order?.totalPayment! })}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
