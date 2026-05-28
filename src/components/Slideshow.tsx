import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const images = [
  'https://wallpapercave.com/wp/wp7626926.jpg',
  'https://www.image2url.com/r2/default/images/1779300757609-034d4088-2135-4cdc-9855-f8fe07d80caa.png',
  'https://wallpapercave.com/wp/wp14293574.jpg',
  'https://www.image2url.com/r2/default/images/1779300841775-fadb05cd-1031-4892-9732-d6c088ee0733.png',
  'https://wallpapercave.com/wp/wp14044255.jpg',
  'https://www.image2url.com/r2/default/images/1779300930239-5deeb6d0-b83f-43c1-937e-0efae663efbc.png',
  'https://wallpapercave.com/wp/wp11166273.jpg',
  'https://wallpapercave.com/wp/wp14018932.png',
  'https://www.image2url.com/r2/default/images/1779301000516-73837cf4-764e-466a-97dd-ce8ab596b342.png',
  'https://wallpapercave.com/wp/wp12952221.jpg',
  'https://wallpapercave.com/wp/wp12794793.png',
  'https://wallpapercave.com/wp/wp5553151.jpg',
  'https://wallpapercave.com/wp/wp5535573.jpg',
  'https://wallpapercave.com/wp/wp1853123.jpg ',
  'https://wallpapercave.com/wp/wp14727284.jpg',
  'https://wallpapercave.com/wp/wp15414776.jpg',
  'https://wallpapercave.com/wp/wp2099122.jpg',
  'https://wallpapercave.com/wp/wp14606224.jpg',
  'https://wallpapercave.com/wp/wp14727181.jpg',
  'https://wallpapercave.com/wp/wp12626915.jpg',
  'https://wallpapercave.com/wp/wp15946372.jpg',
  'https://wallpapercave.com/wp/wp15830261.jpg',
  'https://wallpapercave.com/wp/wp15830343.jpg',
  'https://wallpapercave.com/wp/wp15335654.jpg',
  'https://wallpapercave.com/wp/wp12626803.jpg',
  'https://wallpapercave.com/wp/wp8003758.jpg',
  'https://wallpapercave.com/wp/wp4699040.png',
  'https://wallpapercave.com/wp/wp5944372.jpg'
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
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full h-full object-cover"
          alt="Slideshow"
        />
      </AnimatePresence>
    </div>
  );
}
