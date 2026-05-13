# Deploiement Docker

## Architecture

```txt
navigateur
  |
  v
proxy nginx :8080
  |
  |-- /              -> client React
  |-- /api/...       -> server Express
  |-- /socket.io/... -> server Socket.IO

server Express
  |
  |-- db:5432        -> PostgreSQL
  |-- mqtt:1883      -> Mosquitto
```

Dans Docker, chaque service est dans son propre container.

Important :

```txt
localhost = le container actuel
```

Donc le backend ne doit pas appeler PostgreSQL avec `localhost:5432`.
Il doit appeler le service Docker :

```env
DATABASE_URL=postgresql://app:app@db:5432/projet_transversal
MQTT_URL=mqtt://mqtt:1883
```

## Lancer l'application en local avec Docker

Depuis le dossier `projet_transversal_group_F` :

```sh
docker compose up --build -d
```

Puis ouvrir :

```txt
http://localhost:8080
```

Tester l'API :

```sh
curl http://localhost:8080/api/data/last
```

Voir les containers :

```sh
docker compose ps
```

Voir les logs du backend :

```sh
docker compose logs -f server
```

Arreter l'application :

```sh
docker compose down
```

## Services

- `proxy` : point d'entree HTTP, expose `8080` sur ta machine.
- `client` : build React servi par Nginx.
- `server` : API Express, Socket.IO, Prisma et client MQTT.
- `db` : PostgreSQL avec volume persistant `postgres_data`.
- `mqtt` : Mosquitto avec volumes persistants `mqtt_data` et `mqtt_logs`.

## Pour un vrai serveur

Sur un serveur public, on remplacera souvent :

```yaml
ports:
  - "8080:80"
```

par :

```yaml
ports:
  - "80:80"
  - "443:443"
```

Et on ajoutera HTTPS avec Caddy, Traefik, ou Nginx + Certbot.

La base de donnees ne devrait pas etre exposee publiquement en production.
On pourra donc retirer :

```yaml
ports:
  - "5432:5432"
```

MQTT peut rester expose si le Pico doit se connecter depuis l'exterieur du serveur.
