import Link from "next/link";
import React from "react";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineSearch,
} from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import Logo from "@/components/Logo";
import { useSession, signOut } from "next-auth/react";
import { FaStore } from "react-icons/fa";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white flex w-full h-[64px] items-center px-40 shadow-md border">
      <div className="flex flex-1 items-center text-black">
        <Logo />
        <div className="ml-20 flex-1 flex space-x-4 font-semibold">
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
      <div className="flex flex-1 items-center space-x-56 justify-end">
        <div className="flex justify-center w-[25rem] rounded-full bg-gray-200 items-center px-4 text-black py-2">
          <input
            placeholder="Tìm sản phẩm ở đây..."
            className="text-sm font-semibold outline-none placeholder:text-sm w-full bg-transparent"
            type="text"
          />
          <AiOutlineSearch className="text-xl text-black" />
        </div>

        <div className="flex space-x-5 items-center text-2xl text-black">
          <AiOutlineShoppingCart />

          <div className="group relative">
            {status === "authenticated" ? (
              <div className="flex items-center space-x-2 cursor-pointer">
                <img
                  className="w-8 h-8 object-cover"
                  src="https://www.pngfind.com/pngs/m/381-3819326_default-avatar-svg-png-icon-free-download-avatar.png"
                  alt=""
                />
                <span className="font-semibold text-black text-sm whitespace-nowrap">
                  {session?.user?.name}
                </span>
              </div>
            ) : (
              <AiOutlineUser />
            )}

            <div className="group-hover:scale-100 origin-top-right scale-0 absolute top-[100%] right-0 w-36 h-auto shadow-md bg-gray-200 transition-all duration-300 border flex flex-col text-sm font-semibold">
              {status === "authenticated" ? (
                <>
                  <Link
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-300"
                    href={"/profile"}
                  >
                    <CgProfile size={20} />
                    <span>Hồ sơ</span>
                  </Link>
                  {JSON.parse(session?.user?.image!).isAdmin && (
                    <Link
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-300"
                      href={"/manager"}
                    >
                      <FaStore size={20} />
                      <span>Quản lý</span>
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ redirect: false })}
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
                  <Link
                    className="px-4 py-2 hover:bg-gray-300"
                    href={"/signup"}
                  >
                    <span>Đăng ký</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
