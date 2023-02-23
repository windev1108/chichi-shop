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
import { FaBars, FaStore, FaUserCircle } from "react-icons/fa";
import { Cart, Product, User } from "@/utils/types";
import Image from "next/image";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import currencyFormatter from "currency-formatter";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import useDebounce from "@/utils/hook/useDebounce";
import { getProductsByKeywords } from "@/lib/products";
import { useRouter } from "next/router";
import { getUserById } from "@/lib/users";
import { toggleNavbarMobile } from "@/redux/features/isSlice";

const Header = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [cart, setCart] = useState<Cart[]>();
  const [keyword, setKeywords] = useState<string>("");
  const [foundProducts, setFoundProducts] = useState<Product[]>([]);
  const debounceKeywords = useDebounce(keyword,300);
  const { isUpdatedCard , isUpdateProfile } = useAppSelector(
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
    setCart(JSON.parse(localStorage.getItem("carts")!) || []);
  }, [isUpdatedCard]);

  useLayoutEffect(() => {
    if (session?.user?.id) {
      getUserById({ id: session?.user?.id as string }).then(({ user }) =>
        setUser(user)
      );
    }
  }, [isUpdateProfile]);

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

  const handleTakeAwayItem = (slug: string) => {
    try {
      const oldCart: Cart[] = JSON.parse(localStorage.getItem("carts")!);
      const foundIndexItem = oldCart?.findIndex((cart) => cart.slug === slug);
      if (foundIndexItem !== -1) {
        if (oldCart[foundIndexItem!].amount! <= 1) {
          localStorage.setItem(
            "carts",
            JSON.stringify([...oldCart.filter((cart) => cart.slug !== slug)])
          );
          setCart(oldCart.filter((cart) => cart.slug !== slug));
        } else {
          oldCart[foundIndexItem!].amount =
            oldCart[foundIndexItem!].amount! - 1;
          localStorage.setItem("carts", JSON.stringify(oldCart));
          setCart(oldCart);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePlusItem = (slug: string) => {
    try {
      const oldCards: Cart[] = JSON.parse(localStorage.getItem("carts")!) || [];
      const foundIndexItem = oldCards?.findIndex((cart) => cart.slug === slug);

      if (foundIndexItem !== -1) {
        oldCards[foundIndexItem!].amount =
          oldCards[foundIndexItem!].amount! + 1;
        localStorage.setItem("carts", JSON.stringify(oldCards));
        setCart(oldCards);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleClearCart = () => {
    try {
      localStorage.setItem("carts", JSON.stringify([]));
      setCart([]);
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
      className={`fixed top-0 right-0  left-0 bg-white flex w-full space-x-4 h-[64px] items-center lg:px-40 px-2 shadow-md border z-[500]`}
    >
      <div className="flex lg:flex-1 flex-0 items-center text-black h-[40px]">
        <Logo />
        <div className="lg:flex hidden lg:ml-20 ml-0 flex-1 space-x-4 font-semibold">
          <Link
            className="relative after:absolute after:origin-center after:transition-all after:duration-300 after:ease-in-out hover:after:scale-x-100 after:scale-x-0 after:w-full after:top-[100%] after:border-b-[2px] after:border-black"
            href="/products"
          >
            <p>Sản phẩm</p>
          </Link>

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
                  className="flex h-[4.5rem] items-center space-x-2 hover:bg-gray-100 cursor-pointer border"
                >
                  <Image
                    className="lg:block hidden object-cover w-fit h-full"
                    src={product?.files[0].url}
                    alt=""
                    width={100}
                    height={100}
                  />
                  <div className="flex flex-col">
                    <h1 className="font-[500] text-sm text-black">{product.name}</h1>
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
          <div className="flex space-x-5 items-center text-2xl text-black">
            <div className="group relative z-[100]">
              <AiOutlineShoppingCart />
              <div
                className={`${
                  cart?.length! > 0 ? "scale-100" : "scale-0"
                } transition-all duration-500 ease-in-out absolute top-[-20%] right-[-50%] rounded-full bg-red-500 shadow-md w-5 h-5 flex justify-center items-center`}
              >
                <h1 className="text-semibold text-white text-xs">
                  {cart?.length}
                </h1>
              </div>
              <div className="group-hover:block hidden absolute top-[100%] right-0">
                <div className="w-[25rem] border flex flex-col bg-white shadow-md max-h-[20rem] overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
                  <div className="flex justify-between px-4 items-center py-1 border-b-2">
                    <h1 className="font-semibold text-base">Giỏ hàng</h1>
                    <button
                      onClick={handleClearCart}
                      className="active:scale-105 p-2 hover:bg-gray-100 rounded-full"
                    >
                      <AiOutlineClear className="text-lg text-blue-500" />
                    </button>
                  </div>
                  {cart?.length === 0 ? (
                    <Image
                      className="w-full h-[15rem]"
                      width={500}
                      height={500}
                      alt=""
                      src={require("@/resources/images/empty-cart.png")}
                    />
                  ) : (
                    <div className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                      {cart?.map((item) => (
                        <div
                          key={item.slug}
                          className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <Link
                            href={`/products/${item.slug}`}
                            className="flex h-[4.5rem] space-x-2 items-center flex-1"
                          >
                            <Image
                              className="w-fit h-full"
                              width={100}
                              height={100}
                              src={item.image!}
                              alt=""
                            />
                            <h1 className="text-sm font-semibold">
                              {item.name}
                            </h1>
                          </Link>
                          <div className="flex items-center space-x-2 pr-2 border rounded-full">
                            <button
                              onClick={() => handleTakeAwayItem(item.slug!)}
                              className="p-1 hover:bg-gray-200 active:scale-105 transition-all duration-500 rounded-full"
                            >
                              <BiMinusCircle className="text-blue-500" />
                            </button>
                            <h1 className="text-sm text-black font-semibold">
                              {item.amount}
                            </h1>
                            <button
                              onClick={() => handlePlusItem(item.slug!)}
                              className="p-1 hover:bg-gray-200 active:scale-105 transition-all duration-500 rounded-full"
                            >
                              <BiPlusCircle className="text-blue-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

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
