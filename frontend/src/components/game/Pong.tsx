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
import { Queue_props } from './Queue';
import { Game_status } from './Game';

function Pong(props : Props_game, queue : Queue_props) {
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

  socket.on('match_game_state', (args) => {
	game_state.gameInfos = args.gameInfos;
	game_state.player1 = args.player1;
	game_state.player2 = args.player2;
	game_state.ball = args.ball;
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
		}
		else {
			game_state.player1.current = args.player1.current;
			game_state.player2.current = args.player2.current;
			// game_state.player1.paddle.x = args.player1.paddle.x;
			// game_state.player1.paddle.y = args.player1.paddle.y;
			// game_state.player2.paddle.x = args.player2.paddle.x;
			// game_state.player2.paddle.y = args.player2.paddle.y;
			set_players([
				{ ...players[0], score: args.player1.score},
				{ ...players[1], score: args.player2.score},
			]);
		}
		draw_state(game_state, canvas_ref);
		console.log(args.status);
		if (args.status === 'ended')
			queue.set_game_state(Game_status.LOBBY);
		// if (args)
	})

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

			// return () => {
			// 	window.removeEventListener('keydown', on_key_press);
			// 	window.removeEventListener('keyup', on_key_release);
			// };
		}
	}, []);
 
  return (
    <div className="game">
			{/* {players.length > 0 && (
				<div>
					 <div>
						{ <PlayerCard
							player={players[0]}
							position={PlayerPosition.LEFT}
							type={PlayerCardType.DURING_GAME}
						/> */}
						{/* <Timer time={time} /> */}
						{/* <PlayerCard
							player={players[1]}
							position={PlayerPosition.RIGHT}
							type={PlayerCardType.DURING_GAME}
						/> }
					</div>
				</div>
					)} */ }
			<canvas id="test" ref={canvas_ref}  />
		</div>
  );
};

export default Pong;
