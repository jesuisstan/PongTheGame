import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { MemberType } from "../../../types/chat";
import AvatarBadge from "./AvatarBadge";
import { 	AdminPanelSettings, Block, Clear, HighlightOff, Mail,
					PanTool, PersonAdd, VolumeOff, VolumeUp
} from "@mui/icons-material";
import { useState } from "react";
import IconPersoButton from "./IconPersoButton";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import * as statusUtils from "./statusFunctions";
import * as onClickUtils from "./onClickFunctions";
import { User } from '../../../types/User';
import { WebSocketContext } from '../../../contexts/WebsocketContext';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  bannedUsers: User[];
  member: MemberType;
  members: MemberType[];
}

const UserMenu = (props: UserMenuProps) => {
  const socket = useContext(WebSocketContext);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
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
  };

  return (
    <div>
      <Button
				aria-controls={Boolean(anchorAvatar) ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={Boolean(anchorAvatar) ? 'true' : undefined}
				onClick={handleAClick}>
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
				className='black'
				id="basic-menu">
				<MenuItem aria-label="user-menu" className='column' sx={{display: 'flex', justifyContent: 'flex-start'}}>
					<IconPersoButton 
						cond={true} 
						true={handleProfileRedirect}
						icon={<PersonAdd className='black'/>}
						text='Profil'
						false={null}
						iconAlt={null}
						textAlt={null}/>

{ // If it is not the user himself
						user.id !== props.member.memberId &&
					<>
						<IconPersoButton // Block button
							cond={statusUtils.isUserBlocked(user, props.member.memberId)}
							true={() => onClickUtils.onUnBlockClick(socket, user, props.member.memberId)}
							icon={<PanTool className='gray'/>}
							text='Unblock'
							false={() => onClickUtils.onBlockClick(socket, user, props.member.memberId)}
							iconAlt={<PanTool className='black'/>}
							textAlt='Block'/>
					{ // If it is not a private conversation
						user.joinedChatRoom?.userLimit !== 2 &&
					<>
						<IconPersoButton // PM button
							cond={true}
							true={() => onClickUtils.onPrivMessageClick(
								socket, user, props.member.memberId, props.member.nickName)}
							icon={<Mail className='black'/>}
							text='PM'/>
						
						{ statusUtils.checkPrivileges(
								user.joinedChatRoom?.owner, user.id, props.members, props.member.memberId
							) && user.id !== props.member.memberId ?
						<>
						<IconPersoButton // Mute button
							cond={statusUtils.isMuted(props.members, props.member.memberId)}
							true={() => onClickUtils.onMuteClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, true)}
							icon={<VolumeOff className='gray'/>}
							text='Unmute'
							false={() => onClickUtils.onMuteClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, false)}
							iconAlt={<VolumeUp className='black'/>}
							textAlt='Mute'/>
						<IconPersoButton // Kick button
							cond={true}
							true={() => onClickUtils.onKickClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId)}
							icon={<Block className='black'/>}
							text='Kick'/>
						<IconPersoButton // Ban button
							cond={statusUtils.checkIfBanned(props.bannedUsers, props.member.memberId)}
							true={() => onClickUtils.onBanClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, true)}
							icon={<HighlightOff className='gray'/>}
							text='Unban'
							false={() => onClickUtils.onBanClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, false)}
							iconAlt={<HighlightOff className='black'/>}
							textAlt='Ban'/>
						<IconPersoButton // Make admin button
							cond={statusUtils.checkIfAdmin(props.members, props.member.memberId)}
							true={() => onClickUtils.onMakeAdminClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, true)}
							icon={<AdminPanelSettings className='gray'/>}
							text='Unadmin'
							false={() => onClickUtils.onMakeAdminClick(
								socket, user.joinedChatRoom?.name, user.id, props.member.memberId, false)}
							iconAlt={<AdminPanelSettings className='black'/>}
							textAlt='Admin'/>
					 </> : <></>
					 } 
				</>}  {/* End of user.joinedChatRoom?.userLimit !== 2 */}
				</>} {/* End of user.id !== props.member.memberId */}
				</MenuItem>
			</Menu>
    </div>
  );
};

export default UserMenu;
