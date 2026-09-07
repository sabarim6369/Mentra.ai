import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative">
        <div className="relative z-10">
          <nav className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl md:text-2xl font-bold text-white">MentraAI</span>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                <Link 
                  to="/login"
                  className="text-slate-300 hover:text-white font-medium px-3 md:px-4 py-2 transition-colors text-sm md:text-base"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors px-4 md:px-6 py-2 rounded-lg text-sm md:text-base"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </nav>

          <main className="container mx-auto px-4 md:px-6">
            <div className="text-center py-12 md:py-20">
              <div className="flex justify-center mb-6 md:mb-8">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Welcome to
                <span className="block text-blue-500">
                  MentraAI
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Transform your workflow with the power of artificial intelligence. 
                Collaborate, create, and innovate like never before with our cutting-edge platform 
                designed for the future of work.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 px-4">
                <Link 
                  to="/signup"
                  className="px-6 md:px-8 py-3 md:py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-base md:text-lg flex items-center justify-center"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Link>
                <Link 
                  to="/login"
                  className="px-6 md:px-8 py-3 md:py-4 border-2 border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors text-base md:text-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;