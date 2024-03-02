export const getObjectsByName = (name: string, map: Phaser.Tilemaps.Tilemap, layerName: string): Phaser.Types.Tilemaps.TiledObject[] => {
  const layer = map.objects.find(layer => layer.name === layerName)

  if (!layer) return []

  return layer.objects
    .map(obj => {
      if (obj.name !== name || obj.y === undefined) return

      obj.y -= map.tileHeight
      return obj
    })
    .filter(Boolean) as Phaser.Types.Tilemaps.TiledObject[]
}