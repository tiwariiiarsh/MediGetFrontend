import { useEffect, useRef, useState } from "react";

const CountingNumber = ({ number = 0, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);
  const ref = useRef(null);

  // 👇 Detect when visible on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnimation(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // 👇 Start counting only when visible
  useEffect(() => {
    if (!startAnimation) return;

    let start = 0;
    const increment = number / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= number) {
        start = number;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [startAnimation, number, duration]);

  return (
    <span
      ref={ref}
      className="text-4xl md:text-5xl font-bold 
                 bg-gradient-to-r from-emerald-400 to-cyan-400 
                 bg-clip-text text-transparent"
    >
      {count}+
    </span>
  );
};

export default CountingNumber;