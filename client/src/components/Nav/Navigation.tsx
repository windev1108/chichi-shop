import { User } from "@/utils/types";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BiUser } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { IoMdListBox } from "react-icons/io";

const Navigation: NextPage<{ user: User }> = ({ user }) => {
  const router = useRouter();

  return (
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

      <Link
        href={`/profile?id=${user?.id}`}
        className={`${
          router.pathname === "/profile" && "bg-gray-100"
        } flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 cursor-pointer rounded-lg`}
      >
        <BiUser className="text-xl text-blue-300" />
        <h1 className="text-sm">Tài khoản của tôi</h1>
      </Link>
      <Link
        href="/orders"
        className={`${
          router.pathname.includes("/orders") && "bg-gray-100"
        } flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 cursor-pointer rounded-lg`}
      >
        <IoMdListBox className="text-xl text-blue-300" />
        <h1 className="text-sm">Đơn hàng của tôi</h1>
      </Link>
    </div>
  );
};

export default React.memo(Navigation);
