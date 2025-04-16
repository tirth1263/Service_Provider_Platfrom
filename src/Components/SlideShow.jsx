import { useEffect, useState } from 'react';
import slider1 from '../Img/slider-1.jpeg';
import slider2 from '../Img/slider-2.jpg';
import slider3 from '../Img/slider-3.jpg';
import slider4 from '../Img/slider-3.jpg';

const slides = [slider1, slider2, slider3,slider4];

const Slideshow = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[300px] md:h-[500px] w-full">
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full text-xl z-20 cursor-pointer"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full text-xl z-20 cursor-pointer"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Slideshow;
