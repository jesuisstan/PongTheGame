import { useRef, useEffect, useContext, useState } from 'react';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { Player_game, Props_game, Game_status, Position } from './game.interface';
import { draw_state, draw_state_2 } from './utils/gameUtils';

function Pong(props : Props_game) {

	const socket = useContext(WebSocketContext);
	const [already_draw, set_already_draw] = useState<boolean>(false);
  const [time, set_time] = useState(300);
  const [last_position, set_last_position] = useState<Position[]>([]);
  const canvas_ref = useRef<HTMLCanvasElement>(null);
  const [ctx, set_ctx] = useState(null);
  const [players, set_players] = useState<Player_game[]>(
		props.spectator || !props.players ? [] : [...props.players],
	);

  const state_ref = useRef(false);

  function on_key_release(event: KeyboardEvent) {
		on_key(event, 'release');
	}

	function on_key_press(event: KeyboardEvent) {
		on_key(event, 'press');
	}

  function on_key(event: KeyboardEvent, action: string) {
	console.log('socket emit');
		switch (event.key) {
			case 'ArrowUp':
				socket.emit('match_game_input', { action: action, direction: 'up' })
				break;
			case 'ArrowDown':
				socket.emit('match_game_input', { action: action, direction: 'down' })
				break;
		}
	}

	socket.on('match_game_state', (args) => {
		console.log(last_position.length);
		console.log(players.length);
		console.log(props.players?.length);
		if (props.spectator) {
			set_players([
				{
					infos: {
						name: args.player1.infos.infos.name,
						profile_picture: args.player1.infos.infos.profile_picture,
					},
					score: args.player1.infos.score,
				},
				{
					infos: {
						name: args.player2.infos.infos.name,
						profile_picture: args.player2.infos.infos.profile_picture,
					},
					score: args.player2.infos.score,
				},
			]);
		}
		else {
			if (players.length === 0) {
				set_players([
					{ ...players[0], score: args.player1.score,}
					// 	infos: {
					// 		name: args.player2.infos.name,
					// 		profile_picture: args.player2.infos.profile_picture,
					// 	},
					// },
				]);
				set_players([
					{ ...players[1], score: args.player2.score,
						infos: {
							name: args.player2.infos.name,
							profile_picture: args.player2.infos.profile_picture,
						},
					},
				]);
			}
		}
		set_last_position([
			{...last_position[0], x : args.player1.x, y: args.player1.y},
			{...last_position[1], x : args.player2.x, y: args.player2.y},
			{...last_position[2], x : args.ball.x, y: args.ball.y},
		])
		if (!already_draw)
		{
			if (!ctx)
				set_ctx(draw_state(args, canvas_ref));
			set_already_draw(true);
		}
		else {
			draw_state_2(ctx, last_position, args, canvas_ref);
		}
		if (args.status === 'ended')
		{
			props.set_game_state(Game_status.LOBBY);
			// TODO clear the canvas for reprint the lobby 
			console.log('Game_finished');
		}
	})

	socket.on('game_aborted', (args) => {
		console.log(args.reason);
		// TODO need to clear canvas adn change console.log for something else
	})

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
	}, [players, socket]);
 
  return (
    <div className="game">
			{/* {players.length > 0 && (
				<div>
					 <div>
						{ Player 1 Info}
						/> */}
						{/* Timer of the game */}
						{/* Player 2 info }
					</div>
				</div>
					)} */ }
			<canvas id="test" ref={canvas_ref}  />
		</div>
  );
};

export default Pong;
