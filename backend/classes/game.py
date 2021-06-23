import random
from .player import Player


class Game:
    def __init__(self, name, admin):
        self.name = name
        self.admin = admin
        self.players = []
        self.begun = False
        self.turn = 0
        self.phrase = ""
        self.guessed = []
        self.add_player(admin)
        self.wheel_value = 0

    def __str__(self):
        return "Game:\n" + "\n".join([str(player) for player in self.players])

    def spin_wheel(self):
        self.wheel_value = random.choice([1000, 800, 500, 100, 200])

    def data(self):
        return {
            "players": {player.name: player.score for player in self.players},
            "phrase": self.formatted_phrase(),
            "guessed": self.guessed,
        }

    def lobby_data(self):
        return {"players": {player.name: player.score for player in self.players}}

    def summary(self):
        return {"name": self.name, "size": len(self.players), "begun": self.begun}

    def current_player(self):
        return self.players[self.turn]

    def add_player(self, player):
        if type(player) is not Player:
            raise Exception("players must be in the form of a Player object")
        if self.begun:
            raise Exception("a player cannot be added to a game which has started")
        if player in self.players:
            raise Exception(f"Player {player.name} is already in this game")
        if player.client.game:
            raise Exception(
                f'Player "{player.name}" is already in game "{player.client.game.name}"'
            )

        self.players.append(player)
        player.client.game = self

    def remove_player(self, player, games):
        if type(player) is not Player:
            raise Exception(
                "players to be removed must be in the form of a Player object"
            )
        if player not in self.players:
            raise Exception(f"Player with id {player.id} does not exist in this game")

        self.players.remove(player)
        if not self.players:
            del games[self.name]

    def new_phrase(self):
        self.phrase = "TURN AROUND AND SAY"

    def formatted_phrase(self):
        return " ".join(
            [
                letter
                if (
                    letter in self.guessed or letter not in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                )
                else "_"
                for letter in self.phrase
            ]
        )

    def take_guess(self, guess):
        # TODO: validate(guess)
        occurences = self.phrase.count(guess)
        self.guessed.append(guess)
        if set(
            [letter for letter in self.phrase if letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
        ).issubset(self.guessed):
            print("winnenr")
        if not occurences:
            self.next_turn()
        return occurences

    def next_turn(self):
        self.turn = (self.turn + 1) % len(self.players)

    def shuffle_players(self):
        random.shuffle(self.players)

    def start(self):
        if len(self.players) < 3:
            raise Exception("At least 3 players are required to start a game")
        self.shuffle_players()
        self.spin_wheel()
        self.turn = 0
        self.begun = True
        self.new_phrase()
        for player in self.players:
            player.client.set_stage("game")
