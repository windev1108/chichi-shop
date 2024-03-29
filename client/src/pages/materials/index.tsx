import ProductItem from "@/components/Items/Product";
import Layout from "@/components/Layout";
import { getProductsByPage } from "@/lib/products";
import { Product } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import Link from "next/link";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);
  const { products, totalPage } = await getProductsByPage({
    page: query.page as string,
    type: "MATERIAL",
  });

  return {
    props: {
      session,
      products: products || null,
      totalPage: totalPage || null,
      page: query.page || 1,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const Mat: NextPage<{
  products: Product[];
  totalPage: number;
  page: number;
}> = ({ products, totalPage, page }) => {

  return (
    <Layout>
      <div className="my-10 lg:px-40 md:px-20 px-4 lg:py-20 py-10">
        {/* <div className="flex">
          <div className="flex space-x-2 flex-1">
            <select
              defaultValue=""
              className="outline-none text-sm font-semibold shadow-md border flex space-x-2 items-center px-2 py-2 rounded-full"
            >
              <option value="" disabled hidden>
                Màu sắc
              </option>
              <option value="all">Tất cả</option>
              <option value="blue">Xanh</option>
              <option value="red">Đỏ</option>
              <option value="purple">Tím</option>
              <option value="yellow">Vàng</option>
              <option value="green">Lục</option>
              <option value="cyan">Lam</option>
            </select>
            <select
              defaultValue=""
              className="outline-none text-sm font-semibold shadow-md border flex space-x-2 items-center px-2 py-2 rounded-full"
            >
              <option value="" disabled hidden>
                Giá
              </option>
              <option value="price">Cao nhất</option>
              <option value="color">Thấp nhất</option>
            </select>
          </div>
        </div> */}

        {products.length > 0 ? (
          <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 lg:gap-6 gap-2 my-12">
            {products?.map(
              ({
                slug,
                files,
                id,
                name,
                sold,
                discount,
                _count,
                averageRating,
                sizeList,
              }) => (
                <ProductItem
                  key={slug as string}
                  id={id as string}
                  slug={slug as string}
                  image={files[files.length - 1]?.url!}
                  name={name as string}
                  discount={discount!}
                  sold={sold!}
                  sizeId={sizeList[0].id!}
                  price={sizeList[0]?.price!}
                  averageRating={averageRating!}
                  review={_count?.reviews!}
                />
              )
            )}
          </div>
        ) : (
          <div className="flex justify-center my-10">
            <span className="text-black font-semibold">
              {+page > totalPage
                ? "Số trang vượt quá số lượng sản phẩm"
                : "Không tìm thấy sản phẩm"}
            </span>
          </div>
        )}

        {totalPage! > 1 && (
          <div className="flex justify-center">
            <div className="flex">
              {Array.from({ length: totalPage }).map((_page, index) => (
                <Link
                  href={`/materials?page=${index + 1}`}
                  key={index}
                  className={`${
                    +page === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-black"
                  } active:scale-105 border-2 w-10 h-10 flex justify-center items-center hover:bg-opacity-80`}
                >
                  <h1 className="text-lg font-semibold">{++index}</h1>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Mat;
