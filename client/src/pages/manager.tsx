import Layout from "@/components/Layout";
import { Product } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import React, { useRef, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import {
  destroyMultipleImage,
  formatText,
  formatTextRendering,
  uploadMultipleImage,
} from "@/utils/constants";
import { toast } from "react-hot-toast";
import { IoIosAddCircle } from "react-icons/io";
import { RiImageAddFill } from "react-icons/ri";
import { AiOutlineClear, AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  createProduct,
  getProductBySlug,
  getProductsByPage,
  updateProduct,
} from "@/lib/products";
import { useRouter } from "next/router";
import ProductRoleAdmin from "@/components/Items/ProductRoleAdmin";
import Link from "next/link";
import { getUserById } from "@/lib/users";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);
  const { products, totalPage } = await getProductsByPage({
    type: query.category === "material" ? "MATERIAL" : "BRACELET",
    page: query.page as string,
  });

  const { product } = await getProductBySlug({ slug: query.slug as string });
  const { user } = await getUserById({ id: session?.user?.id });

  if (!session?.user || !user.isAdmin) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
      props: {},
    };
  }

  return {
    props: {
      session,
      totalPage: totalPage || null,
      queryPage: query.page || null,
      products: products || null,
      product: product || null,
      categoryQuery: query.category || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const Manager: NextPage<{
  products: Product[];
  product: Product;
  totalPage: number;
  queryPage: string;
  categoryQuery: string
}> = ({ products, totalPage, product, queryPage , categoryQuery  }) => {
  const router = useRouter();
  const [form, setForm] = useState<{
    name: string;
    descriptions: string;
    discount: number;
    blobFiles: { url?: string; type?: string; file?: any }[];
    isLoading?: boolean;
    category: string;
    sizeSlot?: {
      id?: number | string;
      amount?: number;
      price?: number;
      name?: string;
    }[];
  }>({
    name: "",
    descriptions: "",
    discount: 0,
    blobFiles: [],
    sizeSlot: [],
    category: "",
    isLoading: false,
  });
  const {
    name,
    descriptions,
    discount,
    category,
    blobFiles,
    sizeSlot,
    isLoading,
  } = form;
  const formRef = useRef<HTMLFormElement | any>(null);

  const handleAddProduct = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (
          !name ||
          !category ||
          sizeSlot?.length === 0 ||
          blobFiles.length === 0
        ) {
          toast.error("Vui l??ng nh???p ?????y ????? th??ng tin");
        } else {
          if (
            sizeSlot?.every((size) => size.name) &&
            sizeSlot?.every((size) => size.amount) &&
            sizeSlot?.every((size) => size.price)
          ) {
            setForm({ ...form, isLoading: true });
            const files: any = await uploadMultipleImage(blobFiles as any);
            const { success, message } = await createProduct({
              product: {
                name,
                discount,
                descriptions,
                category,
                files,
                sizeList: sizeSlot.map(({ name, amount, price }) => {
                  return {
                    name,
                    amount,
                    price,
                  };
                }),
              },
            });
            if (success) {
              setForm({
                ...form,
                name: "",
                descriptions: "",
                category: "",
                discount: 0,
                blobFiles: [],
                sizeSlot: [],
                isLoading: false,
              });
              toast.success(message);
              router.replace(router.asPath);
            } else {
              toast.success(message);
            }
          } else {
            toast.error("Vui l??ng ??i???n ?????y ????? th??ng tin k??ch th?????c");
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [name, discount, descriptions, category, blobFiles, sizeSlot]
  );

  const onChangeFile = (e: any) => {
    try {
      const files = e.target.files;
      const blobs = Array.from(files).map((file: any) => {
        return {
          type: file.type as string,
          url: URL.createObjectURL(file),
          file,
        };
      });
      setForm({ ...form, blobFiles: blobs });
    } catch (error: any) {
      console.log("msg", error.message);
    }
  };

  const handleEditProduct = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!name || sizeSlot?.length === 0 || blobFiles.length === 0) {
          toast.error("Vui l??ng nh???p ?????y ????? th??ng tin");
        } else {
          if (
            sizeSlot?.every((size) => size.name) &&
            sizeSlot?.every((size) => size.amount) &&
            sizeSlot?.every((size) => size.price)
          ) {
            setForm({ ...form, isLoading: true });
            const files: any[] = blobFiles.every((blob) => blob.file)
              ? await uploadMultipleImage(blobFiles as any)
              : [];
            const { success, message } = await updateProduct({
              productId: product?.id as string,
              product: {
                name,
                discount,
                descriptions: formatText({ text: descriptions }),
                files,
                sizeList: sizeSlot.map(({ name, amount, price }) => {
                  return {
                    name,
                    amount,
                    price,
                  };
                }),
              },
            });
            if (success) {
              setForm({
                ...form,
                name: "",
                descriptions: "",
                discount: 0,
                blobFiles: [],
                sizeSlot: [],
                isLoading: false,
              });
              toast.success(message);
              router.replace(router.pathname);
              if (blobFiles.every((blob) => blob.file)) {
                destroyMultipleImage(product.files);
              }
            } else {
              toast.success(message);
            }
          } else {
            toast.error("Vui l??ng ??i???n ?????y ????? th??ng tin k??ch th?????c");
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [product, name, discount, descriptions, blobFiles, sizeSlot]
  );

  const handleClearFiles = React.useCallback(() => {
    blobFiles.forEach((blob) => {
      URL.revokeObjectURL(blob.url!);
    });
    setForm({ ...form, blobFiles: [] });
  }, [blobFiles, sizeSlot]);

  const handleClearSize = React.useCallback(() => {
    setForm({ ...form, sizeSlot: [] });
  }, [form]);

  React.useEffect(() => {
    return () => {
      blobFiles.forEach((blob) => {
        URL.revokeObjectURL(blob.url!);
      });
    };
  }, []);

  React.useLayoutEffect(() => {
    if (product) {
      setForm({
        name: product.name as string,
        descriptions: formatTextRendering({ text: product.descriptions }),
        discount: product.discount!,
        blobFiles: product.files!,
        category: product?.category!,
        sizeSlot: product.sizeList.map((size, index) => {
          return {
            ...size,
            id: index + 1,
          };
        }),
      });
    }
  }, [product]);

  return (
    <Layout>
      <div className="grid grid-cols-10 lg:gap-16 my-10 lg:px-40 px-4 lg:py-20 py-10">
        <div className="lg:col-span-3 col-span-10">
          <h1 className="text-center font-semibold text-xl mb-10">
            Th??m s???n ph???m
          </h1>
          <form
            ref={formRef}
            onSubmit={(e) =>
              product ? handleEditProduct(e) : handleAddProduct(e)
            }
            className="space-y-4 w-full"
          >
            <div className="flex flex-col">
              <label className="font-semibold my-2" htmlFor="name">
                T??n s???n ph???m
                <span className="inline-block mx-2 text-xs font-normal text-red-500">
                  (Required*)
                </span>
              </label>
              <textarea
                id="name"
                value={name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className=" border outline-none w-full px-4 py-2 rounded-sm"
                placeholder="Nh???p t??n s???n ph???m"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold my-2" htmlFor="name">
                Gi???m gi?? %
                <span className="inline-block mx-2 text-xs font-normal text-gray-500">
                  (Optional)
                </span>
              </label>
              <input
                value={discount}
                onChange={(e) =>
                  setForm({ ...form, discount: parseInt(e.target.value) })
                }
                className="border outline-none w-full px-4 py-2 rounded-sm"
                type="number"
                placeholder="Nh???p %"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold my-2" htmlFor="name">
                Danh m???c s???n ph???m
                <span className="inline-block mx-2 text-xs font-normal text-gray-500">
                  (Optional)
                </span>
              </label>
              <select
                className="border px-4 py-2 outline-none"
                onChange={({ target }) =>
                  setForm({ ...form, category: target.value })
                }
                value={category}
              >
                <option value="" hidden>
                  Ch???n danh m???c s???n ph???m
                </option>
                <option value="BRACELET">V??ng tay</option>
                <option value="MATERIAL">Nguy??n li???u</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold my-2" htmlFor="name">
                M?? t??? s???n ph???m
                <span className="inline-block mx-2 text-xs font-normal text-gray-500">
                  (Optional)
                </span>
              </label>
              <textarea
                value={descriptions}
                rows={5}
                onChange={(e) =>
                  setForm({ ...form, descriptions: e.target.value })
                }
                className=" border outline-none w-full px-4 py-2 rounded-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                placeholder="Nh???p m?? t??? s???n ph???m"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label className="font-semibold text-black">
                  Th??m Size
                  <span className="inline-block mx-2 text-xs font-normal text-red-500">
                    (Required*)
                  </span>
                </label>
                <button
                  onClick={() => {
                    if (sizeSlot?.length! < 6) {
                      setForm({
                        ...form,
                        sizeSlot: [
                          ...sizeSlot!,
                          { id: `${sizeSlot?.length! + 1}` },
                        ],
                      });
                    } else {
                      toast.error("Kh??ng th??? th??m qu?? 6 k??ch th?????c");
                    }
                  }}
                  type="button"
                  className="active:scale-110 transition-all duration-500 p-2 hover:bg-gray-100 rounded-full"
                >
                  <IoIosAddCircle className="text-blue-500" size={20} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleClearSize}
                className="active:scale-110 transition-all duration-500 p-2 hover:bg-gray-100 rounded-full"
              >
                <AiOutlineClear className="text-blue-500" size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {sizeSlot?.map((size, index) => (
                <div
                  key={index!}
                  className={"relative cursor-pointer items-center"}
                >
                  <input
                    onChange={({ target }) => {
                      sizeSlot[index].name = target.value;
                      setForm({ ...form });
                    }}
                    value={size.name}
                    autoComplete="off"
                    type="text"
                    placeholder="Size"
                    className="w-full px-4 py-2 border text-center outline-none text-sm font-semibold"
                  />
                  <input
                    onChange={({ target }) => {
                      sizeSlot[index].price = parseInt(target.value);
                      setForm({ ...form });
                    }}
                    value={size.price}
                    autoComplete="off"
                    type="number"
                    placeholder="Gi??"
                    className="w-full px-4 py-2 border text-center outline-none text-sm font-semibold"
                  />
                  <input
                    onChange={({ target }) => {
                      sizeSlot[index].amount = parseInt(target.value);
                      setForm({ ...form });
                    }}
                    value={size.amount}
                    autoComplete="off"
                    type="number"
                    placeholder="S??? l?????ng"
                    className="w-full px-4 py-2 border text-center outline-none text-sm font-semibold"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label className="font-semibold text-black">
                  Th??m h??nh ???nh s???n ph???m
                  <span className="inline-block mx-2 text-xs font-normal text-red-500">
                    (Required*)
                  </span>
                </label>
                <label
                  onChange={onChangeFile}
                  htmlFor="uploads"
                  className="cursor-pointer active:scale-110 transition-all duration-500 p-2 hover:bg-gray-100 rounded-full"
                >
                  <input type="file" multiple id="uploads" hidden />
                  <RiImageAddFill className="text-blue-500" size={20} />
                </label>
              </div>
              <button
                type="button"
                onClick={handleClearFiles}
                className="active:scale-110 transition-all duration-500 p-2 hover:bg-gray-100 rounded-full"
              >
                <AiOutlineClear className="text-blue-500" size={20} />
              </button>
            </div>
            {blobFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {blobFiles?.map((blob) => (
                  <img
                    className="object-cover border-2"
                    key={blob.url}
                    src={blob.url}
                    alt=""
                  />
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              } w-full items-center font-semibold bg-blue-500 text-white rounded-lg hover:shadow-lg px-4 py-2 text-center`}
            >
              <span>
                {isLoading && (
                  <AiOutlineLoading3Quarters className="inline-block mx-2 animate-spin duration-500 ease-linear " />
                )}
                {product ? "S???a s???n ph???m" : "Th??m s???n ph???m"}
              </span>
            </button>
          </form>
        </div>
        <div className="lg:col-span-7 col-span-10">
          <div className="flex">
            <select onChange={({target}) => {
              router.replace(`/manager?category=${target.value}`)
            }} 
            value={categoryQuery}
            className="border px-4 py-2 outline-none">
              <option value="bracelet">V??ng tay</option>
              <option value="material">Nguy??n li???u</option>
            </select>
          </div>
          {products?.length > 0 ? (
            <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 lg:gap-6 gap-2 my-12">
              {products?.map(
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
                  <ProductRoleAdmin
                    key={slug as string}
                    id={id as string}
                    slug={slug as string}
                    files={files}
                    name={name as string}
                    discount={discount!}
                    price={sizeList[0].price!}
                    sold={sold!}
                    review={_count?.reviews!}
                  />
                )
              )}
            </div>
          ) : (
            <div className="flex justify-center my-10">
              <span className="text-black font-semibold">
                {+queryPage > totalPage
                  ? "S??? trang v?????t qu?? s??? l?????ng s???n ph???m"
                  : "Kh??ng t??m th???y s???n ph???m"}
              </span>
            </div>
          )}

          {totalPage > 1 && (
            <div className="flex justify-center">
              <div className="flex">
                {Array.from({ length: totalPage }).map((_page, index) => (
                  <Link
                    href={`${router.pathname}?page=${index + 1}`}
                    key={index}
                    className={`${
                      +queryPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-black"
                    } active:scale-105 border-2 w-10 h-10 flex justify-center items-center hover:bg-opacity-80`}
                  >
                    <h1 className="text-lg font-semibold">{index + 1}</h1>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Manager;
