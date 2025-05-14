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
        <div className="flex items-center space-x-2">
          <Image src={'/Logo.svg'} alt='logo' width={50} height={50} />
          <h2 className="text-lg font-bold">IELTS FLOW</h2>
        </div>
      </div>
      <UserButton />
    </div>
  );
}

export default AppHeader;