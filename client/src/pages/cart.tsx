import Layout from "@/components/Layout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import React, { useState, useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import {
  getCart,
  plusCartItem,
  removeProductOutCart,
  takeAwayItem,
  updateCartItem,
} from "@/lib/cart";
import { Cart } from "@/utils/types";
import Image from "next/image";
import {
  AiFillDelete,
  AiOutlineLoading3Quarters,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux/hook";
import { toggleBackdrop, updateCart } from "@/redux/features/isSlice";
import Link from "next/link";
import {
  formatCurrency,
  formatCurrencyWithDiscount,
  formatDiscount,
  formatPriceWithDiscount,
  formatTotalCurrencyWithDiscount,
  sleep,
} from "@/utils/constants";
import { setOrderModal } from "@/redux/features/orderSlice";

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
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [state, setState] = useState<{
    cart: Cart[];
    cartRender: Cart[];
    isLoading: boolean;
    isUpdate: boolean;
  }>({
    cart: [],
    cartRender: [],
    isLoading: false,
    isUpdate: false,
  });
  const { cart, cartRender, isLoading, isUpdate } = state;

  useEffect(() => {
    setState({ ...state, isLoading: false });
    getCart({ userId: session?.user?.id as string }).then(
      ({ cart }: { cart: Cart[] }) => {
        setState({
          ...state,
          cart,
          cartRender: cart.map((item) => {
            return {
              ...item,
              isChecked: cartRender.find(
                ({ product }) => product?.id === item.product?.id!
              )?.isChecked
                ? true
                : false,
            };
          }),
          isLoading: true,
        });
      }
    );
  }, [isUpdate]);

  const updateSizeCart = async ({
    productId,
    sizeId,
  }: {
    productId: string;
    sizeId: string;
  }) => {
    try {
      const { success } = await updateCartItem({
        productId,
        userId: session?.user?.id as string,
        sizeId,
      });
      if (success) {
        setState({ ...state, isUpdate: !isUpdate });
        dispatch(updateCart());
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
      const { success } = await updateCartItem({
        productId,
        userId: session?.user?.id as string,
        amount,
      });
      if (success) {
        setState({ ...state, isUpdate: !isUpdate });
        dispatch(updateCart());
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePlusCartItem = async ({ productId }: { productId: string }) => {
    try {
      const { success } = await plusCartItem({
        productId,
        userId: session?.user?.id as string,
      });
      if (success) {
        setState({ ...state, isUpdate: !isUpdate });
        dispatch(updateCart());
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleTakeAwayCartItem = async ({
    productId,
  }: {
    productId: string;
  }) => {
    try {
      const { success } = await takeAwayItem({
        productId,
        userId: session?.user?.id as string,
      });
      if (success) {
        setState({ ...state, isUpdate: !isUpdate });
        dispatch(updateCart());
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRemoveItem = async ({ productId }: { productId: string }) => {
    const { success } = await removeProductOutCart({
      productId,
      userId: session?.user?.id as string,
    });

    if (success) {
      setState({ ...state, isUpdate: !isUpdate });

      dispatch(updateCart());
    }
  };

  const handleSubmitOrder = React.useCallback(async () => {
    if (cartRender.filter(({ isChecked }) => isChecked).length > 0) {
      dispatch(toggleBackdrop());
      sleep(() => {
        dispatch(
          setOrderModal({
            isOpen: true,
            cart: cartRender.filter(({ isChecked }) => isChecked),
          })
        );
        dispatch(toggleBackdrop());
      }, 1000);
    } else {
      toast.error("Vui lòng chọn sản phẩm để đặt hàng");
    }
  }, [cartRender]);

  return (
    <Layout>
      <div className="relative flex justify-center bg-gray-50 w-full h-screen">
        <div className="bg-white w-[70vw]  my-20 space-y-4">
          <div className="fixed z-[1000] bottom-0 w-[70vw] flex bg-white shadow-lg p-6 border">
            <div className="flex-1 flex items-center space-x-4">
              <input
                checked={cartRender.every(({ isChecked }) => isChecked)}
                onChange={({ target }) => {
                  if (target.checked) {
                    setState({
                      ...state,
                      cartRender: cartRender.map((item) => {
                        return {
                          ...item,
                          isChecked: true,
                        };
                      }),
                    });
                  } else {
                    setState({
                      ...state,
                      cartRender: cartRender.map((item) => {
                        return {
                          ...item,
                          isChecked: false,
                        };
                      }),
                    });
                  }
                }}
                id="selectAll"
                className="w-4 h-4"
                type="checkbox"
              />
              <label htmlFor="selectAll">{`Chọn tất cả (${
                cartRender.filter(({ isChecked }) => isChecked).length
              })`}</label>
            </div>
            <div className="flex space-x-6">
              <div className="flex flex-col space-x-5">
                <div className="flex space-x-2 items-center justify-end">
                  <h1>{`Tổng thanh toán (${
                    cartRender.filter(({ isChecked }) => isChecked).length
                  } sản phẩm): `}</h1>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-bold text-red-500">
                      {formatCurrency({
                        price: cartRender
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
                      })}
                    </h1>
                  </div>
                </div>
                <div className="flex space-x-2 items-center justify-end">
                  <h3>Đã giảm</h3>
                  <h1 className=" text-gray-500 lg:text-xs text-[13px] whitespace-nowrap">
                    {formatCurrency({
                      price: cartRender
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
                    })}
                  </h1>
                </div>
              </div>
              <button
                onClick={handleSubmitOrder}
                type="button"
                className="w-60 hover:bg-blue-500 px-4 py-2 bg-blue-600 text-white"
              >
                Đặt hàng
              </button>
            </div>
          </div>
          {cart.length === 0 ? (
            <div className="flex justify-center items-center my-40">
              {!isLoading ? (
                <div className="flex justify-center items-center">
                  <Image
                    src={require("@/resources/images/empty-cart.png")}
                    alt=""
                    width={500}
                    height={500}
                    className="w-80 h-80 object-contain"
                  />
                </div>
              ) : (
                <AiOutlineLoading3Quarters className="text-4xl text-blue-500 animate-spin duration-500 ease-linear" />
              )}
            </div>
          ) : (
            <>
              <div className="flex bg-white p-4 shadow-md my-4">
                <div className="flex space-x-2 flex-1">
                  <div className="px-2"></div>
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
              <div className="flex flex-col space-y-2 bg-white">
                {cart?.map((item) => (
                  <div
                    key={item?.product?.slug as string}
                    className="flex bg-white p-4 shadow-sm"
                  >
                    <div className="flex space-x-2 flex-1 items-center">
                      <input
                        checked={
                          cartRender.find(
                            ({ product }) => product?.id === item.product?.id
                          )?.isChecked
                            ? true
                            : false
                        }
                        onChange={({ target }) =>
                          setState({
                            ...state,
                            cartRender: [
                              ...cartRender.filter(
                                ({ product }) =>
                                  product?.id !== item?.product?.id
                              ),
                              {
                                ...item,
                                isChecked: target.checked,
                              },
                            ],
                          })
                        }
                        className="w-4 h-4 mr-2 items-center text-center"
                        type="checkbox"
                      />
                      <Link
                        href={`/products/${item?.product?.slug!}`}
                        className="flex space-x-2 items-center"
                      >
                        <Image
                          src={item.product?.files[0].url!}
                          alt=""
                          width={500}
                          height={500}
                          className="w-20 h-20 object-cover"
                        />
                        <h1 className="hover:underline">
                          {item.product?.name!}
                        </h1>
                      </Link>
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
                            formatCurrency({ price: item?.size?.price! })}
                        </span>
                        <h1 className={`text-sm font-bold text-red-500`}>
                          {formatCurrencyWithDiscount({
                            price: item?.size?.price!,
                            discount: item?.product?.discount!,
                          })}
                        </h1>
                      </div>

                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleTakeAwayCartItem({
                              productId: item?.product?.id as string,
                            })
                          }
                          className="flex-1 border w-10 h-10 flex justify-center items-center"
                        >
                          <AiOutlineMinus />
                        </button>
                        <input
                          value={
                            cartRender.find(
                              ({ product }) => product?.id === item.product?.id
                            )?.amount!
                          }
                          onChange={({ target }) => {
                            setState({
                              ...state,
                              cartRender: [
                                ...cartRender.filter(
                                  ({ product }) =>
                                    product?.id !== item?.product?.id!
                                ),
                                {
                                  ...item,
                                  isChecked: cartRender.find(
                                    ({ product }) =>
                                      product?.id === item.product?.id
                                  )?.isChecked
                                    ? true
                                    : false,
                                  amount: parseInt(target.value),
                                },
                              ],
                            });
                          }}
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
                            handlePlusCartItem({
                              productId: item?.product?.id as string,
                            })
                          }
                          className="flex-1 border w-10 h-10 flex justify-center items-center"
                        >
                          <AiOutlinePlus />
                        </button>
                      </div>

                      <div className="items-center">
                        <span className="text-gray-500 line-through lg:text-xs text-[13px] whitespace-nowrap">
                          {item?.product?.discount! > 0 &&
                            formatCurrency({
                              price: item?.size?.price!,
                              amount: item?.amount!,
                            })}
                        </span>
                        <h1 className="text-left text-red-500 font-semibold text-sm">
                          {formatTotalCurrencyWithDiscount({
                            price: item?.size?.price!,
                            amount: item?.amount!,
                            discount: item?.product?.discount!,
                          })}
                        </h1>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveItem({
                            productId: item?.product?.id as string,
                          })
                        }
                        type="button"
                        className="text-sm bg-red-600 text-white p-2 rounded-lg shadow-md hover:scale-110 transition-all duration-300 border"
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
