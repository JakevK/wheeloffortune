class Client:
    """for storing data related to a websocket connection/client"""

    def __init__(self, websocket):
        self.websocket = websocket  # websocket connection reference
        self.player = None  # Player object reference
        self.game = None  # Game object reference
        self.set_stage("registration")

    def set_stage(self, stage):
        """self explanatory :)
        this is a method because future development may
        implement available stage restrictions here
        """
        self.stage = stage
