class Client:
    def __init__(self, websocket):
        self.websocket = websocket
        self.player = None
        self.game = None
        self.set_stage("registration")

    def set_stage(self, stage):
        self.stage = stage
