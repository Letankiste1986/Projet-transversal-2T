import style from './historique.module.css';

import { useState } from 'react';
import { NavLink } from 'react-router-dom';

// =========================
// DONNÉES TEMPÉRATURE
// =========================

const tempJour = [
    { time: "08h00:12", valeur: 21.2, statut: "Normal" },
    { time: "09h00:34", valeur: 22.8, statut: "Normal" },
    { time: "10h00:07", valeur: 24.1, statut: "Normal" },
    { time: "11h00:51", valeur: 25.7, statut: "Normal" },
    { time: "12h00:23", valeur: 27.3, statut: "Élevé" },
    { time: "13h00:45", valeur: 29.0, statut: "Élevé" },
    { time: "14h00:18", valeur: 30.4, statut: "Élevé" },
    { time: "15h00:03", valeur: 29.8, statut: "Élevé" },
    { time: "16h00:39", valeur: 28.2, statut: "Normal" },
    { time: "17h00:56", valeur: 26.5, statut: "Normal" },
    { time: "18h00:28", valeur: 24.9, statut: "Normal" },
];

const tempSemaine = [
    { time: "Lundi",    valeur: 22.4, statut: "Normal" },
    { time: "Mardi",    valeur: 24.1, statut: "Normal" },
    { time: "Mercredi", valeur: 26.7, statut: "Normal" },
    { time: "Jeudi",    valeur: 29.3, statut: "Élevé" },
    { time: "Vendredi", valeur: 31.0, statut: "Élevé" },
    { time: "Samedi",   valeur: 27.5, statut: "Normal" },
    { time: "Dimanche", valeur: 23.8, statut: "Normal" },
];

const tempMois = [
    { time: "Semaine 1", valeur: 21.9, statut: "Normal" },
    { time: "Semaine 2", valeur: 25.4, statut: "Normal" },
    { time: "Semaine 3", valeur: 29.7, statut: "Élevé" },
    { time: "Semaine 4", valeur: 27.2, statut: "Normal" },
];

// =========================
// DONNÉES HUMIDITÉ
// =========================

const humJour = [
    { time: "08h00:12", valeur: 58, statut: "Normal" },
    { time: "09h00:34", valeur: 55, statut: "Normal" },
    { time: "10h00:07", valeur: 52, statut: "Normal" },
    { time: "11h00:51", valeur: 49, statut: "Normal" },
    { time: "12h00:23", valeur: 45, statut: "Bas" },
    { time: "13h00:45", valeur: 42, statut: "Bas" },
    { time: "14h00:18", valeur: 40, statut: "Bas" },
    { time: "15h00:03", valeur: 43, statut: "Bas" },
    { time: "16h00:39", valeur: 47, statut: "Normal" },
    { time: "17h00:56", valeur: 51, statut: "Normal" },
    { time: "18h00:28", valeur: 54, statut: "Normal" },
];

const humSemaine = [
    { time: "Lundi",    valeur: 62, statut: "Normal" },
    { time: "Mardi",    valeur: 58, statut: "Normal" },
    { time: "Mercredi", valeur: 53, statut: "Normal" },
    { time: "Jeudi",    valeur: 47, statut: "Normal" },
    { time: "Vendredi", valeur: 39, statut: "Bas" },
    { time: "Samedi",   valeur: 44, statut: "Normal" },
    { time: "Dimanche", valeur: 60, statut: "Normal" },
];

const humMois = [
    { time: "Semaine 1", valeur: 64, statut: "Normal" },
    { time: "Semaine 2", valeur: 57, statut: "Normal" },
    { time: "Semaine 3", valeur: 41, statut: "Bas" },
    { time: "Semaine 4", valeur: 55, statut: "Normal" },
];

// =========================
// COMPOSANT
// =========================

function Historique() {

    const [periodeTemp, setPeriodeTemp] = useState("jour");
    const [periodeHum, setPeriodeHum] = useState("jour");

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
                    <h1>Historique</h1>
                </header>

                {/* ========================= */}
                {/* TABLEAU TEMPÉRATURE */}
                {/* ========================= */}

                <section className={style.tableContainer}>

                    <div className={style.tableTop}>

                        <h2>🌡 Historique des températures</h2>

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

                    <table className={style.table}>

                        <thead>
                            <tr>
                                <th>Heure / Période</th>
                                <th>Température (°C)</th>
                                <th>Statut</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataTemp.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.time}</td>
                                    <td>{row.valeur}°C</td>
                                    <td>
                                        <span className={
                                            row.statut === "Élevé" ? style.badgeElevé :
                                            style.badgeNormal
                                        }>
                                            {row.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </section>

                {/* ========================= */}
                {/* TABLEAU HUMIDITÉ */}
                {/* ========================= */}

                <section className={style.tableContainer}>

                    <div className={style.tableTop}>

                        <h2>💧 Historique des humidités</h2>

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

                    <table className={style.table}>

                        <thead>
                            <tr>
                                <th>Heure / Période</th>
                                <th>Humidité (%)</th>
                                <th>Statut</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataHum.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.time}</td>
                                    <td>{row.valeur}%</td>
                                    <td>
                                        <span className={
                                            row.statut === "Bas" ? style.badgeBas :
                                            style.badgeNormal
                                        }>
                                            {row.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </section>

            </main>

        </div>

    );
}

export default Historique;
