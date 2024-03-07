export interface SceneConfig {
  levelName: string,
  mapName: string,
  mapPath: string,
  tilesets: {tilesetName: string, tilesetPath: string}[]
}

export const scenes = [
  {
    levelName: 'city',
    mapName: 'city',
    mapPath: 'assets/tilemaps/city.json',
    tilesets: [
      { tilesetName: 'kenny-city', tilesetPath: 'assets/tilemaps/kenny-city.png' }
    ]
  },
  {
    levelName: 'home',
    mapName: 'home',
    mapPath: 'assets/tilemaps/home.json',
    tilesets: [
      { tilesetName: 'kenny-inside', tilesetPath: 'assets/tilemaps/kenny-inside.png' },
      { tilesetName: 'kenny-rouge', tilesetPath: 'assets/tilemaps/kenny-rogue.png' },
    ]
  },
  {
    levelName: 'corpExterior',
    mapName: 'corpExterior',
    mapPath: 'assets/tilemaps/city_dream_corp_exterior.json',
    tilesets: [
      { tilesetName: 'kenny-city', tilesetPath: 'assets/tilemaps/kenny-city.png' }
    ]
  }
] as SceneConfig[]