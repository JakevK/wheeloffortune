import inspect
import logging

from .actions import *

logging.basicConfig()


async def process_request(request_data, client, games, selecting_clients):
    """
    example request_data = {
        "action": action,
        ...more action specific data
    }
    """
    action_name = request_data["action"]

    if action_name not in actions:
        logging.error(f"unsupported action {action_name}")
        return

    action = actions[action_name]

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
        await action(**args_to_pass)
    except Exception as e:
        logging.error(e)
