import Link from "next/link";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineClear,
} from "react-icons/ai";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import Logo from "@/components/Logo";
import { useSession, signOut } from "next-auth/react";
import { FaBars, FaStore } from "react-icons/fa";
import { Product, User } from "@/utils/types";
import Image from "next/image";
import currencyFormatter from "currency-formatter";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import useDebounce from "@/utils/hook/useDebounce";
import { getProductsByKeywords } from "@/lib/products";
import { useRouter } from "next/router";
import { getUserById } from "@/lib/users";
import { toggleNavbarMobile, updateCart } from "@/redux/features/isSlice";
import { clearCart } from "@/lib/cart";
import { IoMdListBox } from "react-icons/io";
import { formatCurrency } from "@/utils/constants";
import { MdDeliveryDining, MdOutlineCancel } from "react-icons/md";
import { BsBox } from "react-icons/bs";
import { HiInboxIn } from "react-icons/hi";
import moment from "moment";

const Header = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [keyword, setKeywords] = useState<string>("");
  const [foundProducts, setFoundProducts] = useState<Product[]>([]);
  const debounceKeywords = useDebounce(keyword, 300);
  const { isUpdatedCard, isUpdateProfile, isUpdateRealtime } = useAppSelector(
    (state) => state.isSlice
  );
  const [user, setUser] = useState<User | null>({});

  useEffect(() => {
    if (debounceKeywords) {
      getProductsByKeywords({ keyword: debounceKeywords }).then(
        ({ products }) => setFoundProducts(products)
      );
    } else {
      setFoundProducts([]);
    }
  }, [debounceKeywords]);

  useLayoutEffect(() => {
    if (session?.user?.id) {
      getUserById({ id: session?.user?.id as string }).then(({ user }) =>
        setUser(user)
      );
    }
  }, [isUpdateProfile, isUpdatedCard, isUpdateRealtime]);

  const handleSubmitSearch = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!keyword) {
          return;
        }
        setKeywords("");
        router.replace(`/search?keyword=${keyword}`);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [keyword]
  );

  const handleClearCart = async () => {
    try {
      if (status === "authenticated") {
        const { message, success } = await clearCart({
          userId: user?.id as string,
        });
        dispatch(updateCart());
        if (success) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Vui lòng đăng nhập");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignOut = React.useCallback(() => {
    try {
      signOut({ redirect: true });
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0  left-0 bg-white flex w-full space-x-2 h-[64px] items-center lg:px-40 px-2 shadow-md border z-[500]`}
    >
      <div className="flex lg:flex-1 flex-0 items-center text-black h-[40px]">
        <Logo />
        <div className="lg:flex hidden lg:ml-20 ml-0 flex-1 space-x-4 font-semibold">
          <div className="group relative">
            <h1>Sản phẩm</h1>
            <div className="group-hover:scale-100 scale-0 transition-all duration-500 origin-top-left ease-in-out absolute top-[100%] left-0 bg-white shadow-md border p-4 w-48 h-auto">
              <Link
                className="relative after:absolute after:origin-center after:transition-all after:duration-300 after:ease-in-out hover:after:scale-x-100 after:scale-x-0 after:w-full after:top-[100%] after:border-b-[2px] after:border-black"
                href="/products"
              >
                <p>Vòng tay</p>
              </Link>
              <Link
                className="relative after:absolute after:origin-center after:transition-all after:duration-300 after:ease-in-out hover:after:scale-x-100 after:scale-x-0 after:w-full after:top-[100%] after:border-b-[2px] after:border-black"
                href="/materials"
              >
                <p>Nguyên liệu</p>
              </Link>
            </div>
          </div>
          <Link
            className="relative after:absolute after:origin-center after:transition-all after:duration-300 after:ease-in-out hover:after:scale-x-100 after:scale-x-0 after:w-full after:top-[100%]  after:border-b-[2px] after:border-black"
            href="#contact"
          >
            <p>Liên hệ</p>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 justify-end space-x-3">
        <div className="group relative hover:flex-1 lg:flex-1 flex-0">
          <form
            onSubmit={handleSubmitSearch}
            className="flex justify-center group-hover:w-full origin-right lg:w-full w-10 h-10 transition-all duration-500 ease-in-out rounded-full bg-gray-200 items-center p-1 text-black"
          >
            <input
              value={keyword}
              onChange={({ target }) => setKeywords(target.value)}
              placeholder="Tìm sản phẩm ở đây..."
              className="group-hover:block lg:block hidden lg:text-sm text-xs placeholder:text-xs px-4 outline-none lg:placeholder:text-sm w-full bg-transparent"
              type="text"
            />
            <button
              type="submit"
              className="active:animate-spin p-2 rounded-full hover:bg-gray-100"
            >
              <AiOutlineSearch className="text-base text-black" />
            </button>
          </form>

          {foundProducts.length > 0 && (
            <div className="lg:flex hidden absolute top-[110%] z-[100] left-0 right-0 max-h-[30rem] flex-col scrollbar-thin bg-white shadow-md border overflow-y-scroll scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {foundProducts?.map((product) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product.id as string}
                  className="flex h-[5rem] items-center space-x-2 hover:bg-gray-100 cursor-pointer border"
                >
                  <Image
                    className="lg:block hidden object-cover w-fit h-full"
                    src={product?.files[0].url}
                    alt=""
                    width={100}
                    height={100}
                  />
                  <div className="flex flex-col">
                    <h1 className="font-[500] text-sm text-black">
                      {product.name}
                    </h1>
                    <span className="text-gray-500 line-through text-sm">
                      {product?.discount! > 0 &&
                        currencyFormatter.format(product.sizeList[0].price!, {
                          code: "VND",
                        })}
                      <h1
                        className={`${
                          product?.discount! > 0 && "mx-2"
                        } font-bold inline-block text-red-500`}
                      >
                        {" "}
                        {currencyFormatter.format(
                          product.sizeList[0].price! -
                            (product.sizeList[0].price! / 100) *
                              product.discount!,
                          {
                            code: "VND",
                          }
                        )}
                      </h1>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="lg:flex hidden  flex-1 items-center space-x-56 justify-end">
          <div className="flex space-x-6 items-center text-2xl text-black">
            {status === "authenticated" && (
              <div className="group relative z-[100]">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <IoMdListBox className="text-blue-400" />
                </button>
                <div
                  className={`${
                    user?.orders?.length! > 0 ? "scale-100" : "scale-0"
                  } transition-all duration-500 ease-in-out absolute top-[0%] right-[-20%] rounded-full bg-red-500 shadow-md w-5 h-5 flex justify-center items-center`}
                >
                  <h1 className="text-semibold text-white text-xs">
                    {user?.orders?.length}
                  </h1>
                </div>

                <div className="group-hover:block hidden absolute top-[100%] right-0 after:absolute after:top-[-15%] after:right-0 after:left-0 after:h-4 after:bg-transparent ">
                  <div className="w-[28rem] border flex flex-col bg-white shadow-md max-h-[20rem] overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
                    <div className="flex justify-between px-4 items-center py-2 border-b-2">
                      <Link
                        href="/orders"
                        className="flex space-x-2 items-center cursor-pointer"
                      >
                        <IoMdListBox className="text-blue-400" />
                        <h1 className="text-sm">Đơn hàng</h1>
                      </Link>
                    </div>
                    {user?.orders?.length === 0 ? (
                      <Image
                        className="w-full h-[15rem]"
                        width={500}
                        height={500}
                        alt=""
                        src={require("@/resources/images/empty-cart.png")}
                      />
                    ) : (
                      <div className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        {user?.orders?.map((item) => (
                          <Link
                            href={`/orders/${item.id}`}
                            key={item.id as number}
                            className="relative flex justify-start text-sm items-center  hover:bg-gray-100 cursor-pointer p-2 h-24 border-b"
                          >
                            <div className="absolute top-0 right-3">
                                <h1>{moment(item.createdAt).format("HH:mm DD/MM/yyyy")}</h1>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex w-full space-x-2 whitespace-nowrap">
                                <h2>Mã đơn hàng :</h2>
                                <h1 className="text-sm font-semibold">
                                  {item.id}
                                </h1>
                              </div>
                              <div className="flex w-full space-x-2">
                                <h2>Trạng thái :</h2>
                                <h1>
                                  {item?.status &&
                                    item?.status[item.status?.length - 1].name}
                                </h1>
                              </div>
                              <div className="flex w-full space-x-2">
                                <h2>Số lượng :</h2>
                                <h1 className="text-sm font-semibold">
                                  {item.products?.reduce(
                                    (acc, curr) => acc + curr.amount,
                                    0
                                  )}
                                </h1>
                              </div>
                              <div className="flex w-full space-x-2">
                                <h2>Tổng thanh toán :</h2>
                                <h1 className="text-sm font-semibold">
                                  {formatCurrency({
                                    price: item.totalPayment!,
                                  })}
                                </h1>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {status === "authenticated" && (
              <div className="group relative z-[100]">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <AiOutlineShoppingCart />
                </button>
                <div
                  className={`${
                    user?.cart?.length! > 0 ? "scale-100" : "scale-0"
                  } transition-all duration-500 ease-in-out absolute top-[0%] right-[-20%] rounded-full bg-red-500 shadow-md w-5 h-5 flex justify-center items-center`}
                >
                  <h1 className="text-semibold text-white text-xs">
                    {user?.cart?.length}
                  </h1>
                </div>
                <div className="group-hover:block hidden absolute top-[100%] right-0 after:absolute after:top-[-5%] after:right-0 after:left-0 after:h-4 after:bg-transparent ">
                  <div className="w-[28rem] border flex flex-col bg-white shadow-md max-h-[20rem] overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
                    <div className="flex justify-between px-4 items-center py-1 border-b-2">
                    <Link
                        href="/cart"
                        className="flex space-x-2 items-center cursor-pointer"
                      >
                        <AiOutlineShoppingCart className="text-blue-400 text-xl" />
                        <h1 className="text-sm">Giỏ hàng</h1>
                      </Link>
                      <button
                        onClick={handleClearCart}
                        className="active:scale-105 p-2 hover:bg-gray-100 rounded-full"
                      >
                        <AiOutlineClear className="text-lg text-blue-500" />
                      </button>
                    </div>
                    {user?.cart?.length === 0 ? (
                      <Image
                        className="w-full h-[15rem]"
                        width={500}
                        height={500}
                        alt=""
                        src={require("@/resources/images/empty-cart.png")}
                      />
                    ) : (
                      <div className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        {user?.cart?.map((item) => (
                          <Link
                            href={`/products/${item.product?.slug as string}`}
                            key={item.product?.slug as string}
                            className="flex items-center space-x-4 hover:bg-gray-100 cursor-pointer p-2 h-24"
                          >
                            <Image
                              className="w-fit h-full"
                              width={100}
                              height={100}
                              src={item?.product?.files[0].url!}
                              alt=""
                            />
                            <h1 className="text-sm font-semibold">
                              {item.product?.name as string}
                            </h1>

                            <div className="items-center whitespace-nowrap flex flex-col">
                              <h2 className="text-sm text-gray-600">
                                {item.size?.name!}
                              </h2>
                              <h3 className="text-sm text-gray-400">{`SL :${item?.amount!}`}</h3>
                            </div>
                            <div className="items-center space-x-2 pr-2">
                              <span className="text-gray-500 line-through lg:text-sm text-[13px] whitespace-nowrap">
                                {item?.product?.discount! > 0 &&
                                  currencyFormatter.format(+item.size?.price!, {
                                    code: "VND",
                                  })}
                              </span>
                              <h1
                                className={`text-sm font-bold text-red-500 pr-2`}
                              >
                                {" "}
                                {currencyFormatter.format(
                                  Math.floor(
                                    +(
                                      +item.size?.price! -
                                      (+item.size?.price! / 100) *
                                        item?.product?.discount!
                                    ) / 10000
                                  ) * 10000,
                                  {
                                    code: "VND",
                                  }
                                )}
                              </h1>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {status === "authenticated" ? (
              <div className="group relative items-center">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Image
                    className="w-8 h-8 object-cover rounded-full"
                    width={100}
                    height={100}
                    src={
                      user?.image?.url
                        ? user?.image?.url
                        : require("@/resources/images/noAvatar.webp")
                    }
                    alt=""
                  />
                </div>
                <div className="group-hover:scale-100 origin-top-right scale-0 absolute top-[100%] right-0 w-36 h-auto shadow-md bg-gray-200 transition-all duration-300 border flex flex-col text-sm font-semibold">
                  {status === "authenticated" ? (
                    <>
                      <Link
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-300"
                        href={`/profile?id=${session?.user.id}`}
                      >
                        <CgProfile size={20} />
                        <span>Hồ sơ</span>
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-300"
                          href={"/manager"}
                        >
                          <FaStore size={20} />
                          <span>Quản lý</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-300"
                      >
                        <FiLogOut size={20} />
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        className="px-4 py-2 hover:bg-gray-300"
                        href={"/signin"}
                      >
                        <span>Đăng nhập</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/signin">
                <button className="group p-2 hover:bg-gray-100 rounded-full">
                  <FiLogIn className="group-active:translate-x-[2px] transition-all duration-500 ease-in-out text-xl text-black" />
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={() => dispatch(toggleNavbarMobile())}
            className="group"
          >
            <FaBars className="texxt-black text-2xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
