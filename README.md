# Dino WebSocket Server

## About

This project aims to be an implementation of a websocket server for chats and channels like Discord using Deno. But simpler

## Dependencies

[Deno](https://deno.land)

## Usage

### Start the server
 
```bash
deno run --allow-net --allow-read src/server.ts 
```

### Connect to server

You'll need a websocket client to connect. You can use any one, in this example will be used [wscat](https://www.npmjs.com/package/wscat)

```bash
wscat ws://127.0.0.1:8001/ws
```

See [Usage](https://github.com/OdilonDamasceno/dinowss/wiki/Usage) for how to use

## Wiki

See [Wiki](https://github.com/OdilonDamasceno/dinowss/wiki) for details

## Meta

Odilon Damasceno – [@sirskey](https://twitter.com/sirskey) – odilondamasceno@protonmail.com

Distributed under the GPL-3.0 license. See ``LICENSE`` for more information.

[https://github.com/OdilonDamasceno/dinowss](https://github.com/OdilonDamasceno/dinowss/)

## Contributing

1. Fork it (<https://github.com/OdilonDamasceno/dinowss/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
