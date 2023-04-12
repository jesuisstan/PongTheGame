import { Button, Divider, IconButton, Menu, MenuItem, Modal, Stack, TextField, Typography } from "@mui/material";
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
import errorAlert from "../../UI/errorAlert";

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
	
	
	const warningEmptyPass = () => {
		setOpenChangePwd(false);
		errorAlert("Password can't be empty");
	};
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
		if (newPassword.length === 0) warningEmptyPass();
		else {
			handleChangePwd(false);
		}
    setOpenChangePwd(false);
		setAnchorEl(null)
  };
	const handleChangePwd = async(deletePwd: boolean) => {
		await socket.emit('changePassword', {
			roomName: setting.roomName,
			newPassword: deletePwd ? '' : newPassword,
		});
		setAnchorEl(null)
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
					<Typography variant="h6" className='modal-title'>
						{setting.roomName.toUpperCase()}
					</Typography>
					<Divider/>
			{ // Begin of owner space for pwd protected rooms
			(statusUtils.checkIfOwner(setting.owner, user.id))
			&& <>
				<IconPersoButton
				 cond={isPwdProtected}
				 true={handleClickOpenChangePwd}
				 icon={<Password className="black"/>}
				 text="Change Password"
				 false={handleClickOpenChangePwd}
				 iconAlt={<Password className="black"/>}
				 textAlt="Set Pass"/>
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
							{isPwdProtected === true ? "Change password" : "Set password"}
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
									helperText="This field is required"
									label="New password *"
									type="password"
									inputProps={{ minLength: 1 }}
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
				</Modal>
				{ isPwdProtected === true ?
				<IconPersoButton
					cond={true}
					true={() => handleChangePwd(true)}
					icon={<Delete className="black"/>}
					text="Delete Password" /> : null}
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
