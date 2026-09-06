// Authentic factory media assets for Classic Mun Bricks
import img01 from '../assets/visit-us/01-material-processing.jpg';
import vid01 from '../assets/visit-us/01-material-processing.mov';
import vid02 from '../assets/visit-us/02-material-refining.mov';
import vid03 from '../assets/visit-us/03-material-preparation.mp4';
import vid04 from '../assets/visit-us/04-mixing-conditioning.mov';
import vid05 from '../assets/visit-us/05-further-processing.mp4';
import img06 from '../assets/visit-us/06-brick-forming.jpg';
import vid06 from '../assets/visit-us/06-brick-forming.mov';

export const FACTORY_PROCESSES = [
  {
    id: 1,
    stepNumber: 1,
    formattedNumber: '01',
    stageLabel: 'Stage 01 • Raw Material Feed',
    title: 'Initial Material Processing',
    shortDescription:
      'Raw clay and natural minerals enter the primary processing conveyor. The material undergoes initial crushing and screening to break down large aggregates and establish initial uniformity before entering refined preparation channels.',
    image: img01,
    video: vid01,
    altText: 'Raw clay material entering initial conveyor feeder at the Classic Mun Bricks factory in Kerala',
    badgeText: 'Conveyor & Screening',
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
    stageLabel: 'Stage 03 • Granular Preparation',
    title: 'Material Preparation',
    shortDescription:
      'The fine-milled clay passes through secondary distribution hoppers and calibrated rollers to ensure even particle sizing and eliminate air pockets, establishing the uniform density required for heavy structural bricks.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid03,
    altText: 'Material preparation equipment distributing fine clay particles',
    badgeText: 'Roller & Hopper Feed',
    layout: 'text-left',
  },
  {
    id: 4,
    stepNumber: 4,
    formattedNumber: '04',
    stageLabel: 'Stage 04 • Moisture & Plasticity',
    title: 'Mixing & Conditioning',
    shortDescription:
      'The prepared clay blend is thoroughly mixed and conditioned with controlled water addition. Heavy-duty mixing paddles blend the minerals to achieve the exact plasticity and internal cohesion required for flawless extrusion.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid04,
    altText: 'Conditioning mixer blending clay with controlled moisture',
    badgeText: 'Conditioning Mixer',
    layout: 'text-right',
  },
  {
    id: 5,
    stepNumber: 5,
    formattedNumber: '05',
    stageLabel: 'Stage 05 • Compaction & De-Airing',
    title: 'Further Processing',
    shortDescription:
      'Conditioned clay undergoes secondary compaction and vacuum de-airing. This crucial step removes microscopic air voids, ensuring high compressive strength and seamless material flow as it transitions into the brick-forming die.',
    image: null, // Zero-shift poster frame rendered seamlessly from video
    video: vid05,
    altText: 'Secondary clay compaction and de-airing machinery in continuous operation',
    badgeText: 'Vacuum De-Airing',
    layout: 'text-left',
  },
  {
    id: 6,
    stepNumber: 6,
    formattedNumber: '06',
    stageLabel: 'Stage 06 • Extrusion & Wire Cut',
    title: 'Shaped Into Form',
    shortDescription:
      'The dense, homogenized clay mass is pressed through precision extrusion dies and wire-cut into distinct, recognizable structural brick units. Each brick emerges with crisp geometry, uniform density, and clean edges before moving to drying and firing.',
    image: img06,
    video: vid06,
    altText: 'Formed structural clay bricks cut into precise dimensional units on the production line',
    badgeText: 'Extrusion & Wire-Cut',
    layout: 'cinematic', // Payoff highlight stage
  },
];
