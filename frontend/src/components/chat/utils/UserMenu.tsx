import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { MemberType } from "../../../types/chat";
import AvatarBadge from "./AvatarBadge";
import { AdminPanelSettings, Block, Clear, DeveloperMode, HighlightOff, Mail, PanTool, PersonAdd, VolumeOff, VolumeUp } from "@mui/icons-material";
import { useState } from "react";
import IconPersoButton from "./IconPersoButton";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import * as statusUtils from "./statusFunctions";
import * as onClickUtils from "./onClickFunctions";
import { User } from '../../../types/User';
import { WebSocketContext } from '../../../contexts/WebsocketContext';
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
	bannedUsers: User[];
	member: MemberType;
	members: MemberType[];
}

const UserMenu = (props: UserMenuProps) => {
	const socket = useContext(WebSocketContext)
	const navigate = useNavigate();
	const { user, setUser } = useContext(UserContext)
	const [anchorAvatar, setAnchorAvatar] = useState<null | HTMLElement>(null);

	const handleAClick = (event: any) => {
		setAnchorAvatar(event.currentTarget);
	};

	const handleAClose = () => {
		setAnchorAvatar(null);
	};

	const handleProfileRedirect = () => {
		const link = '/players/' + props.member.nickName;
		navigate(link);
	}

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
				  nickname={props.member.nickName}
				  status={props.member.isOnline ? "ONLINE" : "OFFLINE"}
				  admin={statusUtils.checkIfAdmin(props.members, props.member.memberId)}
				  oper={statusUtils.checkIfOwner(user.joinedChatRoom?.owner, props.member.memberId)}
				  avatar={props.member.avatar}
				  look={true}/><span style={{ color: 'black' }}>{props.member.nickName}</span>
			</Button>
      <Menu
				anchorEl={anchorAvatar}
				open={Boolean(anchorAvatar)}
				onClose={handleAClose}
				className='black' >
				<MenuItem aria-label="user-menu" className='column'>
					<IconPersoButton 
						cond={true} 
						true={handleProfileRedirect} // Path to profil usr
						icon={<PersonAdd className='black'/>}
						text='Profil'
						false={null}
						iconAlt={null}
						textAlt={null}/>

					{ // If it is not the user himself
						user.id !== props.member.memberId &&
					<>
					 <IconButton size="small" sx={{ml:2}} onClick={
						statusUtils.isUserBlocked(user, props.member.memberId)
					 	? () => onClickUtils.onUnBlockClick(socket, user, props.member.memberId)
					 	: () => onClickUtils.onBlockClick(socket, user, props.member.memberId)}>
					 	<PanTool className={'black'}/>
					 	<span>Block</span>
					 </IconButton>

					{ // If it is not a private conversation
						user.joinedChatRoom?.userLimit !== 2 &&
					<>
						<IconButton size="small" sx={{ml:2}} onClick={() =>
							onClickUtils.onPrivMessageClick(
								socket, user, props.member.memberId, props.member.nickName
							)}>
							<Mail className='black'/>
							<span>PM</span>
						</IconButton>
						{ statusUtils.checkPrivileges(
								user.joinedChatRoom?.owner, user.id, props.members, props.member.memberId
							) && user.id !== props.member.memberId ?
						<>
						<IconButton size="small" sx={{ml:2}} onClick={
							statusUtils.isMuted(props.members, props.member.memberId)
							? () => onClickUtils.onMuteClick(
									socket, user.joinedChatRoom?.name, user.id, props.member.memberId, true
								)
							: () => onClickUtils.onMuteClick(
									socket, user.joinedChatRoom?.name, user.id, props.member.memberId, false
								)}>
							{statusUtils.isMuted(props.members, props.member.memberId)
								? <VolumeOff className='black'/> : <VolumeUp className='black'/>}
							<span>Mute</span>
						</IconButton>
						<IconButton size="small" sx={{ml:2}} onClick={() =>
							onClickUtils.onKickClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId
							)} >
							<Block className='black'/>
							<span>Kick</span>
						</IconButton>
						<IconButton size="small" sx={{ml:2}} onClick={
							statusUtils.checkIfBanned(props.bannedUsers, props.member.memberId)
							? () => onClickUtils.onBanClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, true
							)
							: () => onClickUtils.onBanClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, false
							)}>
							<HighlightOff className='black'/>
							<span>Ban</span>
						</IconButton>
						<IconButton size="small" sx={{ml:2}} onClick={
							statusUtils.checkIfAdmin(props.members, props.member.memberId)
							? () => onClickUtils.onMakeAdminClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, true
							)
							: () => onClickUtils.onMakeAdminClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, false
							)}>
							<AdminPanelSettings className='black'/>
							<span>Admin</span>
						</IconButton>
					 </> : <></>
					 } 
					<IconPersoButton 
						cond={true} 
						true={handleAClose}
						icon={<Clear className='black'/>}
						text='Close'
						false={null}
						iconAlt={null}
						textAlt={null}/>
				</>}  {/* End of user.joinedChatRoom?.userLimit !== 2 */}
				</>} {/* End of user.id !== props.member.memberId */}
				</MenuItem>
			</Menu>
    </div>
  )

};

export default UserMenu;

