import random
from .player import Player


class Game:
    def __init__(self, name, admin, phrase_file):
        self.name = name
        self.admin = admin
        self.phrase_file = phrase_file
        self.players = []
        self.begun = False
        self.turn = 0
        self.turn_counter = 0
        self.phrase = ""
        self.guessed = []
        self.add_player(admin)
        self.wheel_position = 0
        self.complete = False
        self.prizes = [
            500,
            650,
            900,
            2500,
            500,
            900,
            700,
            650,
            500,
            700,
            500,
            600,
            550,
            600,
            650,
            950,
        ]

    def __str__(self):
        return "Game:\n" + "\n".join([str(player) for player in self.players])

    def spin_wheel(self):
        self.wheel_position = random.randint(0, len(self.prizes) - 1)
        self.turn_counter += 1

    def wheel_value(self):
        return self.prizes[self.wheel_position]

    def data(self):
        return {
            "players": {player.name: player.score for player in self.players},
            "phrase": self.formatted_phrase(),
            "guessed": self.guessed,
        }

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
        phrase_file = open(self.phrase_file)

        # iterate through phrase storage file to get a random phrase
        # using simplified "reservoir algorithm" (https://stackoverflow.com/a/3540315)
        chosen_line = next(phrase_file)
        for i, current_line in enumerate(phrase_file, 2):
            # for each line determine whether to replace the chosen line or not
            # based on decreasing probability as iteration continues
            if random.randrange(i):
                continue
            chosen_line = current_line

        # remove newline character and set phrase variable
        self.phrase = chosen_line.split("\n")[0]

    def formatted_phrase(self):
        return [
            letter
            if (letter in self.guessed or letter not in "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
            else None
            for letter in self.phrase
        ]

    def take_guess(self, guess):
        # TODO: validate(guess)
        occurences = self.phrase.count(guess)
        self.guessed.append(guess)
        if set(
            [letter for letter in self.phrase if letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
        ).issubset(self.guessed):
            self.complete = True
        if not occurences:
            self.next_turn()
        return occurences

    def next_turn(self):
        self.turn = (self.turn + 1) % len(self.players)

    def new_round(self):
        random.shuffle(self.players)
        self.spin_wheel()
        self.new_phrase()
        self.guessed = []
        self.turn = 0
        self.complete = False

    def start(self):
        if len(self.players) < 3:
            raise Exception("At least 3 players are required to start a game")

        self.begun = True
        for player in self.players:
            player.client.set_stage("game")

        self.new_round()
