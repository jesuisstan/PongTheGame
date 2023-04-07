import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { MemberType } from "../../../types/chat";
import AvatarBadge from "./AvatarBadge";
import { AdminPanelSettings, Block, Clear, DeveloperMode, HighlightOff, Mail, PanTool, PersonAdd, VolumeOff, VolumeUp } from "@mui/icons-material";
import { useState } from "react";

const UserMenu = (member: any) => {
	
  const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);

  const handleAClick = (event: any) => {
		setAnchorAvatar(event.currentTarget);
	};

	const handleAClose = () => {
		setAnchorAvatar(null);
	};

  return (
    <div>
      <Button
				aria-controls="basic-menu"
				aria-haspopup="true"
				aria-expanded={Boolean(anchorAvatar)}
				onClick={/*user.avatar !== String(members[id as any])
				?*/ handleAClick 
				/* : () => {} */ }>
			  <AvatarBadge
				  nickname={"Nickname"}
				  // playing={true} // catch isPlaying
				  online={true} // catch isOnline
				  admin={true} // catch isAdmin
				  oper={true} // catch isOper
				  avatar={"Nickname Avatar"} // catch avatar
				  look={true}/>	Catch Nickname here
			</Button>
      <Menu
				anchorEl={anchorAvatar}
				open={Boolean(anchorAvatar)}
				onClose={handleAClose}
				className='black column-barre' >
				<MenuItem aria-label="back" className='column-barre'>
					<IconButton onClick={handleAClick}>{/* catch profil */}
						<PersonAdd className='black'/>
						<span>add friend</span>
					</IconButton>
					<IconButton onClick={handleAClick}>{/* catch makeMute / makeUnMute */}
						{/* catch isMuted ? <VolumeOff className='black'/> :*/ <VolumeUp className='black'/>}
						<span>mute</span>
					</IconButton>
					<IconButton onClick={handleAClick}>{/* catch sendPrivateMsg */}
						<Mail className='black'/>
						<span>private msg</span>
					</IconButton>
					<IconButton onClick={handleAClick}>{/* catch makeBlock / makeUnBlock */}
						<PanTool className={'black'}/>
						<span>block</span>
					</IconButton>
			{
			// && catch isUserOper/isUserAdmin and isNotUserActive if true
				<>
					<IconButton onClick={handleAClick}>{/* catch makeKick */}
						<Block className='black'/>
						<span>kick</span>
					</IconButton>
					<IconButton onClick={handleAClick}>{/* catch makeBan / makeUnBan*/}
						<HighlightOff className='black'/>
						<span>ban</span>
					</IconButton>
					<IconButton onClick={handleAClick}>{/* catch makeAdmin */}
						<DeveloperMode className={"black"}/>
						<AdminPanelSettings className='black'/>
						<span>Admin</span>
					</IconButton>
				</> // else : <></>
					} 
					<IconButton onClick={handleAClose}>
						<Clear className='black'/>
						<span>close</span>
					</IconButton>
				</MenuItem>
			</Menu>
      
      
    </div>
  )

};

export default UserMenu; 