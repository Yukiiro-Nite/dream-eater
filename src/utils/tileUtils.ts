export const getObjectsByType = (type: string, map: Phaser.Tilemaps.Tilemap, layerName: string) => {
  const layer = map.objects.find(layer => layer.name === layerName)

  if (!layer) return []

  return layer.objects
    .map(obj => {
      if (obj.properties.type !== type || obj.y === undefined) return

      obj.y -= map.tileHeight
      return obj
    })
    .filter(Boolean)
}