export type Post = { id: string; title: string; body: string; ownerId: string };

export type HNStory = {
  id: number;
  title: string;
  url: string;
};

export type RootState = {
  url: string;
  timestamp: number;
  resources: {
    posts: { [id: string]: Post | null };
  };
  page: {
    counter: {
      value: number;
    };
    hn: {
      loaded: boolean;
      stories: HNStory[];
    };
  };
};
