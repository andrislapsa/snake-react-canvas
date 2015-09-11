import React, { Component } from "react";
import _ from "lodash";
import { Scene } from "react-three";
import { connect } from "react-redux";
import { Range } from "immutable";
import * as snakeUtil from "./utils/snakeUtil";
import { initGame, startGame, pauseGame, move, grow, spawnFood } from "./actions/actionCreators";
import Camera from "./components/Camera";
import Cube from "./components/Cube";
import Food from "./components/Food";

export default class App extends Component {
    constructor() {
        super();
        this._onGameNewStartClick = this._onGameNewStartClick.bind(this);
        this._onGameStartClick = this._onGameStartClick.bind(this);
        this._onGamePauseClick = this._onGamePauseClick.bind(this);
    }

    _onGameNewStartClick() {
        this.props.dispatch(initGame());
        this.props.dispatch(startGame(_.partial(tick, this.props.dispatch)));
    }

    _onGameStartClick() {
        this.props.dispatch(startGame(_.partial(tick, this.props.dispatch)));
    }

    _onGamePauseClick() {
        this.props.dispatch(pauseGame());
    }

    render() {
        const {
            snakeBody,
            direction,
            foodPosition,
            mainLoopTimerID,
            score,
            gridSize
        } = this.props;

        let grid = snakeUtil.generateGrid();

        let createSection = segment => {
            return <Cube x={segment.get("x")} y={segment.get("y")} />;
        };

        snakeBody.map(segment => {
            let y = gridSize.get("height") - segment.get("y");
            grid[y][segment.get("x")] = "#";
        });

        let foodY = gridSize.get("height") - foodPosition.get("y");
        grid[foodY][foodPosition.get("x")] = "o";

        let webGLSize = {
            width: gridSize.get("width") * 10,
            height: gridSize.get("height") * 10
        };

        return (
            <div>
                <Scene camera="maincamera" {...webGLSize}>
                    <Camera {...webGLSize} />
                    {snakeBody.map(createSection)}
                    <Food x={foodPosition.get("x")} y={foodPosition.get("y")} />
                </Scene>

                <pre style={{lineHeight: "8px"}}>
                    {grid}
                </pre>
                <button
                    onClick={this._onGameNewStartClick}
                    disabled={mainLoopTimerID?"disabled":""}
                >
                    Start new game
                </button>
                <button
                    onClick={this._onGameStartClick}
                    disabled={mainLoopTimerID?"disabled":""}
                >
                    Start game
                </button>
                <button
                    onClick={this._onGamePauseClick}
                    disabled={mainLoopTimerID?"":"disabled"}
                >
                    Pause game
                </button>
                Score: {score}
            </div>
        );
    }
}

function tick(dispatch) {
    let state = store.getState(),
        snakeBody = state.get("snakeBody"),
        nextPosition = snakeUtil.getNextPosition(
            snakeBody.last(),
            state.get("direction")
        ),
        foodPosition = state.get("foodPosition");

    //console.log(foodPosition.toJSON(), nextPosition.toJSON(), snakeUtil.positionsMatch(nextPosition, foodPosition));

    if (snakeUtil.positionsMatch(nextPosition, foodPosition)) {
        dispatch(grow());
        dispatch(spawnFood());
    } else {
        dispatch(move());
    }
}

function selectStateParts(state) {
    return {
        direction: state.get("direction"),
        snakeBody: state.get("snakeBody"),
        foodPosition: state.get("foodPosition"),
        mainLoopTimerID: state.get("mainLoopTimerID"),
        score: state.get("score"),
        gridSize: state.get("gridSize")
    };
}

export default connect(selectStateParts)(App);
