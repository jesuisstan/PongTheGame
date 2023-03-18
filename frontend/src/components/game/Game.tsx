import { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from '../pages/PleaseLogin';
import styles from './Game.module.css';
import Pong from './Pong';
import { Game_player, Game_result, Player_info } from './game.interface';
import ButtonPong from '../UI/ButtonPong';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import Start_game from './Start_game';
import Button from '@mui/material/Button';
import Queue from './Queue';

export enum Game_status {
	LOBBY = 'lobby',
	BEGIN_GAME = 'begin_game',
	QUEUE = 'queue',
	PREGAME = 'pregame',
	PLAYING = 'playing',
	SPECTATE = 'spectate',
}


const Game = () => {
  const socket = useContext(WebSocketContext)

  const { user, setUser } = useContext(UserContext);
  const state_ref = useRef(Game_status.LOBBY);
  // const [gameState, set_game_state] = useState(Game_state.LOBBY);
  const [result, set_result] = useState<Game_result | null>(null);
  const [game_state, set_game_state] = useState(Game_status.LOBBY);
  const [players, set_players] = useState<Game_player[]>([]);

  socket.on("matchmaking", (args) => {
	set_game_state(Game_status.BEGIN_GAME);
    console.log({args});
  });

  // const { send_message } = socket.emit()
  function join_queu() {
		set_game_state(Game_status.QUEUE);
    socket.emit('match_making', { action: 'join' })
	}

  function join_match(player1: Player_info, player2: Player_info) {
		set_players([
			{ infos: player1, score: 0 },
			{ infos: player2, score: 0 },
		]);
		set_game_state(Game_status.PLAYING);
	}

  useEffect(() => {
		state_ref.current = game_state;
	}, [game_state]);

  function endMatch(result: Game_result) {
		set_result(result);
		set_game_state(Game_status.LOBBY);
	}

  function is_game_aborted_event(data: any): boolean {
		return data.event === 'game-aborted';
	}


  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div >
      <div >
			{game_state === Game_status.LOBBY && (
				<div >
          <Button
            sx={{
              marginTop: 10,
              backgroundColor: 'black',
              ':hover': {
                backgroundColor: 'rgba(253, 80, 135, 0.6)',
                color: 'black',
                fontWeight: 'Bold'
              }
            }}
            title={'test'}
            size="medium"
            variant="contained"
            onClick= {() => {
              	join_queu();
              }}
          >
            {'test'}
          </Button>
				</div>
			)}
			{game_state === Game_status.QUEUE && (
				<Queue
					set_game_state={set_game_state}
					join_match={join_match}
				/>
			)}
			{game_state === Game_status.BEGIN_GAME && (
				<Start_game players={players} set_game_state={set_game_state} />
			)}
			{game_state === Game_status.PLAYING && (
				<Pong spectator={false} players={players} endMatch={endMatch} />
			)}
			{/* {} */}
			{game_state === Game_status.SPECTATE && (
				<Pong spectator={true} endMatch={endMatch} />
			)}
		</div>
    </div>
  );
};

export default Game;
