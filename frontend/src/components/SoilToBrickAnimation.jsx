import React, { useRef, useEffect, useCallback } from 'react';
import '../styles/soil-to-brick.css';

/**
 * Natural soil and clay color palette sampled directly from authentic
 * Classic Mun Bricks raw clay and terracotta tones.
 */
const CLAY_PALETTE = [
  '#8F3318', // Deep terracotta
  '#B84A28', // Signature Classic Mun terracotta
  '#A23E1F', // Clay red-brown
  '#7A2812', // Rich mineral soil
  '#C85B33', // Terracotta clay dust
  '#5C200E', // Dark organic clay loam
  '#D46D44', // Surface clay powder
  '#9B3B1B', // Dense compacted soil
];

const CLAY_LIGHT_PALETTE = [
  '#C85B33',
  '#D46D44',
  '#B84A28',
  '#A23E1F',
];

/**
 * SoilToBrickAnimation Component
 * 
 * Environmental Canvas Layer spanning the full Manufacturing Excellence section:
 * Soil and clay particles drift across the section and converge into the
 * exact position of the client brick on the right.
 * 
 * @param {Object} props
 * @param {React.RefObject} props.sectionRef - Reference to the parent section
 * @param {React.RefObject} props.sectionRef - Reference to the parent section
 * @param {React.RefObject} props.brickTargetRef - Reference to the target brick stage
 * @param {number} props.animationProgress - Normalized 0.0 to 1.0 animation progress
 * @param {number} props.scrollProgress - Fallback scroll progress
 * @param {number} props.formationY - Downward translation in pixels
 * @param {boolean} props.isMobile - Viewport indicator
 */
