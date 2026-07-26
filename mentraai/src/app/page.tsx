'use client';

import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.push('/dashboard');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,rgba(10,10,20,0.8),rgba(20,20,40,0.6))]" />
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10">
          <nav className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <span className="text-2xl font-bold text-white">MentraAI</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/auth/sign-in">
                  <Button variant="ghost" className="text-gray-300 hover:text-violet-400 font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-violet-500/25 transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </nav>

          <main className="container mx-auto px-6">
            <div className="text-center py-20">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  MentraAI
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your workflow with the power of artificial intelligence. 
                Collaborate, create, and innovate like never before with our cutting-edge platform 
                designed for the future of work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/auth/sign-up">
                  <Button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 transform hover:scale-105 text-lg">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/sign-in">
                  <Button variant="outline" className="px-8 py-4 border-2 border-violet-500/30 hover:border-violet-500 text-gray-300 hover:text-white font-semibold rounded-xl shadow-sm hover:shadow-violet-500/20 transition-all duration-200 text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}