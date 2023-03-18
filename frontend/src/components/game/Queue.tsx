import { Player_info } from './game.interface';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { useContext } from 'react';
import { Game_status } from './Game';
import Load from './Load';

export interface Queue_props {
	set_game_state: (gameState: Game_status) => void;
	join_match: (player1: Player_info, player2: Player_info) => void;
}

function Queue(props: Queue_props) {
    const socket = useContext(WebSocketContext);

	function cancel_queue() {
		props.set_game_state(Game_status.LOBBY);
        socket.emit('match_making', { action: 'cancel' });
	}

	return (
		<div >
			<h1>Waiting for opponent...</h1>
			<Load color="pink" />
			<button onClick={cancel_queue}>
				Cancel
			</button>
		</div>
	);
}

export default Queue;
