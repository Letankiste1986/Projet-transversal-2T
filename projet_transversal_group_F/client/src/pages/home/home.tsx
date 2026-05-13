import style from './home.module.css';

import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

import { useMesures } from '../../hooks/useMesures';
import { getChartData, type Period } from '../../services/mesures';

function Home() {

    const [periodeTemp, setPeriodeTemp] = useState<Period>("jour");
    const [periodeHum, setPeriodeHum] = useState<Period>("jour");
    const [isSendingPicoCommand, setIsSendingPicoCommand] = useState(false);
    const [picoMessage, setPicoMessage] = useState<string | null>(null);
    const { mesures, lastMesure, isLoading, error, isLive } = useMesures();

    const dataTemp = useMemo(
        () => getChartData(mesures, periodeTemp),
        [mesures, periodeTemp]
    );

    const dataHum = useMemo(
        () => getChartData(mesures, periodeHum),
        [mesures, periodeHum]
    );

    const temperature = lastMesure ? `${lastMesure.temperature.toFixed(1)}°C` : "--";
    const humidite = lastMesure ? `${lastMesure.humidite.toFixed(1)}%` : "--";
    const statusText = error ?? (isLoading ? "Chargement" : isLive ? "Live" : "Hors ligne");

    async function sendPicoCommand() {
        setIsSendingPicoCommand(true);
        setPicoMessage(null);

        try {
            const response = await fetch('/api/pico', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Commande refusee');
            }

            setPicoMessage('Commande envoyée au Pico');
        } catch {
            setPicoMessage('Impossible de contacter le Pico');
        } finally {
            setIsSendingPicoCommand(false);
        }
    }

    return (

        <div className={style.dashboard}>

            <aside className={style.sidebar}>

                <h2>IoT Panel</h2>

                <nav>

                    <NavLink to="/" end className={({ isActive }) => isActive ? style.activeLink : ""}>Dashboard</NavLink>
                    <NavLink to="/historique" className={({ isActive }) => isActive ? style.activeLink : ""}>Historique</NavLink>

                </nav>

            </aside>

            <main className={style.main}>

                <header className={style.header}>

                    <div>
                        <h1>Dashboard</h1>
                        <p className={isLive ? style.liveStatus : style.offlineStatus}>{statusText}</p>
                    </div>

                </header>

                <section className={style.cards}>

                    <div className={style.card}>
                        <p className={style.icon}>🌡</p>

                        <div>
                            <span>Température</span>
                            <h3>{temperature}</h3>
                        </div>
                    </div>

                    <div className={style.card}>
                        <p className={style.icon}>💧</p>

                        <div>
                            <span>Humidité</span>
                            <h3>{humidite}</h3>
                        </div>
                    </div>

                    <div className={style.card}>
                        <p className={style.icon}>💡</p>

                        <div className={style.picoControl}>
                            <span>Commande Pico</span>
                            <button
                                className={style.picoButton}
                                disabled={isSendingPicoCommand}
                                onClick={sendPicoCommand}
                            >
                                {isSendingPicoCommand ? 'Envoi...' : 'Allumer'}
                            </button>
                            {picoMessage && <p>{picoMessage}</p>}
                        </div>
                    </div>

                </section>

                <section className={style.graphContainer}>

                    <div className={style.graphTop}>

                        <h2>🌡 Température</h2>

                        <div className={style.buttons}>

                            <button
                                className={periodeTemp === "jour" ? style.buttonActive : ""}
                                onClick={() => setPeriodeTemp("jour")}
                            >
                                Jour
                            </button>

                            <button
                                className={periodeTemp === "semaine" ? style.buttonActive : ""}
                                onClick={() => setPeriodeTemp("semaine")}
                            >
                                Semaine
                            </button>

                            <button
                                className={periodeTemp === "mois" ? style.buttonActive : ""}
                                onClick={() => setPeriodeTemp("mois")}
                            >
                                Mois
                            </button>

                        </div>

                    </div>

                    <div className={style.chart}>

                        <ResponsiveContainer width="100%" height={300}>

                            <LineChart data={dataTemp}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="time" />

                                <YAxis unit="°C" />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="temperature"
                                    name="Température"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={false}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </section>

                <section className={style.graphContainer}>

                    <div className={style.graphTop}>

                        <h2>💧 Humidité</h2>

                        <div className={style.buttons}>

                            <button
                                className={periodeHum === "jour" ? style.buttonActive : ""}
                                onClick={() => setPeriodeHum("jour")}
                            >
                                Jour
                            </button>

                            <button
                                className={periodeHum === "semaine" ? style.buttonActive : ""}
                                onClick={() => setPeriodeHum("semaine")}
                            >
                                Semaine
                            </button>

                            <button
                                className={periodeHum === "mois" ? style.buttonActive : ""}
                                onClick={() => setPeriodeHum("mois")}
                            >
                                Mois
                            </button>

                        </div>

                    </div>

                    <div className={style.chart}>

                        <ResponsiveContainer width="100%" height={300}>

                            <LineChart data={dataHum}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="time" />

                                <YAxis unit="%" />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="humidite"
                                    name="Humidité"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    dot={false}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </section>

            </main>

        </div>

    );
}

export default Home;
