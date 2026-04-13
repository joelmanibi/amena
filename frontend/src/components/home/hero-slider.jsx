'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const SLIDE_DURATION = 8000;
  const PROGRESS_STEP = 100;

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, slides.length]);

  const goToSlide = (index) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setCurrent(index);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, SLIDE_DURATION);
    
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (PROGRESS_STEP / SLIDE_DURATION) * 100;
      });
    }, PROGRESS_STEP);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, [nextSlide]);

  return (
    <div className="relative overflow-hidden bg-brand-black h-[100svh] min-h-[600px] flex items-center group/slider">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={`bg-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
          }`}
        >
          {/* Image with Ken Burns effect */}
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${
              index === current ? 'scale-110' : 'scale-100'
            }`}
            style={{ backgroundImage: `url(${slide.image || '/branding/hero1.jpg'})` }}
          />
          {/* Professional Overlay System */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/90 via-brand-black/40 to-brand-black/90 lg:bg-gradient-to-r lg:from-brand-black/100 lg:via-brand-black/70 lg:to-transparent z-10" />
          <div className="absolute inset-0 bg-brand-black/20 z-10" />
          
          {/* Decorative Pattern Overlay - Hidden on small mobile for clarity */}
          <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none hidden sm:block" 
               style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
      ))}

      <div className="container-shell relative z-20 w-full pt-20 lg:pt-0">
        <div className="max-w-5xl mx-auto lg:mx-0">
          {slides.map((slide, index) => (
            <div
              key={`content-${index}`}
              className={`transition-all duration-1000 ease-out ${
                index === current 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-12 absolute inset-0 pointer-events-none'
              }`}
            >
              {index === current && (
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left bg-brand-black/40 lg:bg-brand-black/20 backdrop-blur-md lg:backdrop-blur-lg p-6 sm:p-10 lg:p-12 lg:-ml-12 rounded-[2.5rem] lg:rounded-[3rem] border border-white/10 shadow-2xl mx-2 sm:mx-0">
                  {/* Eyebrow with Animation */}
                  <div className="overflow-hidden mb-4 sm:mb-6">
                    <Badge className="animate-in slide-in-from-bottom-full duration-700 border border-white/20 bg-white/10 text-white backdrop-blur-md px-4 sm:px-5 py-1 sm:py-1.5 text-[10px] sm:text-xs lg:text-sm font-bold tracking-[0.2em] uppercase rounded-full">
                      AMENA CONSULTING
                    </Badge>
                  </div>

                  {/* Title with Staggered Character Animation Feel */}
                  <div className="relative mb-6 sm:mb-8">
                    {/* Decorative Accent Line - Hidden on mobile text-center */}
                    <div className="absolute -left-10 top-2 bottom-2 w-2 bg-brand-red rounded-full animate-in fade-in zoom-in duration-1000 hidden lg:block" />
                    
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] sm:leading-[1.05] [text-shadow:_0_4px_20px_rgb(0_0_0_/_80%)] animate-in slide-in-from-left-8 lg:slide-in-from-left-12 duration-1000">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className={i % 3 === 2 ? 'text-brand-red inline' : 'inline'}>
                          {word}{' '}
                        </span>
                      ))}
                    </h1>
                  </div>

                  {/* Description with delayed entry */}
                  <p className="max-w-2xl text-base sm:text-xl lg:text-2xl leading-relaxed text-white font-medium [text-shadow:_0_2px_10px_rgb(0_0_0_/_60%)] animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 opacity-90">
                    {slide.description}
                  </p>

                  {/* Buttons with combined effects */}
                  <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-500">
                    <Link href={slide.primaryLink} className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-brand-red px-8 sm:px-10 py-4 sm:py-5 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(196,22,28,0.5)] active:scale-95 text-sm sm:text-base">
                      <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                        {slide.primaryCta}
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-2" />
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    </Link>
                    
                    <Link href="/about" className="group inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-white/5 px-8 sm:px-10 py-4 sm:py-5 font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-brand-black active:scale-95 text-sm sm:text-base">
                      <Play className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                      Notre expertise
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modern Navigation UI - Optimized for touch and small screens */}
      <div className="absolute bottom-10 sm:bottom-16 left-0 right-0 z-30 px-4 sm:px-0">
        <div className="container-shell flex items-center lg:items-end justify-between lg:justify-between">
          {/* Progress Indicators */}
          <div className="flex gap-4 sm:gap-6 items-center flex-1 lg:flex-none justify-center lg:justify-start">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group flex flex-col gap-2 sm:gap-3 py-2 sm:py-4 transition-all"
                aria-label={`Slide ${index + 1}`}
              >
                <span className={`text-[10px] sm:text-xs font-black tracking-widest transition-colors ${index === current ? 'text-brand-red' : 'text-white/40 group-hover:text-white/70'}`}>
                  0{index + 1}
                </span>
                <div className="h-1.5 w-12 sm:w-24 bg-white/10 rounded-full overflow-hidden relative">
                  <div 
                    className={`absolute inset-0 bg-brand-red transition-all duration-300 ${
                      index === current ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ width: index === current ? `${progress}%` : '0%' }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Minimalist Arrows - Hidden on small mobile to avoid clutter */}
          <div className="hidden sm:flex gap-2 p-1 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 opacity-100 lg:opacity-0 lg:translate-y-4 lg:group-hover/slider:opacity-100 lg:group-hover/slider:translate-y-0 transition-all duration-500">
            <button
              onClick={prevSlide}
              className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-full text-white transition-all hover:bg-brand-red active:scale-90"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 lg:h-8 lg:w-8" />
            </button>
            <div className="w-[1px] h-8 lg:h-10 bg-white/10 self-center" />
            <button
              onClick={nextSlide}
              className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-full text-white transition-all hover:bg-brand-red active:scale-90"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 lg:h-8 lg:w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Background Counter Text - Hidden on mobile and tablets */}
      <div className="absolute bottom-0 right-0 opacity-[0.03] select-none pointer-events-none hidden xl:block">
        <span className="text-[25rem] font-black text-white leading-none translate-y-1/4 inline-block">
          0{current + 1}
        </span>
      </div>
    </div>
  );
}
