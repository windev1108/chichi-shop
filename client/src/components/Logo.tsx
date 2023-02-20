import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { MdPets } from 'react-icons/md'

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
    <h1 className="font-semibold text-3xl text-slate-700">ChiChi</h1>
    <Image width={40} height={40} className="object-cover" src={require("@/resources/images/nham-than-hop-mau-vang-1-removebg-preview.png")} alt="" />
   </Link>
  )
}

export default Logo