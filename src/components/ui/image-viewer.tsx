'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ImageViewerProps {
  images: string[];
  title: string;
}

export function ImageViewer({ images, title }: ImageViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, images.length, nextSlide]);

  return (
    <>
      <div className="mb-12 relative group"
           onMouseEnter={() => setIsPaused(true)}
           onMouseLeave={() => setIsPaused(false)}>
        {/* Main Carousel */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                'absolute inset-0 transition-transform duration-500 ease-in-out',
                currentSlide === index 
                  ? 'translate-x-0 opacity-100' 
                  : index > currentSlide 
                    ? 'translate-x-full opacity-0'
                    : '-translate-x-full opacity-0'
              )}
              onClick={() => setIsFullscreen(true)}
            >
              <Image
                src={image}
                alt={`${title} screenshot ${index + 1}`}
                fill
                className="object-cover cursor-pointer"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          ))}
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2  bg-white/10 hover:bg-white/20 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2  bg-white/10 hover:bg-white/20 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="mt-4 flex justify-center">
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-[80%]">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all',
                  currentSlide === index 
                    ? 'ring-4 ring-primary z-10 shadow-lg' 
                    : 'ring-1 ring-border hover:ring-primary/50'
                )}
              >
                <Image
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
             onMouseEnter={() => setIsPaused(true)}
             onMouseLeave={() => setIsPaused(false)}>
          <div className="relative w-full h-full flex flex-col">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-50 hover:bg-white/10"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Fullscreen Image */}
            <div className="flex-1 relative">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    'absolute inset-0 transition-transform duration-500 ease-in-out',
                    currentSlide === index 
                      ? 'translate-x-0 opacity-100' 
                      : index > currentSlide 
                        ? 'translate-x-full opacity-0'
                        : '-translate-x-full opacity-0'
                  )}
                >
                  <Image
                    src={image}
                    alt={`${title} screenshot ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              ))}

              {/* Fullscreen Navigation */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Fullscreen Thumbnails */}
            <div className="p-4">
              <div className="flex justify-center">
                <div className="flex gap-2 overflow-x-auto pb-2 max-w-[80%]">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        'relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden transition-all',
                        currentSlide === index 
                          ? 'ring-4 ring-primary scale-110 z-10 shadow-lg' 
                          : 'ring-1 ring-white/20 hover:ring-white/50'
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
