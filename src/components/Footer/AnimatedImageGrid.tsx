'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { getDirectusImageUrl } from '@/lib/utils';
import { AnimatedImageGridProps, DirectusFile } from '@/lib/types';

export default function AnimatedImageGrid({ images }: AnimatedImageGridProps) {
  return (
    <>
      {images.map((img: DirectusFile, idx: number) => {
        const imageId =
          typeof img === "object" && img !== null && "id" in img
            ? (img as { id: string }).id
            : typeof img === "string"
              ? img
              : `img-${idx}`;
        const assetPath =
          typeof img === "object" && img !== null && "image" in img
            ? String(img.image)
            : imageId;

        return (
          <motion.div
            key={imageId}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              opacity: { duration: 0.7, ease: "easeOut", delay: idx * 0.12 },
              scale: { duration: 0.7, ease: "easeOut", delay: idx * 0.12 },
              y: { duration: 0.7, ease: "easeOut", delay: idx * 0.12 },
            }}
            className="w-full h-full group"
          >
            <div className="w-full aspect-square relative overflow-hidden bg-neutral-800/40 block">
              <Image
                src={getDirectusImageUrl(assetPath, {
                  width: 500,
                  quality: 80,
                  format: "webp",
                })}
                alt="Instagram image"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="eager"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </motion.div>
        );
      })}
    </>
  );
}
