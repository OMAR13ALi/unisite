
import React from 'react';
import { useState, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  interval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, interval = 5000 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(-1);
  
  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setPreviousImageIndex(currentImageIndex);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentImageIndex, images.length, interval]);
  
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      {images.map((imageUrl, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat
            ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden={index !== currentImageIndex}
        />
      ))}
      
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6 text-white animate-slide-up drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
            Academic Excellence & Innovation
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 animate-slide-up drop-shadow-md" style={{ animationDelay: '0.4s' }}>
            Advancing research and education in computer science and artificial intelligence
          </p>
          <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <a 
              href="#research" 
              className="px-6 py-3 bg-primary text-white rounded-md transition-colors hover:bg-primary/90"
            >
              Explore Research
            </a>
            <a 
              href="#publications" 
              className="px-6 py-3 border border-white text-white rounded-md transition-colors hover:bg-white/10"
            >
              View Publications
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setPreviousImageIndex(currentImageIndex);
              setCurrentImageIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ImageCarousel;
