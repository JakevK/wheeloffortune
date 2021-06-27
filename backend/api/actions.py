""" actions.py
    the place to define action functions/plugins
    these are registered using the action() decorator
    and can be modified using the limit_stage() decorator
"""
import os
import sys
import inspect
import json
import asyncio


sys.path.append("..")
from classes import Game, Player


actions = {}  # dict to keep track of registered action plugins


def action(action_name):
    """load all functions with action decorator to actions dict"""

    def inner_decorator(action):
        actions[action_name] = action
        return action

    return inner_decorator


def limit_stage(stage):
    """a decorator to specify a stage which a client must be in to run an action"""

    # higher order functional magic
    def inner_decorator(action):
        # wrap the action function in order to pass in the right args
        def wrapped(*args, **kwargs):
            # don't allow the action to run if the client's stage doesn't match the specified one
            if kwargs["client"].stage != stage:
                raise Exception(
                    f'Action "{action.__name__}" can only be run from the "{stage}" stage'
                )
            # determine which arguments to pass based on action definition
            required_args = inspect.getargspec(action).args
            args_to_pass = [kwargs[arg] for arg in required_args]
            return action(*args_to_pass)

        return wrapped

    return inner_decorator


async def send(event, client, data):
    """use websocket connection to transfer data to client"""
    formatted_data = {"event": event, "data": data}
    await client.websocket.send(json.dumps(formatted_data))


async def serve_selection(selecting_clients, games):
    """serve selection stage data to clients in the selection stage"""

    def games_list(games):
        """returns a simplified list of specified games"""
        return [
            {"name": game.name, "size": len(game.players), "begun": game.begun}
            for game in games.values()
        ]

    # send data asynchronously to each client
    await asyncio.gather(
        *[
            send("selection", client, {"games": games_list(games)})
            for client in selecting_clients
        ]
    )


async def serve_lobby(client):
    """serve lobby stage data to clients in the lobby stage"""

    def send_lobby(client):
        """sends lobby data to one client"""
        lobby_data = {
            "game": client.game.name,
            "players": [
                {
                    "name": player.name,
                    "score": player.score,
                    "is_self": (player == client.player),
                }
                for player in client.game.players
            ],
            "is_admin": (client.game.admin == client.player),
        }
        return send("lobby", client, lobby_data)

    # send data asynchronously to each client in the specified client's game
    await asyncio.gather(*[send_lobby(player.client) for player in client.game.players])


async def serve_game(game):
    """serve game stage data to clients in the game stage"""

    async def send_game(player):
        """sends game data to one client based on player specified"""
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
            "is_own_turn": player == game.current_player(),
            "turn": game.turn,
            "phrase": game.formatted_phrase(),
            "guessed": game.guessed,
            "complete": game.complete,
            "is_admin": (player == game.admin),
            "possible_wheel_values": game.prizes,
            "wheel_position": game.wheel_position,
            "turn_counter": game.turn_counter,
            "admin": game.admin.name,
        }
        await send("game", player.client, game_data)

    # send data asynchronously to each client in the specified game
    await asyncio.gather(*[send_game(player) for player in game.players])


"""========================ACTION PLUGIN DEFINITIONS========================"""
"""====================================|===================================="""
"""====================================V===================================="""


@action("register")
@limit_stage("registration")
async def register(request_data, client, games, selecting_clients):
    """register a player"""

    if client.player:  # shouldn't happen due to limit_stage but just in case
        raise Exception("player already registered")

    # create a new Player instance for the given client
    player_name = request_data["name"]
    client.player = Player(player_name, client)

    # move the client into the selection stage
    selecting_clients.append(client)
    client.set_stage("selection")

    await serve_selection([client], games)


@action("unregister")
async def unregister(client, selecting_clients, games):
    """clean up after client when it disconnects"""
    if client.game:  # remove player from game and update other players
        client.game.remove_player(client.player, games)
        await serve_selection(selecting_clients, games)
        if client.stage == "game":
            await serve_game(client.game)

    if client in selecting_clients:
        selecting_clients.remove(client)


@action("create game")
@limit_stage("selection")
async def create_game(request_data, client, games, selecting_clients):
    """create a new game"""  # kinda explains itself. idk if i need docstrings

    game_name = request_data["name"]

    if game_name in games:  # can't have 2 games with the same name
        raise Exception(f"game already exists: {game_name}")

    # get the file containing phrases for the game to use
    # defining here allows future flexibility for features like categories
    api_dir = os.path.dirname(os.path.realpath(__file__))
    phrase_file = os.path.join(api_dir, "phrases.txt")

    # create game and store reference in games dict so all clients can access it
    games[game_name] = Game(game_name, client.player, phrase_file)

    # move client to lobby stage and update clients accordingly
    selecting_clients.remove(client)
    await serve_selection(selecting_clients, games)
    client.set_stage("lobby")
    await serve_lobby(client)


@action("join game")
@limit_stage("selection")
async def join_game(request_data, client, games, selecting_clients):
    """join an existing game"""  # docstring really useful here

    game_name = request_data["name"]

    if game_name not in games:  # can't join a game if it doesn't exist lol
        raise Exception(f"game does not exist: {game_name}")

    # add the player to the game
    games[game_name].add_player(client.player)

    # move client to lobby stage and update clients accordingly
    selecting_clients.remove(client)
    await serve_selection(selecting_clients, games)
    client.set_stage("lobby")
    await serve_lobby(client)


@action("start game")
@limit_stage("lobby")
async def start_game(client):
    """start a game - only can be done by the admin of that game"""

    game = client.game

    if game.admin != client.player:  # can't start game unless client is admin
        raise "player must be admin to start a game"

    game.start()

    await serve_game(client.game)


@action("guess")
@limit_stage("game")
async def take_guess(client, request_data):
    """take a guess for the phrase"""

    game = client.game
    player = client.player

    if player != game.current_player():  # can't guess unless it's your turn
        raise f"it is not {player.name}'s turn right now"

    guess = request_data["guess"]

    result = game.take_guess(guess)

    if result == "phrase":  # the whole phrase was guessed correctly
        player.award(1000)
    else:
        # award player prize depending on occurences and wheel value
        player.award(game.wheel_value() * result)

    game.spin_wheel()

    await serve_game(game)


@action("next round")
@limit_stage("game")
async def next_round(client):
    """move onto a new round
    for when the phrase has been completed and the round is over
    """
    if client.player != client.game.admin: # can't start a new round unless admin
        raise "only the admin can start a new round"

    client.game.new_round()
    await serve_game(client.game)
