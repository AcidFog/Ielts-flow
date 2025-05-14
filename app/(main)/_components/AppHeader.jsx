"use client";
import React from 'react';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

export const AppHeader = () => {
  const router = useRouter();
  return (
    <div className='p-3 shadow-sm flex justify-between items-center'>
      <div onClick={() => router.push('/dashboard')} className="cursor-pointer">
        <Image src={'/Logo.svg'} alt='logo' width={50} height={50} />
      </div>
      <UserButton />
    </div>
  );
}

export default AppHeader;