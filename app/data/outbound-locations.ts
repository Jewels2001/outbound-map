/**
 * Sample Outbound game locations and items.
 * 
 * Map coordinates are in a custom game coordinate system (0-1000x, 0-1000y).
 * When you have the actual game map image, update the imageBounds in OutboundMap.tsx
 * to match the pixel dimensions, and place the image at public/outbound-map.png
 */

export type ItemCategory = 'equipment' | 'consumable' | 'collectible' | 'resource' | 'waypoint';

export interface Location {
  id: string;
  name: string;
  description: string;
  x: number; // 0-1000
  y: number; // 0-1000
  category: ItemCategory;
  icon?: string; // emoji or icon identifier
}

export const CATEGORIES: Record<ItemCategory, { label: string; color: string }> = {
  equipment: { label: 'Equipment', color: '#EF4444' },
  consumable: { label: 'Consumable', color: '#F59E0B' },
  collectible: { label: 'Collectible', color: '#8B5CF6' },
  resource: { label: 'Resource', color: '#10B981' },
  waypoint: { label: 'Waypoint', color: '#3B82F6' },
};

export const SAMPLE_LOCATIONS: Location[] = [
  {
    id: 'equipment_1',
    name: 'Iron Sword',
    description: 'A well-crafted iron sword found near the northern cliff.',
    x: 250,
    y: 150,
    category: 'equipment',
    icon: '🗡️',
  },
  {
    id: 'equipment_2',
    name: 'Steel Shield',
    description: 'A sturdy shield in the eastern fort.',
    x: 750,
    y: 300,
    category: 'equipment',
    icon: '🛡️',
  },
  {
    id: 'consumable_1',
    name: 'Health Potion',
    description: 'Restores health when consumed.',
    x: 400,
    y: 400,
    category: 'consumable',
    icon: '🧪',
  },
  {
    id: 'consumable_2',
    name: 'Mana Potion',
    description: 'Restores mana reserves.',
    x: 600,
    y: 550,
    category: 'consumable',
    icon: '💙',
  },
  {
    id: 'collectible_1',
    name: 'Ancient Coin',
    description: 'A mysterious coin with unknown origins.',
    x: 300,
    y: 700,
    category: 'collectible',
    icon: '🪙',
  },
  {
    id: 'collectible_2',
    name: 'Ruby Gem',
    description: 'A precious ruby gem.',
    x: 800,
    y: 650,
    category: 'collectible',
    icon: '💎',
  },
  {
    id: 'resource_1',
    name: 'Timber',
    description: 'Quality wood for crafting.',
    x: 150,
    y: 500,
    category: 'resource',
    icon: '🪵',
  },
  {
    id: 'resource_2',
    name: 'Iron Ore',
    description: 'Raw iron ore deposit.',
    x: 900,
    y: 750,
    category: 'resource',
    icon: '⛏️',
  },
  {
    id: 'waypoint_1',
    name: 'Village Square',
    description: 'Main hub and trading post.',
    x: 500,
    y: 200,
    category: 'waypoint',
    icon: '🏘️',
  },
  {
    id: 'waypoint_2',
    name: 'Mountain Peak',
    description: 'Highest vantage point in the realm.',
    x: 700,
    y: 100,
    category: 'waypoint',
    icon: '⛰️',
  },
];
