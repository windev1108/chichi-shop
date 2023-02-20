import { NextPage } from 'next'
import Link from 'next/link'
import React , { FC ,useRef , useImperativeHandle } from 'react'

const Footer = () => {
 

  return (
       <div id="contact" className="grid grid-cols-3 h-[40vh] w-full px-40 py-20 bg-gray-100">
          <div className="flex flex-col">
             <h1 className="text-   xl font-bold text-black mb-2">Liên hệ</h1>
             <h2 className="text-sm font-semibold">Số điện thoại : 0969782408</h2>
             <h3 className="text-sm font-semibold">Email : chjcago2001@gmail.com</h3>
          </div>
          <div className="flex flex-col">
             <h1 className="text-   xl font-bold text-black mb-2">Địa chỉ</h1>
             <h2 className="text-sm font-semibold">Phường 11, Bình Thạnh, TP.Hồ Chí Minh</h2>
          </div>
          <div>
             <h1 className="text-   xl font-bold text-black mb-2">Theo dõi chúng tôi</h1>
              <div className="flex space-x-3 text-blue-500">
                <Link href="instagram.com">
                  <img className="w-6 h-6 object-cover" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png" alt="" />
                </Link>
                <Link href="instagram.com">
                  <img className="w-6 h-6 object-cover" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/2491px-Twitter-logo.svg.png" alt="" />
                </Link>                 <Link href="instagram.com">
                  <img className="w-6 h-6 object-cover" src="https://cdn.iconscout.com/icon/free/png-256/instagram-1868978-1583142.png?f=webp&w=256" alt="" />
                </Link>
              </div>
          </div>
       </div>
  )
}

export default React.forwardRef(Footer)