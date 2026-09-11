export interface InterestItem {
  id: string;
  title: string;
  href: string;
}

export interface MarginaliaData {
  project: {
    title: string;
    url: string;
  };
  interests: InterestItem[];
}

export const marginaliaData: MarginaliaData = {
  project: {
    title: "Math Translations",
    url: "https://mathtranslations.org",
  },
  interests: [
    {
      id: "photography",
      title: "Photography",
      href: "/marginalia/photography/",
    },
    {
      id: "cinema",
      title: "Screen",
      href: "/marginalia/screen/",
    },
    {
      id: "literature",
      title: "Literature",
      href: "/marginalia/literature/",
    },
    {
      id: "music",
      title: "Music",
      href: "/marginalia/music/",
    },
    {
      id: "table-tennis",
      title: "Table Tennis",
      href: "/marginalia/table-tennis/",
    },
    {
      id: "games",
      title: "Games",
      href: "/marginalia/games/",
    },
  ],
};

