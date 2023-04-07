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
				onClick={/*user.avatar !== String(members[id as any]) // catch isNotUserActive
				?*/ handleAClick 
				/* : () => {} */ }>
			  <AvatarBadge
				  nickname={"Nickname"}
				  // playing={true} // catch isPlaying
				  online={true} // catch isOnline
				  admin={true} // catch isAdmin
				  oper={true} // catch isOper
				  avatar={"Nickname Avatar"} // catch avatar
				  look={true}/><span style={{ color: 'black' }}>Catch Nickname here</span>
			</Button>
      <Menu
				anchorEl={anchorAvatar}
				open={Boolean(anchorAvatar)}
				onClose={handleAClose}
				className='black' >
				<MenuItem aria-label="user-menu" className='column'>
					<IconButton size="small" sx={{ml:2}} onClick={handleAClick}>{/* catch profil */}
						<PersonAdd className='black'/>
						<span>Add friend</span>
					</IconButton>
					<IconButton size="small" sx={{ml:2}} onClick={handleAClick}>{/* catch makeMute / makeUnMute */}
						{/* catch isMuted ? <VolumeOff className='black'/> :*/ <VolumeUp className='black'/>}
						<span>Mute</span>
					</IconButton>
					<IconButton size="small" sx={{ml:2}} onClick={handleAClick}>{/* catch sendPrivateMsg */}
						<Mail className='black'/>
						<span>Private msg</span>
					</IconButton>
					<IconButton size="small" sx={{ml:2}} onClick={handleAClick}>{/* catch makeBlock / makeUnBlock */}
						<PanTool className={'black'}/>
						<span>Block</span>
					</IconButton>
			{
			// && catch isUserOper/isUserAdmin and isNotUserActive if true
				<>
					<IconButton size="small" sx={{ml:2}} onClick={handleAClick}>{/* catch makeKick */}
						<Block className='black'/>
						<span>Kick</span>
					</IconButton>
					<IconButton size="small" sx={{ml:2}} onClick={handleAClick}>{/* catch makeBan / makeUnBan*/}
						<HighlightOff className='black'/>
						<span>Ban</span>
					</IconButton>
					<IconButton size="small" sx={{ml:2}} onClick={handleAClick}>{/* catch makeAdmin */}
						<AdminPanelSettings className='black'/>
						<span>Admin</span>
					</IconButton>
				</> // else : <></>
					} 
					<IconButton size="small" sx={{ml:2}} onClick={handleAClose}>
						<Clear className='black'/>
						<span>Close</span>
					</IconButton>
				</MenuItem>
			</Menu>
      
      
    </div>
  )

};

export default UserMenu; 