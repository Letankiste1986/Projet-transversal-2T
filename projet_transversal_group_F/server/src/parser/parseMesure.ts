export type ParsedMesure = {
  temperature: number
  humidite: number
}

function parseNumber(value: string): number | null {
  const parsedValue = Number(value.replace(',', '.'))

  if (Number.isNaN(parsedValue)) {
    return null
  }

  return parsedValue
}

function parseNumbers(message: string): number[] {
  const matches = message.match(/-?\d+(?:[.,]\d+)?/g)

  if (!matches) {
    return []
  }

  return matches
    .map((match) => parseNumber(match))
    .filter((value): value is number => value !== null)
}

export function parseSensorValue(message: string): number | null {
  return parseNumbers(message)[0] ?? null
}

export function createMesureObject(
  temperature: number | null,
  humidite: number | null,
): ParsedMesure | null {
  if (temperature === undefined || humidite === undefined) {
    return null
  }

  if (temperature === null || humidite === null) {
    return null
  }

  return { temperature, humidite }
}
