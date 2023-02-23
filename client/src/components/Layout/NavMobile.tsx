import { toggleNavbarMobile } from "@/redux/features/isSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import React, { useState, useLayoutEffect } from "react";
import Logo from "../Logo";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { Cart } from "@/utils/types";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { MdOutlineArrowBack } from "react-icons/md";
import { toast } from "react-hot-toast";

const NavMobile = () => {
  const dispatch = useAppDispatch();
  const { isOpenNavbarMobile, isUpdatedCard } = useAppSelector(
    (state) => state.isSlice
  );
  const [isOpenCart, setIsOpenCart] = useState<boolean>(false);
  const [cart, setCart] = useState<Cart[]>();

  const { data: session, status } = useSession();


  
  useLayoutEffect(() => {
    setCart(JSON.parse(localStorage.getItem("carts")!) || []);
  }, [isUpdatedCard]);

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

  const handleOpenCart = React.useCallback(() => {
    setIsOpenCart(true);
  }, [isOpenCart, isOpenNavbarMobile]);

  const handleSignOut = React.useCallback(() => {
    try {
      signOut({ redirect: false });
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);
  return (
    <>
      <div
        onClick={() => dispatch(toggleNavbarMobile())}
        className={`${
          isOpenNavbarMobile ? "block" : "hidden"
        } lg:hidden fixed top-0 right-0 bottom-0 left-0 bg-[#11111170] z-[1000]`}
      ></div>
      <div
        className={`${
          isOpenNavbarMobile ? "translate-x-0" : "translate-x-[-100%]"
        } transition-all duration-500 lg:hidden  fixed top-0 bottom-0 left-0 h-screen w-[70vw] z-[1001] bg-white flex flex-col`}
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <div 
        onClick={() => dispatch(toggleNavbarMobile())}
        className="flex flex-col h-full">
          <Link
            className="font-semibold px-6 py-2 hover:bg-gray-100"
            href="/products"
          >
            <h1>Sản phẩm</h1>
          </Link>

          <Link
            className="font-semibold px-6 py-2 hover:bg-gray-100"
            href="#contact"
          >
            <h1>Liên hệ</h1>
          </Link>

          <div
            onClick={handleOpenCart}
            className="relative flex group font-semibold px-6 py-2 hover:bg-gray-100 items-center"
          >
            <span className="relative">
              Giỏ hàng
              <div
                className={`${
                  cart?.length! > 0 ? "scale-100" : "scale-0"
                } transition-all duration-500 ease-in-out absolute top-0 right-[-50%] rounded-full bg-red-500 shadow-md w-5 h-5 flex justify-center items-center`}
              >
                <h1 className="text-semibold text-white text-xs">
                  {cart?.length}
                </h1>
              </div>
            </span>
          </div>
        </div>
        {status === "authenticated" ? (
          <div className="flex justify-between p-5">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image
                className="w-8 h-8 object-cover rounded-full"
                width={100}
                height={100}
                src={
                  session?.user?.image
                    ? session?.user?.image
                    : require("@/resources/images/noAvatar.webp")
                }
                alt=""
              />
              <h1 className="font-semibold text-sm">{session?.user?.name!}</h1>
            </div>
            <button
              onClick={handleSignOut}
              type="button"
              className="text-black text-xl p-2 hover:bg-gray-100 rounded-full"
            >
              <FiLogOut />
            </button>
          </div>
        ) :
        <Link href="/signin" className="flex justify-end space-x-1 items-center p-5">
            <FiLogIn className="text-xl"/>
        </Link>
      }
      </div>
      <div
        className={`${
          isOpenCart ? "translate-x-0" : "translate-x-[-100%]"
        } transition-all duration-500 lg:hidden items-center pt-12 fixed top-0 bottom-0 left-0 h-screen w-full z-[1001] bg-white flex flex-col`}
      >
        <button
          onClick={() => setIsOpenCart(false)}
          className="absolute active:scale-105 left-2 top-2 text-2xl p-1 hover:bg-gray-200 bg-gray-100 rounded-full"
        >
          <MdOutlineArrowBack />
        </button>
        {cart?.length === 0 ? (
          <Image
            className="w-full h-fit"
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
                  <h1 className="text-sm font-semibold">{item.name}</h1>
                </Link>
                <div className="flex items-center space-x-2 pr-2 border rounded-full">
                  <button
                    onClick={() => handleTakeAwayItem(item.slug!)}
                    className="text-2xl p-1 hover:bg-gray-200 active:scale-105 transition-all duration-500 rounded-full"
                  >
                    <BiMinusCircle className="text-blue-500" />
                  </button>
                  <h1 className="text-sm text-black font-semibold">
                    {item.amount}
                  </h1>
                  <button
                    onClick={() => handlePlusItem(item.slug!)}
                    className="text-2xl p-1 hover:bg-gray-200 active:scale-105 transition-all duration-500 rounded-full"
                  >
                    <BiPlusCircle className="text-blue-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NavMobile;
