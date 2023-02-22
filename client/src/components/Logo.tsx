import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image width={500} height={500} className="object-cover lg:w-36 w-28 !h-full" src={require("@/resources/images/logo.png")} alt="" />
   </Link>
  )
}

export default Logo