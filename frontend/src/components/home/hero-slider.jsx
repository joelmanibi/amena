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
    <div className="relative overflow-hidden bg-brand-black h-[600px] sm:h-[750px] lg:h-[90vh] min-h-[650px] flex items-center group/slider">
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
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/100 via-brand-black/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-brand-black/40 z-10" />
          
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
      ))}

      <div className="container-shell relative z-20 w-full">
        <div className="max-w-5xl">
          {slides.map((slide, index) => (
            <div
              key={`content-${index}`}
              className={`transition-all duration-1000 ease-out ${
                index === current 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-20 absolute inset-0 pointer-events-none'
              }`}
            >
              {index === current && (
                <div className="flex flex-col items-start text-left bg-brand-black/20 backdrop-blur-md p-8 sm:p-12 -ml-8 sm:-ml-12 rounded-[3rem] border border-white/5 shadow-2xl">
                  {/* Eyebrow with Animation */}
                  <div className="overflow-hidden mb-6">
                    <Badge className="animate-in slide-in-from-bottom-full duration-700 border border-white/20 bg-white/10 text-white backdrop-blur-md px-5 py-1.5 text-sm font-semibold tracking-[0.2em] uppercase rounded-full">
                      AMENA CONSULTING
                    </Badge>
                  </div>

                  {/* Title with Staggered Character Animation Feel */}
                  <div className="relative mb-8">
                    {/* Decorative Accent Line */}
                    <div className="absolute -left-10 top-2 bottom-2 w-2 bg-brand-red rounded-full animate-in fade-in zoom-in duration-1000" />
                    
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl leading-[1.05] [text-shadow:_0_8px_30px_rgb(0_0_0_/_60%)] animate-in slide-in-from-left-12 duration-1000">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className={i % 3 === 2 ? 'text-brand-red block sm:inline' : ''}>
                          {word}{' '}
                        </span>
                      ))}
                    </h1>
                  </div>

                  {/* Description with delayed entry */}
                  <p className="mt-4 max-w-2xl text-xl sm:text-2xl leading-relaxed text-white font-medium [text-shadow:_0_2px_15px_rgb(0_0_0_/_50%)] animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
                    {slide.description}
                  </p>

                  {/* Buttons with combined effects */}
                  <div className="mt-12 flex flex-col gap-6 sm:flex-row animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-500">
                    <Link href={slide.primaryLink} className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-brand-red px-10 py-5 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(196,22,28,0.5)] active:scale-95">
                      <span className="relative z-10 flex items-center gap-3">
                        {slide.primaryCta}
                        <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    </Link>
                    
                    <Link href="/about" className="group inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-white/5 px-10 py-5 font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-brand-black active:scale-95">
                      <Play className="mr-3 h-5 w-5 fill-current" />
                      Notre expertise
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modern Navigation UI */}
      <div className="absolute bottom-16 left-0 right-0 z-30">
        <div className="container-shell flex items-end justify-between">
          {/* Progress Indicators */}
          <div className="flex gap-6 items-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group flex flex-col gap-3 py-4 transition-all"
                aria-label={`Slide ${index + 1}`}
              >
                <span className={`text-xs font-black tracking-widest transition-colors ${index === current ? 'text-brand-red' : 'text-white/40 group-hover:text-white/70'}`}>
                  0{index + 1}
                </span>
                <div className="h-1 w-16 sm:w-24 bg-white/10 rounded-full overflow-hidden relative">
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

          {/* Large Minimalist Arrows */}
          <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 opacity-0 translate-y-4 group-hover/slider:opacity-100 group-hover/slider:translate-y-0 transition-all duration-500">
            <button
              onClick={prevSlide}
              className="flex h-16 w-16 items-center justify-center rounded-full text-white transition-all hover:bg-brand-red active:scale-90"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <div className="w-[1px] h-10 bg-white/10 self-center" />
            <button
              onClick={nextSlide}
              className="flex h-16 w-16 items-center justify-center rounded-full text-white transition-all hover:bg-brand-red active:scale-90"
              aria-label="Next slide"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Background Counter Text */}
      <div className="absolute bottom-0 right-0 opacity-[0.03] select-none pointer-events-none hidden lg:block">
        <span className="text-[25rem] font-black text-white leading-none translate-y-1/4 inline-block">
          0{current + 1}
        </span>
      </div>
    </div>
  );
}
