import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const images = [
  'https://www.image2url.com/r2/default/images/1779300757609-034d4088-2135-4cdc-9855-f8fe07d80caa.png',
  'https://www.image2url.com/r2/default/images/1779300841775-fadb05cd-1031-4892-9732-d6c088ee0733.png',
  'https://www.image2url.com/r2/default/images/1779300930239-5deeb6d0-b83f-43c1-937e-0efae663efbc.png',
  'https://www.image2url.com/r2/default/images/1779301000516-73837cf4-764e-466a-97dd-ce8ab596b342.png',
  'https://wallpapercave.com/wp/wp5553151.jpg'
];

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1]">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full h-full object-cover"
          alt="Slideshow"
        />
      </AnimatePresence>
    </div>
  );
}
