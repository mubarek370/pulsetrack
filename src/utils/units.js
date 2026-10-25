const KG_TO_LBS = 2.20462

export function convertWeight(kg, units) {
  const value = units === 'lbs' ? kg * KG_TO_LBS : kg
  return Math.round(value * 10) / 10
}

export function formatWeight(kg, units) {
  return `${convertWeight(kg, units).toLocaleString()} ${units}`
}
