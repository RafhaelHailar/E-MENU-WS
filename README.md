<h1 align="center">
E-MENU WS SERVER
<br>
 Menu Booking App Hackathon
</h1>

<p align="center">
The menu booking app aims to revolutionize the dining experience by allowing users to 
scan a QR code at their table, place an order from their mobile device, and have the 
order sent directly to the kitchen's queueing system. This will streamline the order 
process, improve efficiency, and enhance customer satisfaction.
</p>
 <p align="center">
  <a href="https://drive.google.com/file/d/1_2ewsbhrPRzLnq6dJ_LyZFMaW8eDpdZx/view?usp=sharing">Project Wiki</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#prerequisites">Prerequisites</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a> •

</p>
<br>
<br>

## Tech Stack

- Node.js
- Socket\.io
- Redis

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. Clone the project from the Github 'tapup-fe' main branch (dev). Copy the clone link.

```bash
  e.g. https://github.com/RafhaelHailar/E-MENU-WS.git
```

2. Open your target folder where you want to clone the project, then right-click and open your Terminal (Command Prompt/Powershell/Gitbash). Enter the following command plus the clone link to execute.

```bash
git clone https://github.com/RafhaelHailar/E-MENU-WS.git
```

3. Change directory to the project folder.

```bash
cd E-MENU-WS
```

4. Install the dependencies.

```bash
npm i
```

or

```bash
yarn
```

5. Set up environment variables.

in `.env`.

```bash
PORT=8888 # the port where the websocket server runs
API_SERVER_BASE_URL=http://localhost:8080/api # the base url of api server

REDIS_DB_HOST=localhost # redis host
REDIS_DB_PORT=6379 # redis port
REDIS_DB_PASSWORD= # redis password
```

6. Start the server to test if the website is functional.

```bash
npm run dev
```

7. A localhost link will be provided in the terminal. In case the website does not open automatically in the browser, use the link to connect to your socket io client.

```bash
  e.g. ws://localhost:8888
```

8. To stop the server, type the following shortcut key: ctrl + 'C', then press 'Y' after the specified command is shown in the terminal.

```bash
  e.g. ^C^CTerminate batch job (Y/N)?
```
