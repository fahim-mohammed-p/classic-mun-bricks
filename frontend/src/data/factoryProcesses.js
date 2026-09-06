// Authentic factory media assets for Classic Mun Bricks
import vid01 from '../assets/visit-us/05-further-processing.mp4';
import vid02 from '../assets/visit-us/02-material-refining.mov';
import vid03 from '../assets/visit-us/3rd clip classic.mp4';
import img04 from '../assets/visit-us/01-material-processing.jpg';
import vid04 from '../assets/visit-us/01-material-processing.mov';
import vid05 from '../assets/visit-us/04-mixing-conditioning.mov';
import vid06 from '../assets/visit-us/6th step classic.mp4';
import vid07 from '../assets/visit-us/7th clip classic.mp4';

export const FACTORY_PROCESSES = [
  {
    id: 1,
    stepNumber: 1,
    formattedNumber: '01',
    stageLabel: 'Stage 01 • Soil Cleaning',
    title: 'Soil Cleaning & Stone Removal',
    shortDescription:
      'Soil is processed to separate and remove unwanted stones before moving to the next stage.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid01,
    altText: 'Soil cleaning and stone removal process at the Classic Mun Bricks factory in Kerala',
    badgeText: 'Stone Removal',
    layout: 'text-left',
  },
  {
    id: 2,
    stepNumber: 2,
    formattedNumber: '02',
    stageLabel: 'Stage 02 • Particle Refinement',
    title: 'Material Refining',
    shortDescription:
      'Screened material moves steadily along mechanical conveyors for continuous refinement. High-capacity processing equipment breaks down aggregate particles into a fine, workable state ready for precise moisture distribution.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid02,
    altText: 'Conveyor system refining and transporting processed clay material',
    badgeText: 'Refining Conveyor',
    layout: 'text-right',
  },
  {
    id: 3,
    stepNumber: 3,
    formattedNumber: '03',
    stageLabel: 'Stage 03 • Manufacturing Process',
    title: 'Process Stage 03',
    shortDescription:
      'A closer look at the next stage of our brick manufacturing process.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid03,
    altText: 'Manufacturing process stage 03 at Classic Mun Bricks',
    badgeText: 'Stage 03 Footage',
    layout: 'text-left',
  },
  {
    id: 4,
    stepNumber: 4,
    formattedNumber: '04',
    stageLabel: 'Stage 04 • Raw Material Feed',
    title: 'Initial Material Processing',
    shortDescription:
      'Raw clay and natural minerals enter the primary processing conveyor. The material undergoes initial crushing and screening to break down large aggregates and establish initial uniformity before entering refined preparation channels.',
    image: img04,
    video: vid04,
    altText: 'Raw clay material entering initial conveyor feeder at the Classic Mun Bricks factory in Kerala',
    badgeText: 'Conveyor & Screening',
    layout: 'text-right',
  },
  {
    id: 5,
    stepNumber: 5,
    formattedNumber: '05',
    stageLabel: 'Stage 05 • Moisture & Plasticity',
    title: 'Mixing & Conditioning',
    shortDescription:
      'The prepared clay blend is thoroughly mixed and conditioned with controlled water addition. Heavy-duty mixing paddles blend the minerals to achieve the exact plasticity and internal cohesion required for flawless extrusion.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid05,
    altText: 'Conditioning mixer blending clay with controlled moisture',
    badgeText: 'Conditioning Mixer',
    layout: 'text-left',
  },
  {
    id: 6,
    stepNumber: 6,
    formattedNumber: '06',
    stageLabel: 'Stage 06 • Manufacturing Process',
    title: 'Process Stage 06',
    shortDescription:
      'The material continues through the next stage of the production process.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid06,
    altText: 'Manufacturing process stage 06 at Classic Mun Bricks',
    badgeText: 'Stage 06 Footage',
    layout: 'text-right',
  },
  {
    id: 7,
    stepNumber: 7,
    formattedNumber: '07',
    stageLabel: 'Stage 07 • Manufacturing Process',
    title: 'Process Stage 07',
    shortDescription:
      'The final stage shown in this factory journey before the process continues onward.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid07,
    altText: 'Manufacturing process stage 07 at Classic Mun Bricks',
    badgeText: 'Stage 07 Footage',
    layout: 'text-left',
  },
];
