import { createOrder } from "@/lib/orders";
import { getUserById } from "@/lib/users";
import { setOrderModal } from "@/redux/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  formatCurrency,
  formatCurrencyWithDiscount,
  formatDiscount,
  formatPriceWithDiscount,
} from "@/utils/constants";
import { User } from "@/utils/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillCopy, AiFillPlusCircle, AiOutlinePlus } from "react-icons/ai";
import { ImLocation } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { MdPayment, MdPayments } from "react-icons/md";

const OrderModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { orderModal } = useAppSelector((state) => state.orderSlice);
  const [state, setState] = useState<{
    methodPayment: number;
    user: User | null;
    randomCode: number | null;
  }>({
    methodPayment: 0,
    randomCode: null,
    user: {},
  });
  const { user, methodPayment, randomCode } = state;
  const { cart } = orderModal;

  useEffect(() => {
    getUserById({ id: session?.user?.id as string }).then(({ user }) =>
      setState({ ...state, user })
    );
  }, []);

  useEffect(() => {
    setState({ ...state, randomCode: Math.floor(Math.random() * 1000000) });
  }, [methodPayment]);

  const handleRedirectProfile = React.useCallback(() => {
    router.replace(`/profile?id=${session?.user?.id}`);
    dispatch(
      setOrderModal({
        isOpen: false,
        cart: [],
      })
    );
  }, []);

  console.log("state ", state);
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
      if (!methodPayment) {
        toast.error("Vui lòng chọn phương thức thanh toán");
        return;
      } 


      const { success } = await createOrder({
        order: {
          
        }
      })
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [methodPayment, randomCode, cart]);
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
            <h1 className="font-semibold text-black">Thanh toán</h1>
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
              <h1 className="col-span-2 text-center">Hình ảnh sản phẩm</h1>
              <h1 className="col-span-3 text-left">Tên sản phẩm</h1>
              <h1 className="col-span-2 text-left">Kích thước</h1>
              <h1 className="col-span-1 text-left">Số lượng</h1>
              <h1 className="col-span-2 text-center">Đơn giá</h1>
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
              <h1 className="text-black font-semibold">Địa chỉ nhận hàng</h1>
            </div>
            {user?.address ? (
              <h1 className="text-black text-sm">{user?.address}</h1>
            ) : (
              <div className="flex text-black text-sm items-center space-x-2">
                <h1>Chưa có địa chỉ nhận hàng</h1>
                <button
                  onClick={handleRedirectProfile}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <AiOutlinePlus />
                </button>
              </div>
            )}
          </div>

          <div className="mx-4 p-4 border shadow-md bg-white space-y-4  ">
            <div className="flex space-x-2">
              <MdPayment className="text-gray-500 text-lg" />
              <h1 className="font-semibold text-black">
                Phương thức thanh toán
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
              <option className="px-4 py-2" value="0" hidden>Chọn phương thức thanh toán</option>
              <option className="px-4 py-2" value="1">Thanh toán khi nhận hàng</option>
              <option className="px-4 py-2" value="2">Thanh toán momo</option>
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
                    <h1 className="text-sm text-black">Tên người nhận: </h1>
                    <h1 className="font-semibold text-black">
                      Huỳnh Lê Kim Chi
                    </h1>
                  </div>
                  <div className="flex space-x-2">
                    <h1 className="text-sm text-black">Số điện thoại: </h1>
                    <h1 className="font-semibold text-black">0969782408</h1>
                  </div>
                  <div className="flex space-x-2">
                    <h1 className="text-sm text-black">
                      Nội dung chuyển tiền:{" "}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <h1 className="font-semibold text-black">{`CHICHI_PAYMENT_${randomCode}`}</h1>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `CHICHI_PAYMENT_${randomCode}`
                          );
                          toast.success("Sao chép thành công");
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

            <div className="px-2 border-b"></div>
            <div className="p-2 flex flex-col space-y-1">
              <span>
                Tổng tiền hàng
                <h1 className="inline-block mx-2 font-semibold text-black">
                  {`: ${formatCurrency({
                    price:
                      (cart
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
                        ) /
                        10000) *
                      10000,
                  })}`}
                </h1>
              </span>
              <span>
                Đã giảm
                <h1 className="inline-block mx-2 font-semibold text-black">
                  {`: ${formatCurrency({
                    price: cart
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
                  })}`}
                </h1>
              </span>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={handleSubmitOrder}
                className="px-4 py-2 font-semibold bg-blue-500 text-white w-1/2 rounded-lg hover:bg-blue-600"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(OrderModal);
