class Player:
    """data and processes associated with a player in wheel-o-fortune"""

    def __init__(self, name, client):
        self.name = name
        self.score = 0
        self.client = client  # kinda circular reference thing going on here
        # doesn't seem to be an issue though and it really simplifies things

    def __str__(self):
        """debugging purposes"""
        return f"{self.name}: {self.score}"

    def award(self, score):
        """self explanatory
        tbh idk why this is a method
        probably useful in the future for expanding on the awarding process
        """
        self.score += score
