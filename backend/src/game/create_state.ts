import { Default_params } from "./game.class";
import { GameState, Profile, Status, TypeMode } from "./Interface";

export function normal_state(player1: Profile, winingScore: number, player2? : Profile) {
    const res = {
        gameInfos: {
        width: Default_params.GAME_WIDTH,
        height: Default_params.GAME_HEIGHT,
        paddleHeight: Default_params.PADDLE_HEIGHT,
        paddleWidth: Default_params.PADDLE_WIDTH,
        ballRadius: Default_params.BALL_RADIUS,
        winingScore: winingScore,
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

export function training_state(player1 : Profile, winingScore : number) {
    const res = {
        gameInfos: {
          width: Default_params.GAME_WIDTH,
          height: Default_params.GAME_HEIGHT,
          paddleHeight: Default_params.PADDLE_HEIGHT,
          paddleWidth: Default_params.PADDLE_WIDTH,
          ballRadius: Default_params.BALL_RADIUS,
          winingScore: winingScore,
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

export function custom_state(player1 : Profile, winingScore : number, player2? : Profile) {
    const res = {
        gameInfos: {
            width: Default_params.GAME_WIDTH,
            height: Default_params.GAME_HEIGHT,
            paddleHeight: Default_params.PADDLE_HEIGHT,
            paddleWidth: Default_params.PADDLE_WIDTH,
            ballRadius: Default_params.BALL_RADIUS,
            winingScore: winingScore,
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
        obstacle : {
            x : Default_params.GAME_WIDTH - 3,
            y : 0,
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
    winingScore: number,
    player1: Profile,
    player2?: Profile,
  ): GameState {
    let res: any;
    if (type == TypeMode.NORMAL) {
      res = normal_state(player1, winingScore, player2);
    } else if (type == TypeMode.TRAINING) {
      res = training_state(player1, winingScore);
    } else if (type == TypeMode.CUSTOM){
        res = custom_state(player1, winingScore, player2);
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
    console.log(type);
    if (type == TypeMode.NORMAL) {
      res = {
        status: status,
        gameInfos: {
          originalWidth: state.gameInfos.width,
          originalHeight: state.gameInfos.height,
          paddleWidth: state.gameInfos.paddleWidth,
          paddleHeight: state.gameInfos.paddleHeight,
          ballRadius: state.gameInfos.ballRadius,
          time: Default_params.GAME_TIME - timeInSeconds,
          WinScore: state.gameInfos.WinScore,
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
          WinScore: state.gameInfos.WinScore,
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
    } else if (type == TypeMode.CUSTOM){
        res = {
            status: status,
            gameInfos: {
              originalWidth: state.gameInfos.width,
              originalHeight: state.gameInfos.height,
              paddleWidth: state.gameInfos.paddleWidth,
              paddleHeight: state.gameInfos.paddleHeight,
              ballRadius: state.gameInfos.ballRadius,
              time: timeInSeconds,
              WinScore: state.gameInfos.WinScore,
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
            obstacle : {
                x : state.obstacle?.x,
                y : state.obstacle?.y,
            },
            ball: {
              x: state.ball.position.x,
              y: state.ball.position.y,
            },
          };
    }
    return res;
  }