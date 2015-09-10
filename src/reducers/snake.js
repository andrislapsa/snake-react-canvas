import { Map } from "immutable";
import { MOVE, CHANGE_DIRECTION, DIE, GROW, START_GAME, PAUSE_GAME } from "../actions/actionTypes";
import * as snakeUtil from "../utils/snakeUtil";
import initialState from "../initialState";

export function move(state, action) {
	if (action.type === MOVE) {
		return state.set(
			"snakeBody",
			snakeUtil.move(state.get("snakeBody"), state.get("direction"))
		);
	};

	return state;
}

export function changeDirection(state, action) {
	if (action.type === CHANGE_DIRECTION) {
		return action.direction;
	}

	return state;
}

export function initGame(state, action) {
	if (action.type !== INIT_GAME) {
		return state;
	}

	return state.merge(Map(initialState));
}

export function startGame(state, action) {
    if (action.type !== START_GAME) {
        return state;
    }

	return state.set(
		"mainLoopTimerID",
		window.setInterval(action.tickFn, 200)
	);
}

export function pauseGame(state, action) {
    if (action.type !== PAUSE_GAME) {
        return state;
    }

    let timerID = state.get("mainLoopTimerID");
    window.clearTimeout(timerID);

	return state.set(
		"mainLoopTimerID",
		undefined
	);
}
