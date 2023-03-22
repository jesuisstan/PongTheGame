import { useRef, useEffect, useContext, useState } from 'react';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { Player_game, Props_game, Game_status } from './game.interface';
import { draw_state, draw_state_2 } from './utils/gameUtils';

function Pong(props : Props_game) {

	const socket = useContext(WebSocketContext);
	const [already_draw, set_already_draw] = useState<boolean>(false);
  const [time, set_time] = useState(300);
  const canvas_ref = useRef<HTMLCanvasElement>(null);
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
					{ ...players[0], score: args.player1.score},
					{ ...players[1], score: args.player2.score},
				]);
			}
		}
		if (!already_draw)
		{
			draw_state(args, canvas_ref);
			set_already_draw(true);
		}
		else {
			draw_state_2(args, canvas_ref);
		}
		if (args.status === 'ended')
		{
			props.set_game_state(Game_status.LOBBY);
			// TODO clear the canvas for reprint the lobby 
			alert('Game_finished');
		}
	})

	socket.on('game_aborted', (args) => {
		alert(args.reason);
		// TODO need to clear canvas adn change alert for something else
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
	});
 
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
