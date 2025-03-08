import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <header className="py-10 bg-[#D7DeDC] text-gray-500 flex justfiy-between item-center">
      <Link href={"/"}>
            <Image src="/logo.png" alt="logo" width={100} height={100} />
      </Link>
    </header>
  )
}

export default Header
