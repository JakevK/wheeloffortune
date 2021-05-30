from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Player(db.Model):
    __tablename__ = "player"

    id = db.Column(db.Integer(), primary_key=True)
    client_id = db.Column(db.String(), nullable=False)
    name = db.Column(db.String(25), nullable=False)
    score = db.Column(db.Integer(), nullable=False, default=0)
    is_admin = db.Column(db.Integer(), nullable=False, default=0)
    
    game_id = db.Column(db.Integer(), db.ForeignKey('game.id'), default=None)
    game = db.relationship('Game', backref=db.backref('players', lazy=True))
    
    def __repr__(self):
        return f'<Player {self.name}>'


class Game(db.Model):
    __tablename__ = "game"

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(25), unique=True, nullable=False)
    started = db.Column(db.Integer(), nullable=False, default=0)
    turn = db.Column(db.Integer(), default=0)
    guessed_letters = db.Column(db.String(26), nullable=False, default='')

    phrase_id = db.Column(
        db.Integer(), db.ForeignKey('phrase.id'), default=None)
    phrase = db.relationship('Phrase', backref=db.backref('games', lazy=True))

    def __repr__(self):
        return f'<Game {self.id}>'


class Phrase(db.Model):
    __tablename__ = "phrase"

    id = db.Column(db.Integer, primary_key=True)
    phrase = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f'<Phrase {self.id}>\n"{self.phrase}"'
