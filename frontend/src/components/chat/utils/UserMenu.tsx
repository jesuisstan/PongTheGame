import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { MemberType } from "../../../types/chat";
import AvatarBadge from "./AvatarBadge";
import { AdminPanelSettings, Block, Clear, DeveloperMode, HighlightOff, Mail, PanTool, PersonAdd, VolumeOff, VolumeUp } from "@mui/icons-material";
import { useState } from "react";
import IconPersoButton from "./IconPersoButton";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";


const UserMenu = (member: MemberType | any) => {
	
	const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);
	const { user, setUser } = useContext(UserContext)

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
				  status={"ONLINE"} // catch isOnline
				  admin={member.modes === 'a'} // catch isAdmin
				  oper={member.modes === 'o'} // catch isOper
				  avatar={"Nickname Avatar"} // catch avatar
				  look={true}/><span style={{ color: 'black' }}>Catch Nickname here</span>
			</Button>
      <Menu
				anchorEl={anchorAvatar}
				open={Boolean(anchorAvatar)}
				onClose={handleAClose}
				className='black' >
				<MenuItem aria-label="user-menu" className='column'>
					<IconPersoButton 
						cond={true} 
						true={handleAClose} // Path to profil usr
						icon={<PersonAdd className='black'/>}
						text='Profil'
						false={null}
						iconAlt={null}
						textAlt={null}/>
					{/* <IconButton size="small" sx={{ml:2}} onClick={isMuted(msg.author.id)
						 ? () => onUnMuteUserClick(msg.author.id)
						 : () => onMuteUserClick(msg.author.id)}>
					 	 {isMuted(msg.author.id) ? <VolumeOff className='black'/> : <VolumeUp className='black'/>}
					 	<span>Mute</span>
					 </IconButton>
					 <IconButton size="small" sx={{ml:2}} onClick={() => onPrivMessageClick(msg.author)}>
					 	<Mail className='black'/>
					 	<span>PM</span>
					 </IconButton>
					 <IconButton size="small" sx={{ml:2}} onClick={isUserBlocked(msg.author.id)
					 	?	() => onUnBlockClick(msg.author.id)
					 	: () => onBlockClick(msg.author.id)}>
					 	<PanTool className={'black'}/>
					 	<span>Block</span>
					 </IconButton>
					 { // isUserOper || user.id !== member.memberId ? 
					 <>
					 <IconButton size="small" sx={{ml:2}} onClick={() => onKickClick(msg.author.id)} >
					 	<Block className='black'/>
					 	<span>Kick</span>
					 </IconButton>
					 <IconButton size="small" sx={{ml:2}} onClick={checkIfBanned(msg.author.id)
					 	? () => onUnBanClick(msg.author.id)
					 	: () => onBanClick(msg.author.id)}>
					 	<HighlightOff className='black'/>
					 	<span>Ban</span>
					 </IconButton>
					 <IconButton size="small" sx={{ml:2}} onClick={isUserOper ?
					 	() => onUnMakeOperClick(msg.author.id)
					 	: () => onMakeOperClick(msg.author.id)}>
					 	<AdminPanelSettings className='black'/>
					 	<span>Admin</span>
					 </IconButton>
					 </> // : <></>
					 }  */}
					<IconPersoButton 
						cond={true} 
						true={handleAClose}
						icon={<Clear className='black'/>}
						text='Close'
						false={null}
						iconAlt={null}
						textAlt={null}/>
				</MenuItem>
			</Menu>
    </div>
  )

};

export default UserMenu;

