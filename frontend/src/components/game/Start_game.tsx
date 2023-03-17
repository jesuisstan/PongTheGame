
import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { Game_status } from './Game';
import { Game_player } from './game.interface';

interface Start_game_props {
	players: Game_player[];
	set_game_state: (gameState: Game_status) => void;
}

function Start_game(props: Start_game_props) {
	const [time, set_time] = useState(5);
    const socket = useContext(WebSocketContext);

	function is_pre_game_event(data: any) {
		return data.event === 'playing';
	}

    socket.on('match_starting' , (args) => {
        set_time(args.time);
        if(args.time === 0)
            props.set_game_state(Game_status.PLAYING);
    })

	return (
		<div >
			<div >
				{/* <PlayerCard
					player={props.players[0]}
					position={PlayerPosition.LEFT}
					type={PlayerCardType.BEFORE_GAME}
				/>
				<PlayerCard
					player={props.players[1]}
					position={PlayerPosition.RIGHT}
					type={PlayerCardType.BEFORE_GAME}
				/> */}
			</div>
			<h1 >Start in {time} ...</h1>
		</div>
	);
}

export default Start_game;
