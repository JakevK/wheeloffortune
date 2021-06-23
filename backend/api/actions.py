import sys
import inspect
import json
import asyncio


sys.path.append("..")
from classes import Game, Player


actions = {}


def action(action_name):
    """load all functions with action decorator to actions dict"""

    def inner_decorator(action):
        actions[action_name] = action
        return action

    return inner_decorator


def limit_stage(stage):
    # my brain hurts
    def inner_decorator(action):
        def wrapped(*args, **kwargs):
            if kwargs["client"].stage != stage:
                raise Exception(
                    f'Action "{action.__name__}" can only be run from the "{stage}" stage'
                )
            required_args = inspect.getargspec(action).args
            args_to_pass = [kwargs[arg] for arg in required_args]
            return action(*args_to_pass)

        return wrapped

    return inner_decorator


async def send(event, client, data):
    formatted_data = {"event": event, "data": data}
    await client.websocket.send(json.dumps(formatted_data))


def games_list(games):
    return [game.summary() for game in games.values()]


async def selection_send(selecting_clients, games):
    await asyncio.gather(
        *[
            send("selection", client, {"games": games_list(games)})
            for client in selecting_clients
        ]
    )


async def serve_lobby(client):
    def lobby(client):
        lobby_data = {
            "game": client.game.name,
            "players": {
                player.name: {
                    "score": player.score,
                    "is_self": (player == client.player),
                }
                for player in client.game.players
            },
            "is_admin": (client.game.admin == client.player),
        }
        return send("lobby", client, lobby_data)

    await asyncio.gather(*[lobby(player.client) for player in client.game.players])


@action("register")
@limit_stage("registration")
async def register(request_data, client, games, selecting_clients):
    if client.player:
        raise Exception("player already registered")
    player_name = request_data["name"]
    client.player = Player(player_name, client)
    selecting_clients.append(client)
    await send("selection", client, {"games": games_list(games)})
    client.set_stage("selection")


@action("unregister")
async def unregister(client, selecting_clients, games):
    if client.game:
        client.game.remove_player(client.player, games)
        await selection_send(selecting_clients, games)
    if client in selecting_clients:
        selecting_clients.remove(client)


@action("create game")
@limit_stage("selection")
async def create_game(request_data, client, games, selecting_clients):
    game_name = request_data["name"]

    if game_name in games:
        raise Exception(f"game already exists: {game_name}")

    games[game_name] = Game(game_name, client.player)
    selecting_clients.remove(client)
    await selection_send(selecting_clients, games)
    client.set_stage("lobby")
    await serve_lobby(client)


@action("join game")
@limit_stage("selection")
async def join_game(request_data, client, games, selecting_clients):
    game_name = request_data["name"]

    if game_name not in games:
        raise Exception(f"game does not exist: {game_name}")

    games[game_name].add_player(client.player)
    selecting_clients.remove(client)
    client.set_stage("lobby")
    await selection_send(selecting_clients, games)
    client.set_stage("lobby")
    await serve_lobby(client)


async def serve_game(game):
    async def send_game(player):
        game = player.client.game
        game_data = {
            "game": game.name,
            "players": [
                {
                    "name": curr_player.name,
                    "score": curr_player.score,
                    "is_self": (curr_player == player),
                }
                for curr_player in game.players
            ],
            "self": {"name": player.name, "score": player.score},
            "is_own_turn": player == game.players[game.turn],
            "turn": game.turn,
            "phrase": game.formatted_phrase(),
            "guessed": game.guessed,
            "wheel_value": game.wheel_value,
        }
        await send("game", player.client, game_data)

    await asyncio.gather(*[send_game(player) for player in game.players])


@action("start game")
@limit_stage("lobby")
async def start_game(client):
    game = client.game

    if game.admin != client.player:
        raise "player must be admin to start a game"

    game.start()

    await serve_game(client.game)


@action("guess")
@limit_stage("game")
async def take_guess(client, request_data):
    game = client.game
    player = client.player

    if player != game.current_player():
        raise f"it is not {player.name}'s turn right now"

    guess = request_data["guess"]

    player.award(game.wheel_value * game.take_guess(guess))

    game.spin_wheel()

    await serve_game(game)
