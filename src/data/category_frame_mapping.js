export const categoryFrameMapping = {
  'Soft Drinks': {
    path: '/category frames/chillsip_cola_frames',
    prefix: 'chillsip_cola_',
    count: 49,
    suffix: '.jpg'
  },
  'Juices & Fruit Drinks': {
    path: '/category frames/chillsip_mango_juice_frames',
    prefix: 'chillsip_mango_juice_',
    count: 48,
    suffix: '.jpg'
  },
  'Iced & Chilled Drinks': {
    path: '/category frames/chillsip_cold_coffee_frames',
    prefix: 'chillsip_cold_coffee_',
    count: 49,
    suffix: '.jpg'
  },
  'Energy Drinks': {
    path: '/category frames/chillsip_energy_frames',
    prefix: 'chillsip_energy_',
    count: 49,
    suffix: '.jpg'
  },
  'Milk-Based Drinks': {
    path: '/category frames/chillsip_milkshake_frames',
    prefix: 'chillsip_milkshake_',
    count: 49,
    suffix: '.jpg'
  },
  'Traditional Desi Drinks': {
    path: '/category frames/chillsip_aam_pana_frames',
    prefix: 'chillsip_aam_pana_',
    count: 49,
    suffix: '.jpg'
  },
  'Mocktails & Specials': {
    path: '/category frames/chillsip_mojito_frames',
    prefix: 'chillsip_mojito_',
    count: 49,
    suffix: '.jpg'
  },
  'Trending & Special': {
    path: '/category frames/chillsip_best_seller_frames',
    prefix: 'chillsip_best_seller_',
    count: 49,
    suffix: '.jpg'
  }
};

// Also adding a helper to get frames by folder name directly for dynamic loading
export const getFramesByFolder = (folderName) => {
    const id = folderName.replace('chillsip_', '').replace('_frames', '');
    return {
        path: `/category frames/${folderName}`,
        prefix: `chillsip_${id}_`,
        count: 49, // Default count, most have 49 or 48
        suffix: '.jpg'
    };
};
