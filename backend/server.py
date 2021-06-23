import asyncio
import json
import websockets
import functools

import api
from classes import Client


games = {}
selecting_clients = []


async def server(websocket, path, games, selecting_clients):
    client = Client(websocket)

    try:
        async for message in websocket:
            data = json.loads(message)
            await api.process_request(data, client, games, selecting_clients)

    finally:
        await api.actions.unregister(client, selecting_clients, games)


start_server = websockets.serve(
    functools.partial(server, games=games, selecting_clients=selecting_clients),
    "localhost",
    5555,
)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
