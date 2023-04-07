import * as React from 'react';
import { MemberType } from "../../../types/chat";
import { Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { PeopleAlt } from '@mui/icons-material';
import AvatarBadge from './AvatarBadge';


type Anchor = "right";

const MemberList = ({ members }: { members: MemberType[] }) => {
  const [state, setState] = React.useState({
    right: false
  });;

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor, members: MemberType[]) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {Object.keys(members).map((id, index) => (
				<div key={ index } >
          {/* <Button */}
					  <AvatarBadge
					  	nickname={"Nickname"}
					  	// playing={true} // catch isPlaying
					  	online={true} // catch isOnline
					  	admin={true} // catch isAdmin
					  	oper={true} // catch isOper
					  	avatar={"Nickname Avatar"} // catch avatar
					  	look={true}/> Catch Username here
          {/* </Button> */}
        </div>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {(['right'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)}><PeopleAlt className='black' /></IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor, members)}
          </Drawer>
        </React.Fragment>
      ))} 
    </div>
  );
};

export default MemberList;