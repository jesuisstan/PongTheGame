import * as React from 'react';
import { MemberType } from '../../../types/chat';
import { Box, Drawer, IconButton, List } from '@mui/material';
import { PeopleAlt } from '@mui/icons-material';
import UserMenu from './UserMenu';
import { User } from '../../../types/User';

type Anchor = 'right';

interface MemberListProps {
  bannedUsers: User[];
  members: MemberType[];
}

const MemberList = (props: MemberListProps) => {
  const [state, setState] = React.useState({
    right: false
  });

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
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {Object.keys(props.members).map((id, index) => (
          <div key={index}>
            <UserMenu
              member={props.members[id as any]}
              bannedUsers={props.bannedUsers}
              members={props.members}
            />
          </div>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {(['right'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)}>
            <PeopleAlt className="black" />
          </IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor, props.members)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default MemberList;
