// Original image dimensions
const DESKTOP_ORIGINAL_W = 6000;
const DESKTOP_ORIGINAL_H = 3375;
const MOBILE_ORIGINAL_W = 2827;
const MOBILE_ORIGINAL_H = 3375;

// Desktop coordinates (for 6000x3375 image)
export const DesktopCoordinateAreas = [
  {
    id: 3,
    coords: [
      { x: 1948, y: 2603 },
      { x: 1954, y: 688 },
      { x: 2139, y: 598 },
      { x: 2573, y: 630 },
      { x: 3128, y: 80 },
      { x: 3922, y: 170 },
      { x: 3895, y: 2867 },
    ],
  },
];

// Mobile coordinates (for 2827x3375 image)
// These are your original mobile coordinates - keep them as they are
export const MobileCoordinateAreas = [
  {
    id: 1, // Keep your original ID
    coords: [
      { x: 494, y: 2638 },
      { x: 497, y: 731 },
      { x: 1147, y: 641 },
      { x: 1686, y: 117 },
      { x: 2444, y: 210 },
      { x: 2416, y: 2737 },
      { x: 1641, y: 2941 },
    ],
  },
];

// Helper function to get coordinates based on device type
export const getCoordinateAreas = (isMobile: boolean) => {
  return isMobile ? MobileCoordinateAreas : DesktopCoordinateAreas;
};

// Export dimensions for use in components
export const IMAGE_DIMENSIONS = {
  DESKTOP: {
    WIDTH: DESKTOP_ORIGINAL_W,
    HEIGHT: DESKTOP_ORIGINAL_H,
  },
  MOBILE: {
    WIDTH: MOBILE_ORIGINAL_W,
    HEIGHT: MOBILE_ORIGINAL_H,
  },
} as const;
