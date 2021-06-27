""" server.py
    main file for running the server
    handles connection and communication with websocket clients
"""
import os
import asyncio
import json
import websockets
import functools

import api
from classes import Client


games = {}  # keeps track of currently running games. keys are game name strings
selecting_clients = []  # keeps track of clients in the selecting stage


async def server(websocket, path, games, selecting_clients):
    """this is where websocket communication is handled

    Args:
        websocket: websocket reference passed in by the websockets library
        path: path on which the server runs
        games: dict of currently running games
        selecting_clients: list of clients currently in the selecting stage
    """

    client = Client(websocket)  # initialize a client instance for the connected client

    try:  # catch all errors so the server keeps running if something goes wrong

        async for message in websocket:  # parse and process messages sent by client
            data = json.loads(message)
            await api.process_request(data, client, games, selecting_clients)

    finally:  # unregister the client when it disconnects
        await api.actions.unregister(client, selecting_clients, games)


# status logging for developer convenience
print(f"server running on {os.environ['URL']}, port {os.environ['PORT']}")

# initialize the server
start_server = websockets.serve(
    functools.partial(server, games=games, selecting_clients=selecting_clients),
    os.environ["URL"],
    int(os.environ["PORT"]),
)

# start the event loop
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