const SoilToBrickAnimation = ({ 
  sectionRef, 
  brickTargetRef, 
  animationProgress = 0,
  scrollProgress,
  formationY = 0,
  isMobile = false 
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const isVisibleRef = useRef(false);

  const initialProgress = animationProgress !== undefined ? animationProgress : (scrollProgress || 0);
  const internalProgressRef = useRef(initialProgress);
  const formationYRef = useRef(formationY);

  // Keep internal progress and formationY refs updated without triggering re-renders
  useEffect(() => {
    const val = animationProgress !== undefined ? animationProgress : (scrollProgress || 0);
    internalProgressRef.current = Math.min(1, Math.max(0, val));
  }, [animationProgress, scrollProgress]);

  useEffect(() => {
    formationYRef.current = formationY;
  }, [formationY]);

  // Compute current brick target coordinates relative to the section
  const getBrickTarget = useCallback((width, height) => {
    if (brickTargetRef?.current && sectionRef?.current) {
      const sRect = sectionRef.current.getBoundingClientRect();
      const bRect = brickTargetRef.current.getBoundingClientRect();

      // Only use DOM rect if it has valid dimensions
      if (bRect.width > 0 && bRect.height > 0) {
        return {
          cx: (bRect.left + bRect.width / 2) - sRect.left,
          cy: (bRect.top + bRect.height / 2) - sRect.top,
          bw: bRect.width || (isMobile ? 180 : 250),
          bh: bRect.height || (isMobile ? 175 : 235),
        };
      }
    }

    // Default geometric placement fallback
    return {
      cx: isMobile ? width * 0.5 : width * 0.75,
      cy: isMobile ? height * 0.55 : height * 0.50,
      bw: isMobile ? 180 : 250,
      bh: isMobile ? 175 : 235,
    };
  }, [brickTargetRef, sectionRef, isMobile]);

  // Initialize soil particles distributed across the whole section
  const initParticles = useCallback((width, height) => {
    const count = isMobile ? 38 : 105;
    const { cx, cy, bw, bh } = getBrickTarget(width, height);
    const particles = [];

    for (let i = 0; i < count; i++) {
      let scatterX, scatterY, size, alphaBase, color, depth;

      if (!isMobile) {
        // DESKTOP: Distribute particles intelligently across 3 zones
        const rand = Math.random();

        if (rand < 0.20) {
          // Zone 1: Far Left / Text Area (20% of particles)
          // Delicate, small, low-opacity particles to keep text 100% readable
          scatterX = Math.random() * (width * 0.42);
          scatterY = Math.random() * height;
          size = 1.6 + Math.random() * 2.0;
          alphaBase = 0.16 + Math.random() * 0.18;
          color = CLAY_LIGHT_PALETTE[Math.floor(Math.random() * CLAY_LIGHT_PALETTE.length)];
          depth = 0.4 + Math.random() * 0.3; // Far layer
        } else if (rand < 0.55) {
          // Zone 2: Section Edges (Top, Bottom, Diagonal Entry) (35% of particles)
          scatterX = Math.random() * width;
          // Enter from top 22% or bottom 22% of section
          scatterY = Math.random() < 0.5 
            ? Math.random() * (height * 0.22) 
            : height * 0.78 + Math.random() * (height * 0.22);
          size = 2.2 + Math.random() * 3.2;
          alphaBase = 0.35 + Math.random() * 0.25;
          color = CLAY_PALETTE[Math.floor(Math.random() * CLAY_PALETTE.length)];
          depth = 0.6 + Math.random() * 0.4; // Mid layer
        } else {
          // Zone 3: Right Transformation Field (45% of particles)
          scatterX = width * 0.45 + Math.random() * (width * 0.52);
          scatterY = Math.random() * height;
          size = 2.8 + Math.random() * 4.6;
          alphaBase = 0.50 + Math.random() * 0.35;
          color = CLAY_PALETTE[Math.floor(Math.random() * CLAY_PALETTE.length)];
          depth = 0.7 + Math.random() * 0.6; // Near layer
        }
      } else {
        // MOBILE: Lighter particle field primarily in the transformation zone
        const rand = Math.random();
        if (rand < 0.25) {
          // Upper area (faint, small)
          scatterX = Math.random() * width;
          scatterY = Math.random() * (height * 0.45);
          size = 1.5 + Math.random() * 1.8;
          alphaBase = 0.15 + Math.random() * 0.15;
          color = CLAY_LIGHT_PALETTE[Math.floor(Math.random() * CLAY_LIGHT_PALETTE.length)];
          depth = 0.4 + Math.random() * 0.3;
        } else {
          // Lower stage area
          scatterX = Math.random() * width;
          scatterY = height * 0.30 + Math.random() * (height * 0.65);
          size = 2.2 + Math.random() * 3.4;
          alphaBase = 0.40 + Math.random() * 0.30;
          color = CLAY_PALETTE[Math.floor(Math.random() * CLAY_PALETTE.length)];
          depth = 0.6 + Math.random() * 0.5;
        }
      }

      // Target coordinate strictly mapped to the brick body surface & volume
      const targetX = cx - bw / 2 + Math.random() * bw;
      const targetY = cy - bh / 2 + Math.random() * bh;

      // Irregular polygon vertices for authentic soil aggregate crumb texture
      const numPoints = Math.floor(Math.random() * 3) + 4; // 4 to 6 vertices
      const polygonPoints = [];
      for (let p = 0; p < numPoints; p++) {
        const pAngle = (p / numPoints) * Math.PI * 2;
        const pRad = size * (0.65 + Math.random() * 0.65);
        polygonPoints.push({
          x: Math.cos(pAngle) * pRad,
          y: Math.sin(pAngle) * pRad,
        });
      }

      particles.push({
        scatterX,
        scatterY,
        targetX,
        targetY,
        polygonPoints,
        size,
        alphaBase,
        color,
        depth,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        driftPhase: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = particles;
  }, [getBrickTarget, isMobile]);

  // Resize canvas with high-DPI scaling to cover the full section
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef?.current;
    if (!canvas || !section) return;

    const handleResize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      initParticles(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [sectionRef, initParticles]);

  // Visibility detection with IntersectionObserver
  useEffect(() => {
    const section = sectionRef?.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let time = 0;

    const render = () => {
      animFrameIdRef.current = requestAnimationFrame(render);

      // Skip drawing when off-screen to preserve resources
      if (!isVisibleRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const p = internalProgressRef.current;
      const fY = formationYRef.current || 0;

      ctx.clearRect(0, 0, width, height);

      // Early completion: If animation reached finished brick state,
      // leave canvas completely clear. The authentic client brick is 100% visible and stable.
      if (p >= (isMobile ? 0.90 : 0.78)) return;

      time += 0.018;

      // =====================================================================
      // TIMELINE PHASES (Continuous Organic Progression):
      // 0%–15%: soil appears across the white section with ambient drift
      // 15%–35%: soil moves downward and inward
      // 35%–55%: particles gather strongly
      // 50%–72%: material preparation & converging soil aggregates
      // 70%–88%: hydraulic pressing & shaping phase (smooth compaction)
      // 84%–90%: dual finished bricks reveal, particles dissolve seamlessly
      // 90%+: finished brick pair fully visible and stable (section hold state)
      // =====================================================================
      // Helper smoothstep function for organic, continuous transitions
      const smoothstep = (min, max, val) => {
        const t = Math.min(1, Math.max(0, (val - min) / (max - min)));
        return t * t * (3 - 2 * t);
      };

      const easedGather = smoothstep(0.12, 0.35, p);
      const easedConverge = smoothstep(0.32, 0.55, p);
      const easedCompress = smoothstep(0.50, 0.74, p);
      const particleAlphaMultiplier = 1 - smoothstep(isMobile ? 0.74 : 0.54, isMobile ? 0.89 : 0.75, p);

      // Target brick geometry
      const { cx, cy, bw, bh } = getBrickTarget(width, height);

      // Render Soil / Clay Particles across the whole section
      const particles = particlesRef.current;
      const totalTravelProgress = easedGather * 0.5 + easedConverge * 0.35 + easedCompress * 0.15;

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];

        // Ambient organic drift (stronger in initial state, damped as particles gather)
        const ambientAmp = (1 - easedGather) * 10 * pt.depth;
        const ambientX = Math.sin(time + pt.driftPhase) * ambientAmp;
        const ambientY = Math.cos(time + pt.driftPhase * 1.4) * (ambientAmp * 0.8);

        // 15%–35%: Active downward and inward movement
        const downwardDrift = (1 - totalTravelProgress) * easedGather * (isMobile ? 18 : 36);
        const targetY = pt.targetY + fY;

        // Interpolate coordinate from wide environmental origin to downward-traveling target brick
        const curX = pt.scatterX + (pt.targetX - pt.scatterX) * totalTravelProgress + ambientX;
        const curY = pt.scatterY + (targetY - pt.scatterY) * totalTravelProgress + ambientY + downwardDrift;

        // Particle size adapts slightly as clay compresses
        const curScale = (1 - easedCompress * 0.25) * pt.depth;
        const alpha = pt.alphaBase * particleAlphaMultiplier * (0.6 + totalTravelProgress * 0.4);

        if (alpha <= 0.01) continue;

        ctx.save();
        ctx.translate(curX, curY);
        ctx.rotate(pt.rotation + time * pt.rotSpeed);

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

        // Draw irregular polygon
        ctx.beginPath();
        const pts = pt.polygonPoints;
        ctx.moveTo(pts[0].x * curScale, pts[0].y * curScale);
        for (let j = 1; j < pts.length; j++) {
          ctx.lineTo(pts[j].x * curScale, pts[j].y * curScale);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [getBrickTarget]);

  return (
    <canvas 
      ref={canvasRef} 
      className="manufacturing-soil-canvas" 
      aria-hidden="true" 
    />
  );
};

export default SoilToBrickAnimation;
