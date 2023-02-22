import Layout from "@/components/Layout";
import ProductItem from "@/components/Items/Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { Product, Session, User } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getSellingAndNewProduct } from "@/lib/products";
import { useEffect, useState } from "react";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session: Session | null = await getServerSession(req, res, authOptions);
  const products = await getSellingAndNewProduct();
  return {
    props: {
      session: session || null,
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
  const [ sliderPerView , setSliderView ] = useState<number>(6);

  useEffect(() => {
    function handleResize() {
      if(window.innerWidth <= 414){
        setSliderView(2)
      }else if(window.innerWidth <= 820){
        setSliderView(4)
      }else{
        setSliderView(6)
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout>
      <div className="relative lg:px-40 md:px-10 px-4 lg:py-20 py-16">
        <img
          src="https://tinhlamjw.com/wp-content/uploads/2021/10/NguPhucTinhLam-bannerweb.jpg"
          className="lg:my-10 my-4 lg:object-fill object-fill w-full lg:h-[50vh] h-[25vh] rounded-xl"
          alt=""
        />
        <div className="flex flex-col">
          <h1 className="font-semibold lg:text-xl text-base">Sản phẩm bán chạy</h1>
          <div className="lg:h-[380px] h-fit lg:my-10 my-4">
            <Swiper
              slidesPerView={sliderPerView}
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
                  averageRating,
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
                      averageRating={averageRating!}
                      review={_count?.reviews!}
                    />
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>

          <h1 className="font-semibold lg:text-xl text-base">Sản phẩm mới</h1>
          <div className="lg:h-[380px] h-fit lg:my-10 my-4">
            <Swiper
              slidesPerView={sliderPerView}
              spaceBetween={10}
              navigation={true}
              modules={[Navigation]}
              className="h-full"
            >
              {news.map(
                ({
                  slug,
                  files,
                  id,
                  name,
                  discount,
                  sold,
                  sizeList,
                  averageRating,
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
                      averageRating={averageRating!}
                      review={_count?.reviews!}
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
