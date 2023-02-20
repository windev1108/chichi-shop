import type { NextPage } from "next";
import Link from "next/link";
import Meta from "@/components/Meta";
import Image from "next/image";

const NotFound: NextPage = () => {
  return (
    <>
      <Meta
        title="Not Found | ChiChi - Store"
        description="Not Found"
        image="/favicon.png"
      />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Image
          width={300}
          height={300}
          className="object-contain"
          alt=""
          src={require("@/resources/images/404.png")}
        />
        <h1 className="text-center">Không tìm thấy trang này</h1>
        <Link href="/">
          <h1 className="font-semibold text-blue-500 hover:underline text-center">
            Quay lại trang chủ
          </h1>
        </Link>
      </div>
    </>
  );
};
export default NotFound;
