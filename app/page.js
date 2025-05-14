import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-gray-800 items-center">
      <div className="flex items-center justify-between w-full max-w-7xl px-6 py-4">
        <h1 className="text-2xl font-bold">IELTS Flow</h1>
        <UserButton />
      </div>

      <main className="flex-1 w-full max-w-7xl flex flex-col items-center">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-[#f8f9ff] w-full">
          <div className="max-w-xl animate-fade-in-up">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Boost Your Confidence <br />
              in <span className="text-indigo-600">Spoken English</span>
            </h1>
            <p className="text-lg text-gray-700 mt-4 mb-6">
              An AI-powered simulator to boost confidence for IELTS speaking, job interviews and daily English conversation.
            </p>
            <a href="/dashboard">
              <Button className="bg-black text-white px-6 py-3 text-lg rounded-md shadow-md hover:scale-105 transition-transform">
                Start Now
              </Button>
            </a>
          </div>
          <div className="mt-10 md:mt-0 animate-fade-in-up delay-150">
            <Image
              src="/image 12.png"
              alt="Hero Image"
              width={400}
              height={400}
              className="rounded-xl animate-fade-in-up delay-150"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white text-center w-full">
          <h2 className="text-3xl font-bold mb-10">Learn. Practice. Succeed.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
            <div className="animate-fade-in-up delay-100">
              <Image src="/im1.png" alt="Speak Confidently" width={100} height={100} className="mx-auto" />
              <h3 className="text-xl font-semibold mt-4 mb-2">Speak English Confidently</h3>
              <p className="text-gray-600">Learn to express yourself with fluency and confidence in real-world conversations.</p>
            </div>
            <div className="animate-fade-in-up delay-200">
              <Image src="/im2.png" alt="Free Grammar" width={100} height={100} className="mx-auto" />
              <h3 className="text-xl font-semibold mt-4 mb-2">Free Grammar Training</h3>
              <p className="text-gray-600">Improve your English grammar with free, AI-powered learning tools.</p>
            </div>
            <div className="animate-fade-in-up delay-300">
              <Image src="/im3.png" alt="Interview" width={100} height={100} className="mx-auto" />
              <h3 className="text-xl font-semibold mt-4 mb-2">Impress in Interviews</h3>
              <p className="text-gray-600">Practice interview questions and get smart suggestions.</p>
            </div>
          </div>
        </section>

        
      </main>

      {/* Extra dark footer */}
      <section className="bg-[#1f1f1f] text-white w-full py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-sm justify-center">
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4">IELTS Flow</h2>
            <p className="mb-2">Almaty, Kz</p>
            <p className="text-xs text-gray-400 mt-6">2025 © IELTS Flow </p>
          </div>
         
         
          
         
        </div>
      </section>
    </div>
  );
}
