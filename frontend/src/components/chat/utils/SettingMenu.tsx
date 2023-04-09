import { Button, IconButton, Menu, MenuItem, Modal, Stack, TextField, Typography } from "@mui/material";
import { ChatRoomType, MemberType } from "../../../types/chat";
import AvatarBadge from "./AvatarBadge";
import { AdminPanelSettings, Block, Clear, Delete, DeveloperMode, ExitToApp, HighlightOff, Mail, PanTool, Password, PersonAdd, Save, Settings, VolumeOff, VolumeUp } from "@mui/icons-material";
import { useState } from "react";
import IconPersoButton from "./IconPersoButton";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import * as statusUtils from "./statusFunctions";
import * as onClickUtils from "./onClickFunctions";
import { User } from '../../../types/User';
import { WebSocketContext } from '../../../contexts/WebsocketContext';
import { ModalClose, ModalDialog } from "@mui/joy";
import { LoadingButton } from "@mui/lab";
import * as MUI from '../../UI/MUIstyles';
import "../Chat.css";

interface SettingMenuProps {
  roomName: string;
	owner: number;
  onReturn: () => void;
}

const SettingMenu = (setting: SettingMenuProps) => {
	const socket = useContext(WebSocketContext)
	const { user, setUser } = useContext(UserContext)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Modify password
  const [openChangePwd, setOpenChangePwd] = useState(false);
	const [isPwdProtected, setIsPwdProtected] = useState<boolean>(false);
	const [newPassword, setNewPassword] = useState<string>('');
	const isPasswordProtected = async (roomName: string
	) => {
		await socket.emit('isPasswordProtected', { roomName: roomName },
			(response: boolean) => { setIsPwdProtected(response); })
	}
	isPasswordProtected(setting.roomName);
  const handleClickOpenChangePwd = () => {
    setOpenChangePwd(true);
  };
  const handleCloseChangePwd = () => {
		handleChangePwd(false);
    setOpenChangePwd(false);
  };
	const handleChangePwd = async(deletePwd: boolean) => {
		await socket.emit('changePassword', {
			roomName: setting.roomName,
			newPassword: deletePwd ? '' : newPassword,
		});
	};
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
    <div>
			<IconButton
				title="Room settings"
				onClick={handleClick}
				size="small"
				sx={{ ml: 2 }}
				aria-controls={Boolean(anchorEl) ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={Boolean(anchorEl) ? 'true' : undefined}>
				<Settings className='black' />
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				className='black ' >
					<div className="column">

			{ // Begin of owner space for non protected rooms
				(statusUtils.checkIfOwner(setting.owner, user.id))
				&& isPwdProtected === false
				&& <>
				<IconPersoButton
				 cond={true}
				 true={handleClickOpenChangePwd}
				 icon={<Password className="black"/>}
				 text="Add pass" />
				<Modal
					className='black'
					open={openChangePwd}
					onClose={handleCloseChangePwd}>
					<ModalDialog
						aria-labelledby="modal-modal-title"
						sx={MUI.modalDialog}>
						<ModalClose onClick={handleCloseChangePwd}/>
						<Typography
							id="modal-modal-title"
							component="h2"
							className='modal-title'>
							Set password
						</Typography>
						<form onSubmit={handleCloseChangePwd}>
							<Stack spacing={2}>
								<Stack spacing={1}>
								<Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
									New password
								</Typography>
								<TextField
									autoFocus
									required={true}
									helperText="Password must be at least 4 characters long"
									label="new password"
									type="password"
									inputProps={{ minLength: 4 }}
									inputRef={(input) => {
										if (input != null) input.focus();
									}}
									onChange={(e) => setNewPassword(e.target.value)}
									/>
								</Stack>
								<LoadingButton
									type="submit"
									onClick={handleCloseChangePwd}
									startIcon={<Save />}
									variant='contained'
									color='inherit'>
									SAVE
								</LoadingButton>
							</Stack>
						</form>
					</ModalDialog>
				</Modal></>
				// End of owner space for non protected rooms
			}

			{ // Begin of owner space for pwd protected rooms
			(statusUtils.checkIfOwner(setting.owner, user.id))
			&& isPwdProtected === true
			&& <>
				<IconPersoButton
				 cond={true}
				 true={handleClickOpenChangePwd}
				 icon={<Password className="black"/>}
				 text="Change Password" />
				<Modal
					className='black'
					open={openChangePwd}
					onClose={handleCloseChangePwd}>
					<ModalDialog
						aria-labelledby="modal-modal-title"
						sx={MUI.modalDialog}>
						<ModalClose onClick={handleCloseChangePwd}/>
						<Typography
							id="modal-modal-title"
							component="h2"
							className='modal-title'>
							Change password
						</Typography>
						<form onSubmit={handleCloseChangePwd}>
							<Stack spacing={2}>
								<Stack spacing={1}>
								<Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
									New password
								</Typography>
								<TextField
									autoFocus
									required
									helperText="Password must be at least 4 characters long"
									label="new password"
									type="password"
									inputProps={{ minLength: 4 }}
									onChange={(e) => setNewPassword(e.target.value)}
									/>
								</Stack>
								<LoadingButton
									type="submit"
									onClick={handleCloseChangePwd}
									startIcon={<Save />}
									variant='contained'
									color='inherit'>
									SAVE
								</LoadingButton>
							</Stack>
						</form>
					</ModalDialog>
				</Modal>
				<IconPersoButton
					cond={true}
					true={() => handleChangePwd(true)}
					icon={<Delete className="black"/>}
					text="Delete Password" />
				</>
				// End of owner space
			}
				<IconPersoButton
					cond={true}
					true={setting.onReturn}
					icon={<ExitToApp className='black'/>}
					text="Leave"/>
				<IconPersoButton
					cond={true}
					true={handleClose}
					icon={<Clear className='black'/>}
					text="Close"/>
				</div>
			</Menu>
		</div>
  )

};

export default SettingMenu;
