import { Default_params } from './game.class';
import { GameState, Profile, Status, TypeMode } from './Interface';

export function normal_state(
  player1: Profile,
  winScore: number,
  player2?: Profile,
) {
  const res = {
    gameInfos: {
      width: Default_params.GAME_WIDTH,
      height: Default_params.GAME_HEIGHT,
      paddleHeight: Default_params.PADDLE_HEIGHT,
      paddleWidth: Default_params.PADDLE_WIDTH,
      ballRadius: Default_params.BALL_RADIUS,
      winScore: winScore,
    },
    player1: {
      profile: player1,
      paddle: {
        x: Default_params.PADDLE_OFFSET,
        y: Default_params.GAME_HEIGHT / 2 - Default_params.PADDLE_HEIGHT / 2,
      },
      score: 0,
      event: null,
    },
    player2: {
      profile: player2,
      paddle: {
        x:
          Default_params.GAME_WIDTH -
          Default_params.PADDLE_OFFSET -
          Default_params.PADDLE_WIDTH,
        y: Default_params.GAME_HEIGHT / 2 - Default_params.PADDLE_HEIGHT / 2,
      },
      score: 0,
      event: null,
    },
    ball: {
      position: {
        x: Default_params.GAME_WIDTH / 2,
        y: Default_params.GAME_HEIGHT / 2,
      },
      direction: {
        x: 0,
        y: 0,
      },
      collidable: true,
      velocity: Default_params.BALL_DEFAULT_SPEED,
    },
  };
  return res;
}

export function training_state(player1: Profile, winScore: number) {
  const res = {
    gameInfos: {
      width: Default_params.GAME_WIDTH,
      height: Default_params.GAME_HEIGHT,
      paddleHeight: Default_params.PADDLE_HEIGHT,
      paddleWidth: Default_params.PADDLE_WIDTH,
      ballRadius: Default_params.BALL_RADIUS,
      winScore: winScore,
    },
    player1: {
      profile: player1,
      paddle: {
        x: Default_params.PADDLE_OFFSET,
        y: Default_params.GAME_HEIGHT / 2 - Default_params.PADDLE_HEIGHT / 2,
      },
      score: 0,
      event: null,
    },
    player2: {
      paddle: {
        x:
          Default_params.GAME_WIDTH -
          Default_params.PADDLE_OFFSET -
          Default_params.PADDLE_WIDTH,
        y: Default_params.GAME_HEIGHT / 2 - Default_params.PADDLE_HEIGHT / 2,
      },
      score: 0,
      event: null,
    },
    ball: {
      position: {
        // x: Default_params.PADDLE_OFFSET + 10,
        // y: 0,
        x: Default_params.GAME_WIDTH / 2,
        y: Default_params.GAME_HEIGHT / 2,
      },
      direction: {
        x: 0,
        y: 0,
      },
      collidable: true,
      velocity: Default_params.BALL_DEFAULT_SPEED,
    },
  };
  return res;
}

export function custom_state(
  player1: Profile,
  winScore: number,
  player2?: Profile,
) {
  const res = {
    gameInfos: {
      width: Default_params.GAME_WIDTH,
      height: Default_params.GAME_HEIGHT,
      paddleHeight: Default_params.PADDLE_HEIGHT,
      paddleWidth: Default_params.PADDLE_WIDTH,
      ballRadius: Default_params.BALL_RADIUS,
      obstacleHeight: Default_params.OBSTACLE_HEIGHT,
      obstacleWidth: Default_params.OBSTACLE_WIDTH,
      winScore: winScore,
    },
    player1: {
      profile: player1,
      paddle: {
        x: Default_params.PADDLE_OFFSET,
        y: Default_params.GAME_HEIGHT / 2 - Default_params.PADDLE_HEIGHT / 2,
      },
      score: 0,
      event: null,
    },
    player2: {
      profile: player2,
      paddle: {
        x:
          Default_params.GAME_WIDTH -
          Default_params.PADDLE_OFFSET -
          Default_params.PADDLE_WIDTH,
        y: Default_params.GAME_HEIGHT / 2 - Default_params.PADDLE_HEIGHT / 2,
      },
      score: 0,
      event: null,
    },
    obstacle: {
      position: {
        x: Default_params.GAME_WIDTH / 2 - Default_params.OBSTACLE_WIDTH / 2,
        y: 0,
      },
      direction: 1,
    },
    ball: {
      position: {
        x: Default_params.GAME_WIDTH / 2,
        y: Default_params.GAME_HEIGHT / 2,
      },
      direction: {
        x: 0,
        y: 0,
      },
      collidable: true,
      velocity: Default_params.BALL_DEFAULT_SPEED,
    },
  };
  return res;
}

