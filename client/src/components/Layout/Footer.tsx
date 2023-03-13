import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div
      id="contact"
      className="grid lg:grid-cols-3 grid-cols-2  gap-3 h-[40vh] w-full lg:px-40 px-4 py-20 bg-gray-100"
    >
      <div className="flex flex-col">
        <h1 className="text-   xl font-bold text-black mb-2">Liên hệ</h1>
        <span className="text-sm">
          Số điện thoại :{" "}
          <Link className="inline font-semibold" href="tel:034 299 3494">
            034 299 3494
          </Link>
        </span>
        <span className="text-sm">
          Email :{" "}
          <Link className="inline font-semibold" href="tel:034 299 3494">
            chichi.handmadeandart@gmail.com
          </Link>
        </span>
      </div>
      <div className="flex flex-col">
        <h1 className="text-sm   xl font-bold text-black mb-2">Địa chỉ</h1>
        <h2 className="text-sm">Phường 11, Bình Thạnh, TP.Hồ Chí Minh</h2>
      </div>
      <div>
        <h1 className="text-sm  xl font-bold text-black mb-2">
          Theo dõi chúng tôi
        </h1>
        <div className="flex flex-col space-y-4 w-full">
          <Link
            target="_blank"
            href="https://www.facebook.com/chichihandmade.art"
          >
            <img
              className="w-6 h-6 object-cover"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png"
              alt=""
            />
          </Link>

          <Link
            target="_blank"
            href="https://www.lazada.vn/shop/chichi-handmade-art/?spm=a2o4n.pdp_revamp.seller.1.16966c21WDWeQf&itemId=2190220869&channelSource=pdp"
          >
            <Image
              width={100}
              height={100}
              className="w-24 h-fit object-cover"
              src={require("@/resources/images/lazada.png")}
              alt=""
            />
          </Link>

          <Link
            target="_blank"
            href="https://shopee.vn/chichi.handmade?categoryId=100009&entryPoint=ShopByPDP&itemId=22530551272&upstream=search"
          >
            <Image
              width={100}
              height={100}
              className="w-24 h-fit object-cover"
              src={require("@/resources/images/Shopee.svg.webp")}
              alt=""
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
