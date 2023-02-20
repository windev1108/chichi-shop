import Layout from "@/components/Layout";
import ProductItem from "@/components/Items/Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { Product, Session, User } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getSellingAndNewProduct } from "@/lib/products";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session: Session | null = await getServerSession(req, res, authOptions);
  const products = await getSellingAndNewProduct();
  return {
    props: {
      session,
      products,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const Home: NextPage<{
  products: {
    news: Product[];
    selling: Product[];
  };
}> = ({ products: { selling, news } }) => {
  console.log("selling , ", selling);
  console.log("news , ", news);
  return (
    <Layout>
      <div className="px-40">
        <img
          src="https://tinhlamjw.com/wp-content/uploads/2021/10/NguPhucTinhLam-bannerweb.jpg"
          className="my-10 object-fill w-full h-[50vh] rounded-xl"
          alt=""
        />
        <div className="flex flex-col">
          <h1 className="font-semibold text-xl">Sản phẩm bán chạy</h1>
          <div className="h-[380px] my-10">
            <Swiper
              slidesPerView={6}
              spaceBetween={10}
              navigation={true}
              modules={[Navigation]}
              className="h-full"
            >
              {selling?.map(
                ({
                  slug,
                  files,
                  id,
                  name,
                  discount,
                  sold,
                  sizeList,
                  _count,
                }) => (
                  <SwiperSlide key={id as string}>
                    <ProductItem
                      key={slug as string}
                      id={id as string}
                      slug={slug as string}
                      image={files[0]?.url!}
                      name={name as string}
                      discount={discount!}
                      price={sizeList[0].price!}
                      sold={sold!}
                      review={_count?.reviews!}
                    />
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>

          <h1 className="font-semibold text-xl">Sản phẩm mới</h1>
          <div className="h-[380px] my-10">
            <Swiper
              slidesPerView={6}
              spaceBetween={10}
              navigation={true}
              modules={[Navigation]}
              className="h-full"
            >
              {news.map(
                ({ slug, files, id, name, discount, sold, sizeList }) => (
                  <SwiperSlide key={id as string}>
                    <ProductItem
                      key={slug as string}
                      id={id as string}
                      slug={slug as string}
                      image={files[0]?.url!}
                      name={name as string}
                      discount={discount!}
                      price={sizeList[0].price!}
                      sold={sold!}
                      review={39}
                    />
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
