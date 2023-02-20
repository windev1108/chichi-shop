import Layout from "@/components/Layout";
import { Product } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import React, { useRef, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { destroyMultipleImage, uploadMultipleImage } from "@/utils/constants";
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
import { useSession } from "next-auth/react";
import ProductRoleAdmin from "@/components/Items/ProductRoleAdmin";
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

  const { product } = await getProductBySlug({ slug: query.slug as string });

  if (!session?.user.email || !JSON.parse(session?.user?.image!).isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
      props: {},
    };
  }

  return {
    props: {
      session,
      page: page || null,
      queryPage: query.page || null,
      products: products || null,
      product: product || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const Manager: NextPage<{
  products: Product[];
  product: Product;
  page: number;
  queryPage: string;
}> = ({ products, page, product, queryPage }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<{
    name: string;
    descriptions: string;
    discount: number;
    blobFiles: { url?: string; type?: string; file?: any }[];
    isLoading?: boolean;
    sizeSlot?: number;
  }>({
    name: "",
    descriptions: "",
    discount: 0,
    blobFiles: [],
    sizeSlot: 0,
    isLoading: false,
  });
  const { name, descriptions, discount, blobFiles, sizeSlot, isLoading } = form;
  const formRef = useRef<HTMLFormElement | any>(null);

  const onSubmitForm = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!name || sizeSlot === 0 || blobFiles.length === 0) {
          toast.error("Vui lòng nhập đầy đủ thông tin");
        } else {
          const sizeProduct = Array.from({ length: sizeSlot! }).map(
            (_size, index) => {
              return {
                name: formRef.current[`size-[${index}]`]?.value as string,
                price: +formRef.current[`price-[${index}]`]?.value,
                amount: +formRef.current[`amount-[${index}]`]?.value,
                isValid: Boolean(
                  formRef.current[`size-[${index}]`]?.value &&
                    formRef.current[`price-[${index}]`]?.value &&
                    formRef.current[`amount-[${index}]`]?.value
                ),
              };
            }
          );
          if (sizeProduct.every((size) => size.isValid)) {
            setForm({ ...form, isLoading: true });
            const files: any = await uploadMultipleImage(blobFiles as any);
            const { success, message } = await createProduct({
              product: {
                name,
                discount,
                descriptions,
                files,
                sizeList: sizeProduct.map(({ name, amount, price }) => {
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
                sizeSlot: 0,
                isLoading: false,
              });
              toast.success(message);
              router.replace(router.asPath);
            } else {
              toast.success(message);
            }
          } else {
            toast.error("Vui lòng điền đầy đủ thông tin kích thước");
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [name, blobFiles]
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

  const onEditProduct = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!name || sizeSlot === 0 || blobFiles.length === 0) {
          toast.error("Vui lòng nhập đầy đủ thông tin");
        } else {
          const sizeProduct = Array.from({ length: sizeSlot! }).map(
            (_size, index) => {
              return {
                name: formRef.current[`size-[${index}]`]?.value as string,
                price: +formRef.current[`price-[${index}]`]?.value,
                amount: +formRef.current[`amount-[${index}]`]?.value,
                isValid: Boolean(
                  formRef.current[`size-[${index}]`]?.value &&
                    formRef.current[`price-[${index}]`]?.value &&
                    formRef.current[`amount-[${index}]`]?.value
                ),
              };
            }
          );
          if (sizeProduct.every((size) => size.isValid)) {
            setForm({ ...form, isLoading: true });
            const files: any[] = blobFiles.every((blob) => blob.file)
              ? await uploadMultipleImage(blobFiles as any)
              : [];
            const { success, message } = await updateProduct({
              productId: product?.id as string,
              product: {
                name,
                discount,
                descriptions,
                files,
                sizeList: sizeProduct.map(({ name, amount, price }) => {
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
                sizeSlot: 0,
                isLoading: false,
              });
              toast.success(message);
              router.replace(router.asPath);
              if (blobFiles.every((blob) => blob.file)) {
                destroyMultipleImage(product.files);
              }
            } else {
              toast.success(message);
            }
          } else {
            toast.error("Vui lòng điền đầy đủ thông tin kích thước");
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [product]
  );

  const handleClearFiles = React.useCallback(() => {
    blobFiles.forEach((blob) => {
      URL.revokeObjectURL(blob.url!);
    });
    setForm({ ...form, blobFiles: [] });
  }, [blobFiles, sizeSlot]);

  const handleClearSize = React.useCallback(() => {
    setForm({ ...form, sizeSlot: 0 });
  }, [form]);

  React.useEffect(() => {
    return () => {
      blobFiles.forEach((blob) => {
        URL.revokeObjectURL(blob.url!);
      });
    };
  }, []);

  React.useLayoutEffect(() => {
    if (product && formRef.current) {
      setForm({
        name: product.name as string,
        descriptions: product.descriptions as string,
        discount: product.discount!,
        blobFiles: product.files!,
        sizeSlot: product.sizeList.length,
      });
    }
  }, [product]);

  console.log("product", product);
  return (
    <Layout>
      <div className="grid grid-cols-10 gap-16 my-10 px-40">
        <div className="col-span-3">
          <h1 className="text-center font-semibold text-xl mb-10">
            Thêm sản phẩm
          </h1>
          <form
            ref={formRef}
            onSubmit={(e) => (product ? onEditProduct(e) : onSubmitForm(e))}
            className="space-y-4 w-full"
          >
            <div className="flex flex-col">
              <label className="font-semibold my-2" htmlFor="name">
                Tên sản phẩm
                <span className="inline-block mx-2 text-xs font-normal text-red-500">
                  (Require*)
                </span>
              </label>
              <textarea
                id="name"
                value={name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className=" border outline-none w-full px-4 py-2 rounded-sm"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold my-2" htmlFor="name">
                Giảm giá %
                <span className="inline-block mx-2 text-xs font-normal text-gray-500">
                  (Optional*)
                </span>
              </label>
              <input
                value={discount}
                onChange={(e) =>
                  setForm({ ...form, discount: +e.target.value })
                }
                className="border outline-none w-full px-4 py-2 rounded-sm"
                type="number"
                placeholder="Nhập %"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold my-2" htmlFor="name">
                Mô tả sản phẩm
                <span className="inline-block mx-2 text-xs font-normal text-gray-500">
                  (Optional*)
                </span>
              </label>
              <textarea
                value={descriptions}
                onChange={(e) =>
                  setForm({ ...form, descriptions: e.target.value })
                }
                className=" border outline-none w-full px-4 py-2 rounded-sm"
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label className="font-semibold text-black">
                  Thêm Size
                  <span className="inline-block mx-2 text-xs font-normal text-red-500">
                    (Require*)
                  </span>
                </label>
                <button
                  onClick={() => {
                    if (sizeSlot! < 6) {
                      setForm({ ...form, sizeSlot: sizeSlot! + 1 });
                    } else {
                      toast.error("Không thể thêm quá 6 kích thước");
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
              {Array.from({ length: sizeSlot! }).map((_type, index) => (
                <div
                  key={index!}
                  className={"relative cursor-pointer items-center"}
                >
                  <input
                    name={`size-[${index}]`}
                    autoComplete="off"
                    type="text"
                    placeholder="Size"
                    className="w-full px-4 py-2 border text-center outline-none text-sm font-semibold"
                  />
                  <input
                    name={`price-[${index}]`}
                    autoComplete="off"
                    type="text"
                    placeholder="Giá"
                    className="w-full px-4 py-2 border text-center outline-none text-sm font-semibold"
                  />
                  <input
                    name={`amount-[${index}]`}
                    autoComplete="off"
                    type="text"
                    placeholder="Số lượng"
                    className="w-full px-4 py-2 border text-center outline-none text-sm font-semibold"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label className="font-semibold text-black">
                  Thêm hình ảnh sản phẩm
                  <span className="inline-block mx-2 text-xs font-normal text-red-500">
                    (Require*)
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
                {product ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </span>
            </button>
          </form>
        </div>
        <div className="col-span-7">
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

          {products?.length > 0 ? (
            <div className="grid grid-cols-4 gap-8 my-12">
              {products?.map(
                ({ slug, files, id, name, discount, sold, sizeList }) => (
                  <ProductRoleAdmin
                    isAdmin={JSON.parse(session?.user?.image!).isAdmin}
                    key={slug as string}
                    id={id as string}
                    slug={slug as string}
                    files={files}
                    name={name as string}
                    discount={discount!}
                    price={sizeList[0].price!}
                    sold={sold!}
                    review={39}
                  />
                )
              )}
            </div>
          ) : (
            <div className="flex justify-center my-10">
              <span className="text-black font-semibold">
                {+queryPage > page
                  ? "Số trang vượt quá số lượng sản phẩm"
                  : "Không tìm thấy sản phẩm"}
              </span>
            </div>
          )}

          <div className="flex justify-center">
            <div className="flex">
              {Array.from({ length: page }).map((_page, index) => (
                <Link
                  href={`${router.pathname}?page=${index + 1}`}
                  key={index}
                  className={`${
                    page === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-black"
                  } active:scale-105 border-2 w-10 h-10 flex justify-center items-center hover:bg-opacity-80`}
                >
                  <h1 className="text-lg font-semibold">{index + 1}</h1>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Manager;
