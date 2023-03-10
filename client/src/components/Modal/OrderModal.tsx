import { calculateFee, getServicePackage } from "@/lib/ghn";
import { createOrder } from "@/lib/orders";
import { getUserById } from "@/lib/users";
import { toggleBackdrop, toggleUpdateRealtime, updateCart } from "@/redux/features/isSlice";
import { setOrderModal } from "@/redux/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  formatCurrency,
  formatDiscount,
  formatPriceWithDiscount,
  sleep,
} from "@/utils/constants";
import { TransportMethod, User } from "@/utils/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useLayoutEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillCopy,  AiOutlinePlus } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { HiOutlineTruck } from "react-icons/hi";
import { ImLocation } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { MdPayment, MdPayments } from "react-icons/md";
import { io , Socket } from "socket.io-client";
const socket: Socket = io(process.env.NEXT_PUBLIC_BASE_URL as string);

const OrderModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { orderModal } = useAppSelector((state) => state.orderSlice);
  const [state, setState] = useState<{
    methodPayment: number;
    methodTransportId: number | null;
    methodTransportTypeId: number | null;
    user: User | null;
    randomCode: number | null;
    transportFee: number | null;
    methodTransportList: TransportMethod[];
    totalPriceProduct: number | null;
    totalPricePayment: number | null;
    totalDiscounted: number | null;
  }>({
    methodPayment: 0,
    methodTransportId: null,
    randomCode: null,
    transportFee: null,
    methodTransportTypeId: null,
    totalPriceProduct: null,
    totalPricePayment: null,
    totalDiscounted: null,
    user: {},
    methodTransportList: [],
  });
  const {
    user,
    methodPayment,
    methodTransportList,
    randomCode,
    methodTransportId,
    methodTransportTypeId,
    transportFee,
    totalPriceProduct,
    totalPricePayment,
    totalDiscounted,
  } = state;
  const { cart } = orderModal;

  useLayoutEffect(() => {
    getUserById({ id: session?.user?.id as string }).then(
      ({ user }: { user: User }) => {
        if (user.address) {
          getServicePackage({ toDistrictId: user.address.districtId! }).then(
            ({ data }) => {
              setState({
                ...state,
                user,
                methodTransportList: data,
                totalDiscounted: cart
                  .filter(({ isChecked }) => isChecked)
                  .reduce(
                    (acc, current) =>
                      acc +
                      formatDiscount({
                        price: current.size?.price!,
                        discount: current?.product?.discount!,
                        amount: current?.amount!,
                      }),
                    0
                  ),
                totalPriceProduct: cart
                  .filter(({ isChecked }) => isChecked)
                  .reduce(
                    (acc, current) =>
                      acc +
                      formatPriceWithDiscount({
                        price: current?.size?.price!,
                        discount: current?.product?.discount!,
                        amount: current?.amount!,
                      }),
                    0
                  ),
              });
            }
          );
        } else {
          setState({ ...state, user });
        }
      }
    );
  }, []);

  useLayoutEffect(() => {
    setState({ ...state, randomCode: Math.floor(Math.random() * 1000000) });
  }, [methodPayment]);

  useLayoutEffect(() => {
    if (user && methodTransportId) {
      calculateFee({
        amount: orderModal.cart.reduce(
          (acc, curr) => acc + curr?.amount!,
          0
        ) as number,
        serviceId: methodTransportId!,
        serviceTypeId: methodTransportTypeId!,
        toDistrictId: user?.address?.districtId!,
        toWardCode: user?.address?.wardId!,
      }).then(({ data }) => {
        setState({
          ...state,
          transportFee: data.total,
          totalPricePayment:
            Math.floor((+totalPriceProduct! + +data.total) / 1000) * 1000,
        });
      });
    }
  }, [methodTransportId]);

  const handleRedirectProfile = React.useCallback(() => {
    router.replace(`/profile?id=${session?.user?.id}`);
    dispatch(
      setOrderModal({
        isOpen: false,
        cart: [],
      })
    );
  }, []);

  const setCloseModal = React.useCallback(() => {
    dispatch(
      setOrderModal({
        isOpen: false,
        cart: [],
      })
    );
  }, []);

  const handleSubmitOrder = React.useCallback(async () => {
    try {
      if (!user?.address) {
        toast.error("Vui l??ng nh???p ?????a ch??? nh???n h??ng");
        return;
      }

      if (!methodPayment) {
        toast.error("Vui l??ng ch???n ph????ng th???c thanh to??n");
        return;
      }

      if (!methodTransportId) {
        toast.error("Vui l??ng ch???n ph????ng th???c v???n chuy???n");
        return;
      }

      dispatch(toggleBackdrop());
      sleep(async () => {
        const { success } = await createOrder({
          order: {
            userId: user?.id!,
            methodPayment,
            totalPayment: totalPricePayment!,
            transportFee: transportFee!,
            products: cart.map((item) => {
              return {
                productId: item?.product?.id!,
                sizeId: item?.size?.id!,
                amount: item?.amount!,
              };
            }),
          },
        });
        dispatch(toggleBackdrop());
        if (success) {
          toast.success("????n h??ng ???? t???o th??nh c??ng");
          dispatch(
            setOrderModal({
              isOpen: false,
              cart: [],
            })
          );
          socket.emit("updateOrder")
        } else {
          toast.error("????n h??ng ???? t???o th???t b???i");
        }
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [
    methodPayment,
    randomCode,
    cart,
    totalPricePayment,
    totalPriceProduct,
    user,
    methodTransportId,
  ]);
  return (
    <>
      <div
        onClick={setCloseModal}
        className="fixed top-0 left-0 bottom-0 right-0 bg-[#11111170] z-[2000]"
      ></div>
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white w-[80vw] h-[90vh] z-[2001] ">
        <div className="flex justify-between p-4 items-center shadow-md h-[10%]">
          <div className="flex items-center space-x-2">
            <MdPayments className="text-green-600 text-2xl" />
            <h1 className="font-semibold text-black">Thanh to??n</h1>
          </div>
          <button
            onClick={setCloseModal}
            className="p-2 rounded-full hover:bg-gray-100 text-2xl active:scale-105"
            type="button"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="h-[90%] overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 pb-20">
          <div className="border-b"></div>
          <div className="shadow-md">
            <div className="grid grid-cols-10 w-full font-semibold text-black text-sm bg-gray-100 py-3">
              <h1 className="col-span-2 text-center">H??nh ???nh s???n ph???m</h1>
              <h1 className="col-span-3 text-left">T??n s???n ph???m</h1>
              <h1 className="col-span-2 text-left">K??ch th?????c</h1>
              <h1 className="col-span-1 text-left">S??? l?????ng</h1>
              <h1 className="col-span-2 text-center">????n gi??</h1>
            </div>
            <div className="flex flex-col space-y-2">
              {cart?.map((item) => (
                <div className="grid grid-cols-10 border-b items-center text-center text-sm text-black h-36">
                  <div className="col-span-2 text-center">
                    <Image
                      src={item.product?.files[0].url!}
                      alt=""
                      width={500}
                      height={500}
                      className="object-contain h-36"
                    />
                  </div>
                  <h1 className="col-span-3 text-left">
                    {item?.product?.name!}
                  </h1>
                  <h1 className="col-span-2 text-left">{item?.size?.name}</h1>
                  <h1 className="col-span-1 text-left">{item?.amount!}</h1>
                  <h1 className="col-span-2 text-center">
                    {item?.size?.price!}
                  </h1>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-white shadow-md my-6 p-4 mx-4 space-y-2 border">
            <div className="flex items-center space-x-2">
              <ImLocation className="text-gray-400 text-lg" />
              <h1 className="text-black font-semibold">?????a ch??? nh???n h??ng</h1>
            </div>
            {user?.address ? (
              <div className="flex space-x-3 items-center">
                <h1 className="text-black text-sm">{`${user?.address
                  ?.street!}, ${user?.address?.wardName} , ${user?.address
                  ?.districtName!} , ${user?.address?.provinceName}`}</h1>
                <button
                  onClick={handleRedirectProfile}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaEdit className="hover:scale-110 transition-all duration-500 ease-in-out text-lg cursor-pointer text-blue-500" />
                </button>
              </div>
            ) : (
              <div className="flex text-black text-sm items-center space-x-2">
                <h1>Ch??a c?? ?????a ch??? nh???n h??ng</h1>
                <button
                  onClick={handleRedirectProfile}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <AiOutlinePlus className="hover:scale-110 transition-all duration-500 ease-in-out text-lg cursor-pointer text-blue-500" />
                </button>
              </div>
            )}
          </div>

          <div className="mx-4 p-4 border shadow-md bg-white space-y-4  ">
            <div className="flex space-x-2">
              <MdPayment className="text-gray-500 text-lg" />
              <h1 className="font-semibold text-black">
                Ph????ng th???c thanh to??n
              </h1>
            </div>

            <select
              name=""
              id=""
              value={methodPayment}
              onChange={({ target }) =>
                setState({ ...state, methodPayment: +target.value })
              }
              className="border outline-none px-4 py-3 rounded-lg w-1/2"
            >
              <option className="px-4 py-2" value="0" hidden>
                Ch???n ph????ng th???c thanh to??n
              </option>
              <option className="px-4 py-2" value="1">
                Thanh to??n khi nh???n h??ng
              </option>
              <option className="px-4 py-2" value="2">
                Thanh to??n momo
              </option>
            </select>

            {methodPayment === 2 && (
              <div className="flex space-x-4">
                <Image
                  src={require("@/resources/images/momoqr.jpg")}
                  alt=""
                  className="object-contain w-60 h-60"
                  width={500}
                  height={500}
                />
                <div>
                  <div className="flex space-x-2">
                    <h1 className="text-sm text-black">T??n ng?????i nh???n: </h1>
                    <h1 className="font-semibold text-black">
                      Hu???nh L?? Kim Chi
                    </h1>
                  </div>
                  <div className="flex space-x-2">
                    <h1 className="text-sm text-black">S??? ??i???n tho???i: </h1>
                    <h1 className="font-semibold text-black">0969782408</h1>
                  </div>
                  <div className="flex space-x-2">
                    <h1 className="text-sm text-black">
                      N???i dung chuy???n ti???n:{" "}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <h1 className="font-semibold text-black">{`CHICHI_PAYMENT_${randomCode}`}</h1>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `CHICHI_PAYMENT_${randomCode}`
                          );
                          toast.success("Sao ch??p th??nh c??ng");
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <AiFillCopy className="cursor-pointer text-yellow-500 text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <HiOutlineTruck className="text-gray-500 text-xl" />
              <h1 className="font-semibold text-black">
                Ph????ng th???c v???n chuy???n
              </h1>
            </div>

            <select
              onChange={({ target }) =>
                setState({
                  ...state,
                  methodTransportId: JSON.parse(target.value!)
                    .methodTransportId,
                  methodTransportTypeId: JSON.parse(target.value!)
                    .methodTransportTypeId,
                })
              }
              value={JSON.stringify({
                methodTransportId,
                methodTransportTypeId,
              })}
              className="border outline-none px-4 py-3 rounded-lg w-1/2"
            >
              <option value="" hidden>
                Ch???n ph????ng th???c v???n chuy???n
              </option>
              {methodTransportList.map((item) => (
                <option
                  key={item.service_id}
                  value={JSON.stringify({
                    methodTransportId: item.service_id,
                    methodTransportTypeId: item.service_type_id,
                  })}
                >
                  {item.short_name}
                </option>
              ))}
            </select>

            <div className="px-2 border-b"></div>
            <div className="p-2 flex flex-col space-y-1">
              <span>
                T???ng ti???n h??ng
                <h1 className="inline-block mx-2 font-semibold text-black">
                  {`: ${formatCurrency({
                    price: totalPriceProduct!,
                  })}`}
                </h1>
              </span>
              <span>
                ???? gi???m
                <h1 className="inline-block mx-2 font-semibold text-black">
                  {`: ${formatCurrency({
                    price: totalDiscounted!,
                  })}`}
                </h1>
              </span>

              {transportFee && (
                <span>
                  Ph?? v???n chuy???n
                  <h1 className="inline-block mx-2 font-semibold text-black">
                    {`: ${formatCurrency({ price: transportFee! })}`}
                  </h1>
                </span>
              )}

              {transportFee && (
                <span>
                  T???ng thanh to??n
                  <h1 className="inline-block mx-2 font-semibold text-black">
                    {`: ${formatCurrency({
                      price: totalPricePayment!,
                    })}`}
                  </h1>
                </span>
              )}
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={handleSubmitOrder}
                className="px-4 py-2 font-semibold bg-blue-500 text-white w-1/2 rounded-lg hover:bg-blue-600"
              >
                ?????t h??ng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(OrderModal);
