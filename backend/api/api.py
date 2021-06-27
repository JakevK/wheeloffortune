""" api.py
    provides an interface for the server to run action functions
    action functions are specified in actions.py using decorator syntax
"""
import inspect
import logging

from .actions import *

logging.basicConfig()  # used for debugging since all errors are caught by the server


async def process_request(request_data, client, games, selecting_clients):
    """process requests forwarded by the server

    Args:
        request_data: {
            "action": action, (a string referencing an action function)
            ...more action specific data
        }
        client: Client object from which the request originated
        games: dict of all active games on the server
        selecting_clients: list of all clients in the selecting stage
    """

    action_name = request_data["action"]

    # handle unsupported and potentially malicious requests
    if action_name not in actions:
        logging.error(f"unsupported action {action_name}")
        return

    action = actions[action_name]

    # arguments which can be passed into an action
    available_args = {
        "request_data": request_data,
        "client": client,
        "games": games,
        "selecting_clients": selecting_clients,
    }

    if action.__name__ == "wrapped":
        # limit_stage decorator will decide which args to pass
        # provide all of them so it can do so
        args_to_pass = available_args
    else:
        # limit_stage wrapper will not be used
        # determine which args to pass
        required_args = inspect.getargspec(action).args
        args_to_pass = {arg: available_args[arg] for arg in required_args}

    try:
        # run the specified action with all the arguments it needs
        await action(**args_to_pass)
    except Exception as e:  # error logging for debugging
        logging.error(e)
