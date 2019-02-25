# flyio-playground: react-ssr

## Stack

- TypeScript
- fly.io CDN
- react / react-router / react-hooks's useReducer / styled-components

## Develop

- `yarn install`
- `yarn dev`: Start application server on `http://localhost:3000`

## Deploy

Create account: [fly.io](https://fly.io) and Add your account

- Remove `.fly.yml`
- `npm install -g @fly/fly`
- `yarn deploy`: Deploy to fly.io

## TODO

- Split Chunks
- service worker
- blog in fly data collection
- lighthouse
- preload next link
- preload resource

## LICENSE

MIT
