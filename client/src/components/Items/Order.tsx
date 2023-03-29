import { deleteOrder } from '@/lib/orders'
import { toggleUpdateRealtime } from '@/redux/features/isSlice'
import { useAppDispatch } from '@/redux/hook'
import { formatCurrency } from '@/utils/constants'
import {  ProductOrder, Status, User } from '@/utils/types'
import moment from 'moment'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React , { useState , useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { AiOutlineDelete, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { HiOutlineTruck } from 'react-icons/hi'

const Order:NextPage<{ id : number , status: Status[] ,products : ProductOrder[], user : User,  transportFee: number , totalPayment: number ,  createdAt: string}> = ({
    id,
    status,
    products,
    user,
    transportFee,
    totalPayment,
    createdAt,

}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch()

    const handleDeleteOrder = useCallback(
        async ({ orderId }: { orderId: number }) => {
          try {
            setIsLoading(true);
            const { success, message } = await deleteOrder({ orderId });
            if (success) {
              toast.success(message);
              setIsLoading(false);
              dispatch(toggleUpdateRealtime())
              router.replace(router.asPath)

            } else {
              toast.error(message);
            }
          } catch (error: any) {
            toast.error(error.message);
          }
        },
        []
      );

  return (
    <div
    key={id}
    className="bg-white shadow-md h-auto space-y-2 p-4 border"
  >
    <div className="flex justify-between">
      <div className="flex flex-col">
        <div className="flex space-x-2">
          <h1 className="text-sm">Mã đơn hàng : </h1>
          <h1 className="text-sm text-gray-600">{id}</h1>
        </div>
        <div className="flex space-x-2">
          <h1 className="text-sm">Trạng thái đơn hàng : </h1>
          <h1 className="text-sm font-semibold">
            {status && status[0]?.name!}
          </h1>
        </div>
        <div className="flex space-x-2">
          <h1 className="text-sm">Thời gian đặt hàng : </h1>
          <h1 className="text-sm text-gray-600">
            {moment(createdAt!).format("h:mm A DD/MM/yyyy")}
          </h1>
        </div>
      </div>

      <div className="flex space-x-2">
        <Link
          href={`/orders/${id}`}
          className="px-4 py-2 shadow-md hover:shadow-lg bg-indigo-700 text-white rounded-lg h-10 flex justify-center items-center"
        >
          <h1>Chi tiết đơn hàng</h1>
        </Link>
        <button
          onClick={() => handleDeleteOrder({ orderId: id! })}
          className="space-x-2 px-4 py-2 shadow-md hover:shadow-lg bg-red-500 rounded-lg h-10 flex justify-center items-center"
        >
          <h1 className="text-white">Xóa đơn hàng</h1>
          {isLoading ? 
            <AiOutlineLoading3Quarters className="text-white inline-block mx-2 animate-spin duration-500 ease-linear " />
            :
            <AiOutlineDelete  className="text-white" />
          }
        </button>
      </div>
    </div>

    <div className="border-b"></div>

    <div className="w-full space-y-2 h-[80%] overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
      {products?.map(({ amount, size, product, id }) => (
        <div key={id} className="flex space-x-2">
          <Image
            src={product?.files[0].url!}
            alt=""
            width={500}
            height={500}
            className="w-40 h-40  object-cover"
          />
          <div className="flex flex-col">
            <div className="flex">
              <h1 className="text-sm text-gray-400">
                {"Tên sản phẩm :"}
              </h1>
              <Link
                href={`/products/${id}`}
                className="text-black text-sm hover hover:text-blue-600"
              >
                {product?.name}
              </Link>
            </div>

            <h1 className="text-sm text-gray-400">{`Phân loại hàng : ${size?.name}`}</h1>

            <h1 className="text-sm text-gray-400">{`Số lượng : ${amount}`}</h1>

            <div className="flex space-x-2">
              <h1 className="text-sm text-gray-400">Đơn giá :</h1>
              <div className="flex space-x-2 items-center">
                <span className="text-gray-500 line-through lg:text-xs text-[13px] whitespace-nowrap">
                  {product?.discount! > 0 &&
                    formatCurrency({
                      price: size?.price!,
                    })}
                </span>
                <h1 className="text-sm font-bold text-red-500">
                  {formatCurrency({
                    price:
                      size?.price! -
                      (+size?.price! / 100) * product?.discount!,
                  })}
                </h1>
              </div>
            </div>

            <div className="flex space-x-2 items-center">
              <h1 className="text-sm text-gray-400">
                Thành tiền :
              </h1>
              <h1 className="text-sm font-bold text-red-500">
                {formatCurrency({
                  price:
                    size?.price! -
                    (+size?.price! / 100) * product?.discount!,
                  amount,
                })}
              </h1>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="border-b"></div>

    <div className="h-[10%] flex justify-between items-center">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <h1 className="text-sm text-gray-400">
            Địa chỉ nhận hàng :
          </h1>
          <span className="text-sm text-black">{`${user?.address?.street} , ${user?.address?.wardName} , ${user?.address?.districtName} , ${user?.address?.provinceName}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <h1 className="text-sm text-gray-400">
            Tên người nhận:
          </h1>
          <span className="text-sm text-black">{`${user?.name}`}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2 float-right">
          <HiOutlineTruck className="text-2xl text-green-500" />
          <h1 className="text-sm text-black">Phí vận chuyển :</h1>
          <h1 className="font-semibold text-sm">
            {formatCurrency({ price: transportFee! })}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <FaRegMoneyBillAlt className="text-xl text-orange-500" />
          <h1 className=" text-black text-sm">
            Tổng thanh toán :
          </h1>
          <h1 className="font-semibold text-red-500">
            {formatCurrency({ price: +totalPayment! })}
          </h1>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Order