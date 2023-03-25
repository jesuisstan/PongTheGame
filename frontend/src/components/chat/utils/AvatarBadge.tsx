import React from 'react';
import { Avatar, Badge } from '@mui/material';

interface IMember {
	nickname: string,
	online: boolean,
	admin: boolean,
	oper: boolean,
	avatar: string | undefined,
	look: boolean
}

const AvatarBadge = (member: IMember) => {

	const colorO = (member.online) ? "success" : "error";
	const colorA = (member.admin) ? "info" :( (member.oper) ? "warning" : undefined);
	const avatar = (member.nickname) ? stringAvatar(member.nickname) : undefined;

	return ( <>
		{member.look === false
			? <> {!member.avatar
				? <Avatar alt={ member.nickname } {...stringAvatar(member.nickname)} />
				: <Avatar alt={ member.nickname } src={ member.avatar } />
			}	</>
			:	<Badge	color={colorA} overlap='circular' variant='dot' anchorOrigin={{vertical:'top', horizontal:'right' }} >
					<Badge	color={colorO} overlap='circular' variant='dot' anchorOrigin={{vertical:'bottom', horizontal:'right' }} >
						{!member.avatar
							? <Avatar alt={ member.nickname } {...stringAvatar(member.nickname)} />
							: <Avatar alt={ member.nickname } src={ member.avatar } />
						}
					</Badge>
				</Badge>
		}
		</>
	)
}

function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
function stringAvatar(name: string ) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name[0]}${name[1]}`,
    };
  }

export default AvatarBadge;
