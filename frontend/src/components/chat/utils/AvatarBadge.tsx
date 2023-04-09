import React from 'react';
import { Avatar, Badge } from '@mui/material';
import * as color  from '../../UI/colorsPong';

interface IMember {
	nickname: string,
	status: string,
	admin: boolean,
	oper: boolean,
	avatar: string | undefined,
	look: boolean
}

const AvatarBadge = (member: IMember) => {

	const colorO = member.status === 'PLAYING'
	? "info"
	: member.status === 'ONLINE'
	? 'success'
	: 'error';
	const colorA = (member.oper)
	? "warning"
	:( (member.admin)
	? "secondary"
	: "default");
	const avatar = (member.avatar) ? member.avatar : undefined;

	return ( <>
		{member.look === false
			? <> {!member.avatar
				? <Avatar alt={ member.nickname } {...stringAvatar(member.nickname)} />
				: <Avatar alt={ member.nickname } src={ avatar } />
			}	</>
			:	<Badge	color={colorA} overlap='circular' variant='dot' anchorOrigin={{vertical:'top', horizontal:'right' }} >
					<Badge	color={colorO} overlap='circular' variant='dot' anchorOrigin={{vertical:'bottom', horizontal:'right' }} >
						{!member.avatar
							? <Avatar alt={ member.nickname } {...stringAvatar(member.nickname)} />
							: <Avatar alt={ member.nickname } src={avatar} />
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
