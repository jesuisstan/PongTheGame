export type Invitation = {
  from: {
    nickname: string | undefined;
    avatar: string | undefined;
  };
  gameInfo: {
    obstacle: boolean | undefined;
    winScore: number | undefined;
  };
};
