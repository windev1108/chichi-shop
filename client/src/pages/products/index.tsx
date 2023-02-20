import ProductItem from "@/components/Items/Product";
import Layout from "@/components/Layout";
import { getProductsByPage } from "@/lib/products";
import { Product } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import Link from "next/link";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);
  const { products, page } = await getProductsByPage({
    page: query.page as string,
  });

  console.log("query.page :", query.page);

  return {
    props: {
      session,
      products: products || null,
      page: page || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const ProductsList: NextPage<{ products: Product[]; page: number }> = ({
  products,
  page,
}) => {
  return (
    <Layout>
      <div className="my-10 px-40">
        <div className="flex">
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
        </div>

        <div className="grid grid-cols-5 gap-8 my-12">
          {products?.map(
            ({ slug, files, id, name, sold, discount, _count, sizeList }) => (
              <ProductItem
                key={slug as string}
                id={id as string}
                slug={slug as string}
                image={files[files.length - 1]?.url!}
                name={name as string}
                discount={discount!}
                sold={sold!}
                price={sizeList[0]?.price!}
                review={_count?.reviews!}
              />
            )
          )}
        </div>

        <div className="flex justify-center">
          <div className="flex">
            {Array.from({ length: page }).map((_page, index) => (
              <Link
                href={`/products?page=${index + 1}`}
                key={index}
                className="active:scale-105 border-2 w-10 h-10 flex justify-center items-center bg-gray-100 hover:bg-gray-300"
              >
                <h1 className="text-lg font-semibold">{index + 1}</h1>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsList;
