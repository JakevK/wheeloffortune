class Player:
    def __init__(self, name, client):
        self.name = name
        self.score = 0
        self.client = client

    def __str__(self):
        return f"{self.name}: {self.score}"

    def award(self, score):
        self.score += score
