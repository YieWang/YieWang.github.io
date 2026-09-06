export interface PreviewThumbnail {
  title: string;
  tag?: string;
  label: string;
  aspectRatio: '3/2' | '2/3' | '1/1.4' | '1/1';
  bgColor: string;
  imageUrl?: string;
}

export interface InterestItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  href?: string;
  hasLink: boolean;
  previews?: PreviewThumbnail[];
}

export interface MarginaliaData {
  project: {
    title: string;
    subtitle: string;
    url: string;
  };
  interests: InterestItem[];
}

export const marginaliaData: MarginaliaData = {
  project: {
    title: "Math Translations",
    subtitle: "",
    url: "https://mathtranslations.org",
  },
  interests: [
    {
      id: "photography",
      title: "Photography",
      description: "Selected photographs, arranged by year and place.",
      meta: "2020–2026 · Photographic Archive",
      href: "/marginalia/photography",
      hasLink: true,
      previews: [
        {
          title: "Hangzhou",
          tag: "West Lake · 35mm",
          label: "PHOTO",
          aspectRatio: "3/2",
          bgColor: "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)",
        },
        {
          title: "Regensburg",
          tag: "Stone Bridge · B&W",
          label: "PHOTO",
          aspectRatio: "3/2",
          bgColor: "linear-gradient(135deg, #ECECEC 0%, #DFDFDF 100%)",
        },
        {
          title: "Cathedral",
          tag: "Gothic Geometry",
          label: "PHOTO",
          aspectRatio: "3/2",
          bgColor: "linear-gradient(135deg, #F0F0F0 0%, #E3E3E3 100%)",
        },
      ],
    },
    {
      id: "cinema",
      title: "Cinema",
      description: "Films and television, with occasional reviews.",
      meta: "2026 · ...",
      href: "/marginalia/cinema",
      hasLink: true,
      previews: [
        {
          title: "Tokyo Story",
          tag: "Ozu · 1953",
          label: "FILM",
          aspectRatio: "2/3",
          bgColor: "linear-gradient(145deg, #2D2D2D 0%, #1A1A1A 100%)",
        },
        {
          title: "Stalker",
          tag: "Tarkovsky · 1979",
          label: "FILM",
          aspectRatio: "2/3",
          bgColor: "linear-gradient(145deg, #3A3D38 0%, #222521 100%)",
        },
        {
          title: "Blue",
          tag: "Kieslowski · 1993",
          label: "FILM",
          aspectRatio: "2/3",
          bgColor: "linear-gradient(145deg, #2B3542 0%, #171E26 100%)",
        },
      ],
    },
    {
      id: "literature",
      title: "Literature",
      description: "Reading, notes, and occasional essays.",
      meta: "2026 · ...",
      href: "/marginalia/literature",
      hasLink: true,
      previews: [
        {
          title: "GEB",
          tag: "Hofstadter",
          label: "BOOK",
          aspectRatio: "1/1.4",
          bgColor: "linear-gradient(135deg, #FBF8F3 0%, #EDE6D8 100%)",
        },
        {
          title: "Invisible Cities",
          tag: "Calvino",
          label: "BOOK",
          aspectRatio: "1/1.4",
          bgColor: "linear-gradient(135deg, #F7F5F0 0%, #E6E1D5 100%)",
        },
        {
          title: "Arakelov Geom.",
          tag: "Moriwaki",
          label: "BOOK",
          aspectRatio: "1/1.4",
          bgColor: "linear-gradient(135deg, #F0F4F8 0%, #DCE5EE 100%)",
        },
      ],
    },
    {
      id: "music",
      title: "Music",
      description: "Records, concerts, and acoustic impressions.",
      meta: "2026 · ...",
      href: "/marginalia/music",
      hasLink: true,
      previews: [
        {
          title: "Goldberg",
          tag: "Bach · Gould",
          label: "VINYL",
          aspectRatio: "1/1",
          bgColor: "linear-gradient(135deg, #2A2A2A 0%, #111111 100%)",
          imageUrl: "/images/music/goldberg-1981.jpg",
        },
        {
          title: "Tabula Rasa",
          tag: "Arvo Pärt · ECM",
          label: "ALBUM",
          aspectRatio: "1/1",
          bgColor: "linear-gradient(135deg, #EBEBEB 0%, #D4D4D4 100%)",
          imageUrl: "/images/music/tabula-rasa.jpg",
        },
        {
          title: "Async",
          tag: "Ryuichi Sakamoto",
          label: "VINYL",
          aspectRatio: "1/1",
          bgColor: "linear-gradient(135deg, #222222 0%, #111111 100%)",
          imageUrl: "/images/music/async.jpg",
        },
      ],
    },
    {
      id: "table-tennis",
      title: "Table Tennis",
      description: "Training, techniques, and match records.",
      meta: "2026 · ...",
      href: "/marginalia/table-tennis",
      hasLink: true,
      previews: [
        {
          title: "Topspin Loop",
          tag: "Arc & Acceleration",
          label: "TRAINING",
          aspectRatio: "3/2",
          bgColor: "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)",
        },
      ],
    },
    {
      id: "games",
      title: "Games",
      description: "Interactive worlds, mechanics, and design notes.",
      meta: "2026 · ...",
      href: "/marginalia/games",
      hasLink: true,
      previews: [
        {
          title: "Mechanics",
          tag: "Retro & Interactive",
          label: "GAME",
          aspectRatio: "3/2",
          bgColor: "linear-gradient(135deg, #2A2A2A 0%, #111111 100%)",
        },
      ],
    },
  ],
};

