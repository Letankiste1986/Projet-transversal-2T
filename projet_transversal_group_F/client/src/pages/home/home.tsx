import style from './home.module.css';

import { useState } from 'react';
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

function Home() {

    const [periodeTemp, setPeriodeTemp] = useState("jour");
    const [periodeHum, setPeriodeHum] = useState("jour");

    // =========================
    // DONNÉES TEMPÉRATURE
    // =========================

    const tempJour = [
        { time: "08h", temperature: 22 },
        { time: "10h", temperature: 24 },
        { time: "12h", temperature: 27 },
        { time: "14h", temperature: 29 },
        { time: "16h", temperature: 28 },
        { time: "18h", temperature: 25 }
    ];

    const tempSemaine = [
        { time: "Lun", temperature: 22 },
        { time: "Mar", temperature: 24 },
        { time: "Mer", temperature: 26 },
        { time: "Jeu", temperature: 29 },
        { time: "Ven", temperature: 27 },
        { time: "Sam", temperature: 25 },
        { time: "Dim", temperature: 23 }
    ];

    const tempMois = [
        { time: "S1", temperature: 22 },
        { time: "S2", temperature: 27 },
        { time: "S3", temperature: 25 },
        { time: "S4", temperature: 29 }
    ];

    // =========================
    // DONNÉES HUMIDITÉ
    // =========================

    const humJour = [
        { time: "08h", humidite: 58 },
        { time: "10h", humidite: 55 },
        { time: "12h", humidite: 49 },
        { time: "14h", humidite: 42 },
        { time: "16h", humidite: 47 },
        { time: "18h", humidite: 54 }
    ];

    const humSemaine = [
        { time: "Lun", humidite: 62 },
        { time: "Mar", humidite: 58 },
        { time: "Mer", humidite: 53 },
        { time: "Jeu", humidite: 47 },
        { time: "Ven", humidite: 39 },
        { time: "Sam", humidite: 44 },
        { time: "Dim", humidite: 60 }
    ];

    const humMois = [
        { time: "S1", humidite: 64 },
        { time: "S2", humidite: 57 },
        { time: "S3", humidite: 41 },
        { time: "S4", humidite: 55 }
    ];

    const dataTemp =
        periodeTemp === "semaine" ? tempSemaine :
        periodeTemp === "mois"   ? tempMois    :
        tempJour;

    const dataHum =
        periodeHum === "semaine" ? humSemaine :
        periodeHum === "mois"   ? humMois    :
        humJour;

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

                    <h1>Dashboard</h1>

                </header>

                {/* ========================= */}
                {/* CARDS */}
                {/* ========================= */}

                <section className={style.cards}>

                    <div className={style.card}>
                        <p className={style.icon}>🌡</p>

                        <div>
                            <span>Température</span>
                            <h3>29°C</h3>
                        </div>
                    </div>

                    <div className={style.card}>
                        <p className={style.icon}>💧</p>

                        <div>
                            <span>Humidité</span>
                            <h3>56%</h3>
                        </div>
                    </div>

                </section>

                {/* ========================= */}
                {/* GRAPHIQUE */}
                {/* ========================= */}

                <section className={style.graphContainer}>

                    <div className={style.graphTop}>

                        <h2>🌡 Température</h2>

                        <div className={style.buttons}>

                            <button
                                className={periodeTemp === "jour"    ? style.buttonActive : ""}
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
                                className={periodeTemp === "mois"    ? style.buttonActive : ""}
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
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </section>

                {/* ========================= */}
                {/* GRAPHIQUE HUMIDITÉ */}
                {/* ========================= */}

                <section className={style.graphContainer}>

                    <div className={style.graphTop}>

                        <h2>💧 Humidité</h2>

                        <div className={style.buttons}>

                            <button
                                className={periodeHum === "jour"    ? style.buttonActive : ""}
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
                                className={periodeHum === "mois"    ? style.buttonActive : ""}
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
                                    stroke="#06b6d4"
                                    strokeWidth={3}
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