import React, { useState, useMemo, useEffect, useCallback } from 'react';
import '../../styles/photo-wheel.css';
import PhotoWheel, { type PhotoWheelOption } from './PhotoWheel';
import { allPhotos, type Photo } from '../../data/photography';

interface PhotographyWheelPickerProps {
  initialPhotoId?: string;
}

export default function PhotographyWheelPicker({
  initialPhotoId = allPhotos[0]?.id,
}: PhotographyWheelPickerProps) {
  // Track active photo ID (PHOTO is the genuine continuous 3D snap point)
  const [activePhotoId, setActivePhotoId] = useState<string>(initialPhotoId);

  // Derive current active photo
  const activePhoto = useMemo(() => {
    return allPhotos.find(p => p.id === activePhotoId) || allPhotos[0];
  }, [activePhotoId]);

  // Derive current city & year directly from active photo:
  // activeCity = activePhoto.city, activeYear = activePhoto.year
  const activeCity = activePhoto.locationEn;
  const activeYear = activePhoto.year;

  // Derive unique years in chronological order
  const uniqueYears = useMemo(() => {
    return Array.from(new Set(allPhotos.map(p => p.year)));
  }, []);

  // Surrounding years: previous year and next year
  const currentYearIdx = uniqueYears.indexOf(activeYear);
  const prevYear = currentYearIdx > 0 ? uniqueYears[currentYearIdx - 1] : null;
  const nextYear = currentYearIdx < uniqueYears.length - 1 ? uniqueYears[currentYearIdx + 1] : null;

  // Update selection and notify the gallery
  const notifyPhotoChange = useCallback((photo: Photo) => {
    setActivePhotoId(photo.id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('photography:photo-selected', { detail: photo }));
    }
  }, []);

  // Handle wheel value change
  const handlePhotoChange = (newPhotoId: string) => {
    const photo = allPhotos.find(p => p.id === newPhotoId);
    if (photo) {
      notifyPhotoChange(photo);
    }
  };

  // Jump to first photo of a specific year
  const handleYearJump = useCallback((year: number) => {
    const targetPhoto = allPhotos.find(p => p.year === year);
    if (targetPhoto) {
      notifyPhotoChange(targetPhoto);
    }
  }, [notifyPhotoChange]);

  // Listen for active photo updates triggered externally (keyboard, stage wheel, stage buttons)
  useEffect(() => {
    const handleExternalPhoto = (e: CustomEvent<Photo>) => {
      if (e.detail?.id && e.detail.id !== activePhotoId) {
        setActivePhotoId(e.detail.id);
      }
    };
    window.addEventListener('photography:external-photo-selected', handleExternalPhoto as EventListener);
    return () => window.removeEventListener('photography:external-photo-selected', handleExternalPhoto as EventListener);
  }, [activePhotoId]);

  // Format all photos as unified 3D wheel items:
  // Every photo has its own thumbnail item.
  // The first photo of each city carries the City Header Marker above it with generous vertical breathing room!
  const photoOptions: PhotoWheelOption[] = useMemo(() => {
    return allPhotos.map((photo, index) => {
      const isFirstInCity = index === 0 || allPhotos[index - 1].cityId !== photo.cityId;
      return {
        value: photo.id,
        textValue: `${photo.year} ${photo.locationEn} ${photo.title}`,
        label: (
          <div className="w-full h-full flex flex-col items-center justify-center select-none px-0.5 relative">
            {/* City Section Marker (Appears above the first photo of the city, with generous 10px breathing room) */}
            {isFirstInCity && (
              <div
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="city-header-badge text-[0.56rem] sm:text-[0.6rem] font-bold uppercase tracking-[0.14rem] text-[#1A1A1A] text-center w-full truncate leading-none mb-2.5 shrink-0 z-10"
              >
                {photo.locationEn}
              </div>
            )}

            {/* Photo Paper Card */}
            <div className="photo-paper-card relative bg-white p-0.5 rounded-[2px] shadow-xs w-full max-w-[72px] sm:max-w-[78px] aspect-[3/2] flex items-center justify-center">
              <div className="relative w-full h-full bg-[#EAEAEA] overflow-hidden rounded-[1px]">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ),
      };
    });
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-start select-none relative overflow-hidden">
      
      {/* Unified Horizon: Direct Left Rail + 3D Photo Wheel with comfortable breathing gap */}
      <div className="w-full flex items-center justify-start gap-3 sm:gap-4">
        
        {/* 1. YEAR & CITY SECTION MARKER RAIL (Left Column: Compact & Refined, Docked to left edge) */}
        <div className="w-[76px] sm:w-[82px] shrink-0 flex flex-col items-start justify-center select-none z-30 pr-0.5">
          {/* Previous Year (Subtle, clickable) */}
          <button
            type="button"
            onClick={() => prevYear && handleYearJump(prevYear)}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            className={`h-6 flex items-center text-[0.72rem] sm:text-[0.78rem] tracking-[0.12rem] font-bold transition-colors duration-200 cursor-pointer text-left ${
              prevYear ? 'text-[#8C8C8C] hover:text-[#111111]' : 'opacity-0 pointer-events-none'
            }`}
            title={prevYear ? `跳转至 ${prevYear} 年` : undefined}
          >
            <span>{prevYear || '----'}</span>
          </button>

          {/* Current Year & Active City (Prominent, bold, Compacted text) */}
          <div className="my-1.5 flex flex-col items-start gap-0.5">
            <span
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              className="font-bold text-[1.02rem] sm:text-[1.14rem] text-[#111111] tracking-[0.14rem] leading-none"
            >
              {activeYear}
            </span>
            <span
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="text-[0.58rem] sm:text-[0.62rem] font-bold tracking-[0.1rem] uppercase text-[#222222] whitespace-nowrap leading-tight"
            >
              {activeCity}
            </span>
          </div>

          {/* Next Year (Subtle, clickable) */}
          <button
            type="button"
            onClick={() => nextYear && handleYearJump(nextYear)}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            className={`h-6 flex items-center text-[0.72rem] sm:text-[0.78rem] tracking-[0.12rem] font-bold transition-colors duration-200 cursor-pointer text-left ${
              nextYear ? 'text-[#8C8C8C] hover:text-[#111111]' : 'opacity-0 pointer-events-none'
            }`}
            title={nextYear ? `跳转至 ${nextYear} 年` : undefined}
          >
            <span>{nextYear || '----'}</span>
          </button>
        </div>

        {/* 2. THE 3D PHOTO WHEEL (Continuous 3D cylinder: PHOTO is the snap point) */}
        <div className="w-[82px] sm:w-[88px] shrink-0 photo-wheel-viewport overflow-hidden relative z-20 flex items-center justify-center h-[340px] sm:h-[360px]">
          <div data-rwp-wrapper className="w-full bg-transparent border-0 shadow-none">
            <PhotoWheel
              value={activePhoto.id}
              options={photoOptions}
              onValueChange={handlePhotoChange}
            />
          </div>
        </div>

      </div>

      {/* Scoped Styles for 3D Photo Wheel */}
      <style>{`
        /* Viewport Depth Feathering Mask */
        .photo-wheel-viewport {
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 24px,
            black calc(100% - 24px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 24px,
            black calc(100% - 24px),
            transparent 100%
          );
        }

        /* 3D Photo Wheel Items: ZERO conflicting transform transitions for 60/120fps smoothness */
        .photo-wheel-option {
          cursor: pointer;
          will-change: transform;
          transform-style: preserve-3d;
        }
        .photo-wheel-option > div {
          transform-style: preserve-3d;
        }
        /* One face-on caption: ancestor opacity/will-change:opacity would flatten it. */
        .photo-wheel-option .city-header-badge {
          transform: rotateX(calc(var(--photo-item-angle) - var(--photo-wheel-angle)));
          opacity: calc(1 - 0.68 * var(--photo-caption-distance));
          filter: blur(calc(0.4px * var(--photo-caption-distance)));
        }
        .photo-wheel-highlight-item .city-header-badge {
          visibility: hidden;
        }
        .photo-wheel-option .photo-paper-card {
          opacity: 0.32;
          filter: blur(0.4px);
          transition: opacity 0.18s ease-out, filter 0.18s ease-out;
        }
        .photo-wheel-option:hover .photo-paper-card {
          opacity: 0.8;
          filter: blur(0px);
        }
        .photo-wheel-highlight-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          pointer-events: none;
          z-index: 30;
        }
        .photo-wheel-highlight-item {
          opacity: 1 !important;
          z-index: 35;
        }
        .photo-wheel-highlight-item .photo-paper-card {
          box-shadow: 0 0 0 1.5px #222 !important;
          outline: none !important;
          border: none !important;
        }
      `}</style>

    </div>
  );
}
