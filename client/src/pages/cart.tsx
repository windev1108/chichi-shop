import Layout from "@/components/Layout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getCart, updateCart } from "@/lib/cart";
import { Cart, Product, Session } from "@/utils/types";
import currencyFormatter from "currency-formatter";
import Image from "next/image";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/404",
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

const CartPage: NextPage = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<Cart[]>([]);
  const [isUpdated, setIsUpdate] = useState<boolean>();

  React.useEffect(() => {
    getCart({ userId: session?.user?.id as string }).then(({ cart }) => {
      setCart(cart);
    });
  }, [isUpdated]);

  const updateSizeCart = async ({
    productId,
    sizeId,
  }: {
    productId: string;
    sizeId: string;
  }) => {
    try {
      const { success } = await updateCart({
        productId,
        userId: session?.user?.id as string,
        sizeId,
      });
      if (success) {
        setIsUpdate(!isUpdated);
        setCart(cart);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateAmountCart = async ({
    productId,
    amount,
  }: {
    productId: string;
    amount: number;
  }) => {
    try {
      const { success } = await updateCart({
        productId,
        userId: session?.user?.id as string,
        amount,
      });
      if (success) {
        setIsUpdate(!isUpdated);
        setCart(cart);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const changeInput = async ({
    productId,
    value,
  }: {
    productId: string;
    value: number;
  }) => {
    const foundIndex = cart.findIndex((item) => item.product?.id === productId);
    cart[foundIndex].amount = +value;
    setCart(cart);
  };

  console.log("cart", cart);
  return (
    <Layout>
      <div className="bg-gray-100 px-60 py-16">
        <h1 className="text-3xl my-10">Giỏ Hàng</h1>
        <div className="flex bg-white p-4 shadow-sm my-4">
          <div className="flex space-x-2 flex-1">
            <input type="checkbox" />
            <h1>Sản phẩm</h1>
          </div>
          <div className="flex flex-1 justify-around">
            <h1>Kích thước</h1>
            <h1>Đơn giá</h1>
            <h1>Số lượng</h1>
            <h1>Số tiền</h1>
            <h1>Thao tác</h1>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          {cart?.map((item) => (
            <div
              key={item?.product?.slug as string}
              className="flex bg-white p-4 shadow-sm"
            >
              <div className="flex space-x-2 flex-1 items-center">
                <input type="checkbox" />
                <div className="flex space-x-2 items-center">
                  <Image
                    src={item.product?.files[0].url!}
                    alt=""
                    width={500}
                    height={500}
                    className="w-20 h-20 object-cover"
                  />
                  <h1>{item.product?.name!}</h1>
                </div>
              </div>
              <div className="flex flex-1 justify-evenly items-center">
                <select
                  onChange={({ target }) =>
                    updateSizeCart({
                      productId: item?.product?.id as string,
                      sizeId: target.value,
                    })
                  }
                  value={item?.size?.id!}
                  className="outline-none border h-10 text-sm w-fit px-2"
                >
                  {item.product?.sizeList.map((size) => (
                    <option key={size.name!} value={size.id}>
                      {size?.name}
                    </option>
                  ))}
                </select>

                <div className="items-center">
                  <span className="text-gray-500 line-through lg:text-xs text-[13px] whitespace-nowrap">
                    {item?.product?.discount! > 0 &&
                      currencyFormatter.format(+item.size?.price!, {
                        code: "VND",
                      })}
                  </span>
                  <h1 className={`text-sm font-bold text-red-500`}>
                    {" "}
                    {currencyFormatter.format(
                      Math.floor(
                        +(
                          +item.size?.price! -
                          (+item.size?.price! / 100) * item?.product?.discount!
                        ) / 10000
                      ) * 10000,
                      {
                        code: "VND",
                      }
                    )}
                  </h1>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      updateAmountCart({
                        productId: item?.product?.id as string,
                        amount: item?.amount! - 1,
                      })
                    }
                    className="flex-1 border w-10 h-10 flex justify-center items-center"
                  >
                    <AiOutlineMinus />
                  </button>
                  <input
                    defaultValue={item.amount}
                    onBlur={({ target }) =>
                      updateAmountCart({
                        amount: parseInt(target.value),
                        productId: item?.product?.id as string,
                      })
                    }
                    className="flex-1 w-10 h-10 border outline-none text-center"
                    type="number"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateAmountCart({
                        productId: item?.product?.id as string,
                        amount: item?.amount! + 1,
                      })
                    }
                    className="flex-1 border w-10 h-10 flex justify-center items-center"
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
                <h1 className="text-left text-red-500 font-semibold text-sm">
                  {currencyFormatter.format(
                    Math.floor(
                      +(
                        +item.size?.price! -
                        (+item.size?.price! / 100) * item?.product?.discount!
                      ) / 10000
                    ) *
                      10000 *
                      item?.amount!,
                    {
                      code: "VND",
                    }
                  )}
                </h1>
                <button
                  type="button"
                  className="text-sm bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-opacity-60"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
