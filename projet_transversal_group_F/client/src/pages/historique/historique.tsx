import style from './historique.module.css';

import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useMesures } from '../../hooks/useMesures';
import { getHistoryRows, type Period } from '../../services/mesures';

function Historique() {

    const [periodeTemp, setPeriodeTemp] = useState<Period>("jour");
    const [periodeHum, setPeriodeHum] = useState<Period>("jour");
    const { mesures, isLoading, error, isLive } = useMesures();

    const dataTemp = useMemo(
        () => getHistoryRows(mesures, periodeTemp),
        [mesures, periodeTemp]
    );

    const dataHum = useMemo(
        () => getHistoryRows(mesures, periodeHum),
        [mesures, periodeHum]
    );

    const statusText = error ?? (isLoading ? "Chargement" : isLive ? "Live" : "Hors ligne");

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
                        <h1>Historique</h1>
                        <p className={isLive ? style.liveStatus : style.offlineStatus}>{statusText}</p>
                    </div>
                </header>

                <section className={style.tableContainer}>

                    <div className={style.tableTop}>

                        <h2>🌡 Historique des températures</h2>

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

                    <table className={style.table}>

                        <thead>
                            <tr>
                                <th>Heure / Période</th>
                                <th>Température (°C)</th>
                                <th>Statut</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataTemp.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.time}</td>
                                    <td>{row.temperature}°C</td>
                                    <td>
                                        <span className={
                                            row.temperatureStatus === "Eleve" ? style.badgeEleve :
                                            style.badgeNormal
                                        }>
                                            {row.temperatureStatus === "Eleve" ? "Élevé" : "Normal"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </section>

                <section className={style.tableContainer}>

                    <div className={style.tableTop}>

                        <h2>💧 Historique des humidités</h2>

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

                    <table className={style.table}>

                        <thead>
                            <tr>
                                <th>Heure / Période</th>
                                <th>Humidité (%)</th>
                                <th>Statut</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataHum.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.time}</td>
                                    <td>{row.humidite}%</td>
                                    <td>
                                        <span className={
                                            row.humidityStatus === "Bas" ? style.badgeBas :
                                            style.badgeNormal
                                        }>
                                            {row.humidityStatus}
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
