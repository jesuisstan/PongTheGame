import { useRef, useEffect, useContext, useState, useCallback } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import ScoreBar from './ScoreBar';
import VictoryModal from './VictoryModal';
import ButtonPong from '../UI/ButtonPong';
import * as util from './gameUtils';
import styles from './Game.module.css';
import useWebSocket from 'react-use-websocket';
import { Player_game, Props_game, Game_state } from './game.interface';
import { draw_state } from './gameUtils';
import { construct } from 'ramda';
import React from 'react';

// const DEFAULT_WIN_SCORE = 3;
// const DEFAULT_BALL_SPEED_X = 10;
// const DEFAULT_BALL_SPEED_Y = 10;
// const CANVAS_HEIGHT = 600;
// const CANVAS_WIDTH = 800;
// const FPS = 35;
// const BALL_RADIUS = 10;
// const PADDLE_WIDTH = 20;
// const PADDLE_HEIGHT = CANVAS_HEIGHT / 6;
// const PADDLE_COLOR = 'rgb(253, 80, 135)';
// const DEFAULT_PADDLE_POSITION = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;

// let paddle1Y = DEFAULT_PADDLE_POSITION;
// let paddle2Y = DEFAULT_PADDLE_POSITION;
// let ballPosition = {
//   X: CANVAS_WIDTH / 2,
//   Y: CANVAS_HEIGHT / 2
// };
// let ballSpeed = {
//   X: DEFAULT_BALL_SPEED_X,
//   Y: DEFAULT_BALL_SPEED_Y
// };

// const setDefaultBallSpeed = () => {
//   ballSpeed.X = DEFAULT_BALL_SPEED_X;
//   ballSpeed.Y = DEFAULT_BALL_SPEED_Y;
// };

function Pong(props : Props_game) {
	var game_state : Game_state= {
		gameInfos : {originalWidth : 0, originalHeight : 0, paddleHeight : 0, paddleWidth : 0, ballRadius : 0, time : 0},
		player1 : {infos : {infos : {name : "", profile_picture : ""}, score : 0}, current : false, paddle : {x : 0, y : 0},},
		player2 : {infos : {infos : {name : "", profile_picture : ""}, score : 0}, current : false, paddle : {x : 0, y : 0},},
		ball : { x: 0, y : 0}};
	const socket = useContext(WebSocketContext);
	
  const [time, set_time] = useState(300);
  const canvas_ref = useRef<HTMLCanvasElement>(null);
  const [players, set_players] = useState<Player_game[]>(
		props.spectator || !props.players ? [] : [...props.players],
	);
  const state_ref = useRef(false);


  socket.on('match_get_ball', (args) => {
	game_state.ball.x = args.ball.x;
	game_state.ball.y = args.ball.y;
  })

  socket.on('match_get_user', (args) => {
	if (!game_state.player1 || !game_state.player1.infos) {
		game_state.player1.infos.infos.name = args.name;
		game_state.player1.infos.infos.profile_picture = args.picture
		game_state.player1.infos.score = 0;
		game_state.player1.paddle.x = args.x;
		game_state.player1.paddle.y = args.y;
	}
	else{
		game_state.player2.infos.infos.name = args.name;
		game_state.player2.infos.infos.profile_picture = args.picture
		game_state.player2.infos.score = 0;
		game_state.player2.paddle.x = args.x;
		game_state.player2.paddle.y = args.y;
	}
  })

  socket.on('match_get_game_infos', (args) => {
	game_state.gameInfos.originalHeight = args.originalHeight;
	game_state.gameInfos.originalWidth = args.originalWidth;
	game_state.gameInfos.paddleHeight = args.height;
	game_state.gameInfos.paddleWidth = args.width;
	game_state.gameInfos.time = args.time;
  })

  socket.on('match_start', (args) => {
	if (props.spectator) {
		set_players([
			{
				infos: {
					name: game_state.player1.infos.infos.name,
					profile_picture: game_state.player1.infos.infos.profile_picture,
				},
				score: game_state.player1.infos.score,
			},
			{
				infos: {
					name: game_state.player2.infos.infos.name,
					profile_picture: game_state.player2.infos.infos.profile_picture,
				},
				score: game_state.player2.infos.score,
			},
		]);
	set_players([
		{ ...players[0], score: game_state.player1.infos.score },
		{ ...players[1], score: game_state.player2.infos.score },
	]
	);
	}
	draw_state(game_state, canvas_ref);
})

	// socket.on('match_starting', (args) => {
	// 	if (is_game_state_event(props))
	// 		draw_state(args.data, canvas_ref);

	// })
//   const { send_message } : any = useWebSocket(process.env.REACT_APP_URL_BACKEND, {
// 		share: true,
// 		onMessage: ({ data }) => {
// 			data = JSON.parse(data);
// 			if (is_game_state_event(data)) {
// 				set_time(data.data.gameInfos.time);
// 				if (props.spectator) {
// 					set_players([
// 						{
// 							infos: {
// 								name: data.data.player1.name,
// 								profile_picture:
// 									data.data.player1.profile_picture,
// 							},
// 							score: data.data.player1.score,
// 						},
// 						{
// 							infos: {
// 								name: data.data.player2.name,
// 								profile_picture:
// 									data.data.player2.profile_picture,
// 							},
// 							score: data.data.player2.score,
// 						},
// 					]);
// 				} else {
// 					set_players([
// 						{ ...players[0], score: data.data.player1.score },
// 						{ ...players[1], score: data.data.player2.score },
// 					]);
// 				}
// 				draw_state(data.data, canvas_ref);
// 			}
// 			if (is_game_result_message(data) && props.endMatch) {
// 				props.endMatch(data.data);
// 			}
// 		},
// 		filter: ({ data }) => {
// 			return (
// 				is_game_state_event(JSON.parse(data)) ||
// 				is_game_result_message(JSON.parse(data))
// 			);
// 		},
// 	});

  function on_key_release(event: KeyboardEvent) {
		on_key(event, 'release');
	}

	function on_key_press(event: KeyboardEvent) {
		on_key(event, 'press');
	}

  function on_key(event: KeyboardEvent, action: string) {
		switch (event.key) {
			case 'ArrowUp':
				socket.emit('match_game_input', { action: action, direction: 'up' })
				break;
			case 'ArrowDown':
				socket.emit('match_game_input', { action: action, direction: 'down' })
				break;
		}
	}

  useEffect(() => {
		if (!state_ref.current) {
			state_ref.current = true;
			if (props.spectator) {
				return () => {
					socket.emit('match_spectate_leave', { })
				};
			}
			window.addEventListener('keydown', on_key_press);
			window.addEventListener('keyup', on_key_release);

			return () => {
				window.removeEventListener('keydown', on_key_press);
				window.removeEventListener('keyup', on_key_release);
			};
		}
	}, []);
 
  return (
    <div className="game">
			{players.length > 0 && (
				<div>
					<div>
						{/* <PlayerCard
							player={players[0]}
							position={PlayerPosition.LEFT}
							type={PlayerCardType.DURING_GAME}
						/> */}
						{/* <Timer time={time} /> */}
						{/* <PlayerCard
							player={players[1]}
							position={PlayerPosition.RIGHT}
							type={PlayerCardType.DURING_GAME}
						/> */}
					</div>
					<div>
						<canvas ref={canvas_ref}  />
					</div>
				</div>
			)}
		</div>
  );
};

export default Pong;
