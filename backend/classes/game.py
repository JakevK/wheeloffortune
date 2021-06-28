import random
from .player import Player


class Game:
    """stores all data and processes related to a game of wheel-o-fortune"""

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
        """gotta have one of these bad boys for debugging"""
        return "Game:\n" + "\n".join([str(player) for player in self.players])

    def spin_wheel(self):
        """set the wheel position to a random value"""
        self.wheel_position = random.randint(0, len(self.prizes) - 1)
        # also increment this counter used for animations on the frontend
        self.turn_counter += 1

    def wheel_value(self):
        """return the prize associated with the current wheel position"""
        return self.prizes[self.wheel_position]

    def data(self):
        """return a summary of the game in dict format"""
        return {
            "players": {player.name: player.score for player in self.players},
            "phrase": self.formatted_phrase(),
            "guessed": self.guessed,
        }

    def current_player(self):
        """return the Player object for the current turn"""
        return self.players[self.turn]

    def add_player(self, player):
        """allow a player to join the game!"""

        if type(player) is not Player:  # can't join game if you're not a player
            raise Exception("players must be in the form of a Player object")
        if self.begun:  # can't join game if it has already started
            raise Exception("a player cannot be added to a game which has started")
        if player in self.players:  # can't join game if you already joined
            raise Exception(f"Player {player.name} is already in this game")
        if player.client.game:  # can't join game if you're in another game
            raise Exception(
                f'Player "{player.name}" is already in game "{player.client.game.name}"'
            )

        # everything seems good - let the player join
        self.players.append(player)
        player.client.game = self

    def remove_player(self, player, games):
        """let a player leave the game"""

        if type(player) is not Player:  # can't leave if you're not a player
            raise Exception(
                "players to be removed must be in the form of a Player object"
            )
        if player not in self.players:  # can't leave if you never joined
            raise Exception(f"Player with id {player.id} does not exist in this game")

        # all good to go - remove the player
        self.players.remove(player)
        # delete the game if that was the last remaining player
        if not self.players:
            del games[self.name]

    def new_phrase(self):
        """set the phrase to a new random one"""
        phrase_file = open(self.phrase_file)

        # iterate through phrase storage file to get a random phrase
        # using simplified "reservoir algorithm" (https://stackoverflow.com/a/3540315)
        chosen_line = next(phrase_file)
        for i, current_line in enumerate(phrase_file, 2):
            # for each line determine whether to replace the chosen line or not
            # based on decreasing probability as iteration continues
            # this gives every line an equal probability of being chosen
            # without loading the whole file into memory
            if random.randrange(i):
                continue
            chosen_line = current_line

        # remove newline character and set phrase variable
        self.phrase = chosen_line.split("\n")[0]

    def formatted_phrase(self):
        """return representation of the phrase for sending to client"""
        return [
            letter
            if (letter in self.guessed or letter not in "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
            else None
            for letter in self.phrase
        ]

    def take_guess(self, guess):
        """let someone take a guess"""

        if len(guess) > 1:  # going for the whole phrase - very bold
            if guess.upper() == self.phrase:
                # they got it right! finish up the round
                self.complete = True
                self.guessed.extend([letter for letter in list(guess.upper())])
                return "phrase"
            # they got it wrong! next turn time - and don't award them anything
            self.next_turn()
            return 0

        # guessing just one letter
        occurences = self.phrase.count(guess)  # times guess appears in phrase
        self.guessed.append(guess)

        # check if all letters in the phrase have been guessed
        if set(
            [letter for letter in self.phrase if letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
        ).issubset(self.guessed):
            self.complete = True
        if not occurences:  # unsuccessful - better luck next time!
            self.next_turn()

        return occurences

    def next_turn(self):
        """go to the next player's turn"""
        # circular list type beat
        # gotta go back to the start once you reach the end
        self.turn = (self.turn + 1) % len(self.players)

    def new_round(self):
        """set up a new round - reset a whole lot of stuff"""
        random.shuffle(self.players)
        self.spin_wheel()
        self.new_phrase()
        self.guessed = []
        self.turn = 0
        self.complete = False

    def start(self):
        """start the game for the first time! - how exciting"""
        if len(self.players) < 2:  # can't start a game with less than 3 players
            raise Exception("At least 2 players are required to start a game")

        # actually start the thing and update the stage of each client
        self.begun = True
        for player in self.players:
            player.client.set_stage("game")

        # prepare the first round
        self.new_round()
