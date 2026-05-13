import { io } from 'socket.io-client';

export type Mesure = {
  id: number;
  temperature: number;
  humidite: number;
  createdAt: string;
};

export type Period = 'jour' | 'semaine' | 'mois';

export type ChartPoint = {
  time: string;
  temperature: number;
  humidite: number;
};

export type HistoryRow = {
  id: number;
  time: string;
  temperature: number;
  humidite: number;
  temperatureStatus: 'Normal' | 'Eleve';
  humidityStatus: 'Normal' | 'Bas';
};

const dateTimeFormatter = new Intl.DateTimeFormat('fr-BE', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('fr-BE', {
  hour: '2-digit',
  minute: '2-digit',
});

const weekdayFormatter = new Intl.DateTimeFormat('fr-BE', {
  weekday: 'short',
});

export async function fetchMesures() {
  const response = await fetch('/api/data');

  if (!response.ok) {
    throw new Error('Impossible de charger les mesures');
  }

  const mesures = await response.json() as Mesure[];
  return sortMesures(mesures);
}

export function createMesuresSocket() {
  return io('/', {
    path: '/socket.io',
    transports: ['websocket'],
  });
}

export function sortMesures(mesures: Mesure[]) {
  return [...mesures].sort((a, b) => (
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ));
}

export function addOrReplaceMesure(mesures: Mesure[], mesure: Mesure) {
  const next = new Map(mesures.map((item) => [item.id, item]));
  next.set(mesure.id, mesure);
  return sortMesures([...next.values()]);
}

export function getLastMesure(mesures: Mesure[]) {
  return mesures.length > 0 ? mesures[mesures.length - 1] : null;
}

export function getChartData(mesures: Mesure[], period: Period): ChartPoint[] {
  if (period === 'jour') {
    return getDayMesures(mesures).slice(-24).map((mesure) => ({
      time: timeFormatter.format(new Date(mesure.createdAt)),
      temperature: round(mesure.temperature),
      humidite: round(mesure.humidite),
    }));
  }

  if (period === 'semaine') {
    return averageByBucket(mesures, 7, (date) => weekdayFormatter.format(date));
  }

  return averageByBucket(mesures, 30, (date) => `${date.getDate()}/${date.getMonth() + 1}`);
}

export function getHistoryRows(mesures: Mesure[], period: Period): HistoryRow[] {
  const source =
    period === 'jour' ? getDayMesures(mesures) :
    period === 'semaine' ? getRecentMesures(mesures, 7) :
    getRecentMesures(mesures, 30);

  return source.slice(-40).reverse().map((mesure) => ({
    id: mesure.id,
    time: dateTimeFormatter.format(new Date(mesure.createdAt)),
    temperature: round(mesure.temperature),
    humidite: round(mesure.humidite),
    temperatureStatus: mesure.temperature >= 27 ? 'Eleve' : 'Normal',
    humidityStatus: mesure.humidite < 45 ? 'Bas' : 'Normal',
  }));
}

function getDayMesures(mesures: Mesure[]) {
  const today = new Date();

  const todaysMesures = mesures.filter((mesure) => {
    const date = new Date(mesure.createdAt);
    return date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate();
  });

  return todaysMesures.length > 0 ? todaysMesures : mesures.slice(-24);
}

function getRecentMesures(mesures: Mesure[], days: number) {
  const start = new Date();
  start.setDate(start.getDate() - days);

  const recent = mesures.filter((mesure) => new Date(mesure.createdAt) >= start);
  return recent.length > 0 ? recent : mesures;
}

function averageByBucket(
  mesures: Mesure[],
  days: number,
  labelForDate: (date: Date) => string,
): ChartPoint[] {
  const buckets = new Map<string, { date: Date; temperature: number; humidite: number; count: number }>();

  getRecentMesures(mesures, days).forEach((mesure) => {
    const date = new Date(mesure.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const bucket = buckets.get(key) ?? { date, temperature: 0, humidite: 0, count: 0 };

    bucket.temperature += mesure.temperature;
    bucket.humidite += mesure.humidite;
    bucket.count += 1;
    buckets.set(key, bucket);
  });

  return [...buckets.values()]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((bucket) => ({
      time: labelForDate(bucket.date),
      temperature: round(bucket.temperature / bucket.count),
      humidite: round(bucket.humidite / bucket.count),
    }));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