export function get_default_game_state(
  type: TypeMode,
  winScore: number,
  player1: Profile,
  player2?: Profile,
): GameState {
  let res: any;
  if (type == TypeMode.NORMAL) {
    res = normal_state(player1, winScore, player2);
  } else if (type == TypeMode.TRAINING) {
    res = training_state(player1, winScore);
  } else if (type == TypeMode.CUSTOM) {
    res = custom_state(player1, winScore, player2);
  }
  return res;
}

export function convert_state_to_sendable(
  type: TypeMode,
  state: GameState,
  status: Status,
  timeInSeconds: number,
) {
  let res: any;
  if (type == TypeMode.NORMAL) {
    res = {
      status: status,
      gameInfos: {
        originalWidth: state.gameInfos.width,
        originalHeight: state.gameInfos.height,
        paddleWidth: state.gameInfos.paddleWidth,
        paddleHeight: state.gameInfos.paddleHeight,
        ballRadius: state.gameInfos.ballRadius,
        winScore: state.gameInfos.winScore,
      },
      player1: {
        paddle: {
          x: state.player1.paddle.x,
          y: state.player1.paddle.y,
        },
        infos: {
          name: state.player1.profile?.user.nickname,
          avatar: state.player1.profile?.user.avatar,
        },
        score: state.player1.score,
        current: false,
      },
      player2: {
        paddle: {
          x: state.player2?.paddle.x,
          y: state.player2?.paddle.y,
        },
        infos: {
          name: state.player2.profile?.user.nickname,
          avatar: state.player2.profile?.user.avatar,
        },
        score: state.player2?.score,
        current: false,
      },
      ball: {
        x: state.ball.position.x,
        y: state.ball.position.y,
      },
    };
  } else if (type == TypeMode.TRAINING) {
    res = {
      status: status,
      gameInfos: {
        originalWidth: state.gameInfos.width,
        originalHeight: state.gameInfos.height,
        paddleWidth: state.gameInfos.paddleWidth,
        paddleHeight: state.gameInfos.paddleHeight,
        ballRadius: state.gameInfos.ballRadius,
        time: timeInSeconds,
        winScore: state.gameInfos.winScore,
      },
      player1: {
        paddle: {
          x: state.player1.paddle.x,
          y: state.player1.paddle.y,
        },
        infos: {
          name: state.player1.profile?.user.nickname,
          avatar: state.player1.profile?.user.avatar,
        },
        score: state.player1.score,
        current: false,
      },
      player2: {
        paddle: {
          x: state.player2?.paddle.x,
          y: state.player2?.paddle.y,
        },
        infos: {
          name: 'AI',
          avatar: '',
        },
        score: state.player2?.score,
        current: false,
      },
      ball: {
        x: state.ball.position.x,
        y: state.ball.position.y,
      },
    };
  } else if (type == TypeMode.CUSTOM) {
    res = {
      status: status,
      gameInfos: {
        originalWidth: state.gameInfos.width,
        originalHeight: state.gameInfos.height,
        paddleWidth: state.gameInfos.paddleWidth,
        paddleHeight: state.gameInfos.paddleHeight,
        ballRadius: state.gameInfos.ballRadius,
        obstacleHeight: state.gameInfos.obstacleHeight,
        obstacleWidth: state.gameInfos.obstacleWidth,
        time: timeInSeconds,
        winScore: state.gameInfos.winScore,
      },
      player1: {
        paddle: {
          x: state.player1.paddle.x,
          y: state.player1.paddle.y,
        },
        infos: {
          name: state.player1.profile?.user.nickname,
          avatar: state.player1.profile?.user.avatar,
        },
        score: state.player1.score,
        current: false,
      },
      player2: {
        paddle: {
          x: state.player2?.paddle.x,
          y: state.player2?.paddle.y,
        },
        infos: {
          name: state.player2.profile?.user.nickname,
          avatar: state.player2.profile?.user.avatar,
        },
        score: state.player2?.score,
        current: false,
      },
      obstacle: {
        position: {
          x: state.obstacle?.position.x,
          y: state.obstacle?.position.y,
        },
        direction: state.obstacle?.direction,
      },
      ball: {
        x: state.ball.position.x,
        y: state.ball.position.y,
      },
    };
  }
  return res;
}

export function convert_invitation(socket: any, payload: any) {
  const res = {
    from: {
      nickname: socket.user.nickname,
      avatar: socket.user.avatar,
    },
    gameInfo: {
      obstacle: payload.obstacle,
      winScore: payload.winScore,
    },
  };
  return res;
}
