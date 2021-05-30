from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from config import config
from models import *


app = Flask(__name__)
app.config['SECRET_KEY'] = config['SECRET_KEY']

db_uri = config['DATABASE_URL']
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
db = SQLAlchemy(app)

socketio = SocketIO(app, cors_allowed_origins='*')


@socketio.on('register')
def register_user(data):
    user_name = data['name']
    # TODO: user name validation
    client_id = request.sid

    player = Player(
        client_id=client_id,
        name=user_name,
    )
    db.session.add(player)
    db.session.commit()

    emit('register', {'client_id': client_id})


@socketio.on('create')
def create_game(data):
    game_name = data['game_name']
    # TODO: game name validation

    # check if game with given name already exists
    existing_game = db.session.query(Game).filter_by(name=game_name).first()
    if existing_game:
        return emit('create', {'error': 'A game with this name already exists'})

    player = db.session.query(Player).filter_by(client_id=request.sid).first()
    player.is_admin = 1

    game = Game(name=game_name)

    db.session.add(game)
    db.session.commit()

    emit('create', {})


@socketio.on('disconnect')
def remove_user():
    player = db.session.query(Player).filter_by(client_id=request.sid).first()
    if player:
        db.session.delete(player)
        db.session.commit()


if __name__ == '__main__':
    socketio.run(app, debug=True)
