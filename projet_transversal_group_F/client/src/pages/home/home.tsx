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

    const [periode, setPeriode] = useState("jour");

    // =========================
    // DONNÉES JOUR
    // =========================

    const dataJour = [

        { time: "08h", temperature: 22 },
        { time: "10h", temperature: 24 },
        { time: "12h", temperature: 27 },
        { time: "14h", temperature: 29 },
        { time: "16h", temperature: 28 },
        { time: "18h", temperature: 25 }

    ];

    // =========================
    // DONNÉES SEMAINE
    // =========================

    const dataSemaine = [

        { time: "Lun", temperature: 22 },
        { time: "Mar", temperature: 24 },
        { time: "Mer", temperature: 26 },
        { time: "Jeu", temperature: 29 },
        { time: "Ven", temperature: 27 },
        { time: "Sam", temperature: 25 },
        { time: "Dim", temperature: 23 }

    ];

    // =========================
    // DONNÉES MOIS
    // =========================

    const dataMois = [

        { time: "S1", temperature: 22 },
        { time: "S2", temperature: 27 },
        { time: "S3", temperature: 25 },
        { time: "S4", temperature: 29 }

    ];

    let data = dataJour;

    if (periode === "semaine") {
        data = dataSemaine;
    }

    if (periode === "mois") {
        data = dataMois;
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

                        <h2>📈 Activité des capteurs</h2>

                        <div className={style.buttons}>

                            <button
                                onClick={() => setPeriode("jour")}
                            >
                                Jour
                            </button>

                            <button
                                onClick={() => setPeriode("semaine")}
                            >
                                Semaine
                            </button>

                            <button
                                onClick={() => setPeriode("mois")}
                            >
                                Mois
                            </button>

                        </div>

                    </div>

                    <div className={style.chart}>

                        <ResponsiveContainer
                            width="100%"
                            height={400}
                        >

                            <LineChart data={data}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis dataKey="time" />

                                <YAxis />

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

            </main>

        </div>

    );
}

export default Home;