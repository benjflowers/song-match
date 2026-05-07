export type MatchupSong = {
  id: string;
  videoId: string;
  title: string;
  artist: string;
};

export type ActiveMatchup = {
  id: string;
  songA: MatchupSong;
  songB: MatchupSong;
};
