# Setup

This is a frontend project for React that uses Next.js and backend uses Node.js with express.

You can see a live demo at https://psymax.de/

To get started, just clone the repository from `git clone https://github.com/RRFOORG/psymax.git`

## Running locally in development mode

### frontend

    cd frontend

#### Configuring

If you configure a .env file, You can adjust `NEXT_PUBLIC_API_HOST` with your api URL. E.g. `http://localhost:4000/api/`

    npm install
    npm run dev

### backend

    cd backend

#### Configuring

If you configure a .env file, You can adjust

    NODE_ENV = development
    PORT = default is 4000 but you can adjust
    DB_URL = replace with your database URL

    npm install
    npm start

Note: If you are running on Windows run install --noptional flag (i.e. `npm install --no-optional`) which will skip installing fsevents.

## Running using docker

To start docker container

    docker-compose up -d

To build application

    docker-compose up --build

To stop or remove docker container

    docker-compose down

To display the status of containers associated with your services

    docker-compose ps
