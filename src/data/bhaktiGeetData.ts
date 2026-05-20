// Dummy data simulating /bhakti-geet API response
export interface BhaktiGeetApiResponse {
  songs: BhaktiGeetSong[];
  totalCount: number;
}

export interface BhaktiGeetSong {
  id: number;
  songName: string;
  album: string;
  duration: string;
  dateAdded: string;
  artist?: string;
  audioUrl?: string;
  imageUrl?: string;
}

// Table data for BhaktiGeetTab
export const dummyBhaktiGeetTableData: BhaktiGeetApiResponse = {
  totalCount: 25,
  songs: [
    {
      id: 1,
      songName: "Halo Re Ame Vraj",
      album: "Shreenathji Hits",
      duration: "03:43",
      dateAdded: "Today at 22:35",
    },
    {
      id: 2,
      songName: "Mara Ghatma shrinathji",
      album: "Bhajan",
      duration: "06:49",
      dateAdded: "Mar 30, 2025 at 10:29 AM",
    },
    {
      id: 3,
      songName: "Ghani Khamma Ghani",
      album: "Janmashtami 2025",
      duration: "11:32",
      dateAdded: "Mar 31, 2024 at 12:56 PM",
    },
    {
      id: 4,
      songName: "Halo Re Ame Vraj",
      album: "Vrajvan",
      duration: "04:55",
      dateAdded: "May 15, 2024 at 04:57 PM",
    },
    {
      id: 5,
      songName: "Jai Jai Maharani Yaman",
      album: "Best of 2025",
      duration: "22:39",
      dateAdded: "Feb 05, 2024 at 09:42 AM",
    },
    {
      id: 6,
      songName: "Krishna Govind Hare",
      album: "Traditional Bhajans",
      duration: "05:21",
      dateAdded: "Jan 15, 2024 at 02:30 PM",
    },
    {
      id: 7,
      songName: "Vithal Vithal Vithala",
      album: "Maharashtra Collection",
      duration: "04:45",
      dateAdded: "Dec 20, 2023 at 11:15 AM",
    },
    {
      id: 8,
      songName: "O Shri Nathji",
      album: "Devotional Classics",
      duration: "06:12",
      dateAdded: "Nov 10, 2023 at 08:45 PM",
    },
    {
      id: 9,
      songName: "Radhe Krishna",
      album: "Vrindavan Melodies",
      duration: "07:33",
      dateAdded: "Oct 25, 2023 at 06:20 AM",
    },
    {
      id: 10,
      songName: "Govind Bolo Hari",
      album: "Morning Prayers",
      duration: "03:18",
      dateAdded: "Sep 12, 2023 at 05:30 AM",
    },
  ],
};

// Player data for BhaktiGeet page
export const dummyBhaktiGeetPlayerData: BhaktiGeetSong[] = [
  {
    id: 1,
    songName: "Halo Re Ame Vraj",
    album: "Shreenathji Hits",
    duration: "03:43",
    dateAdded: "Today at 22:35",
    artist: "Aditya Gadhvi, Rajesh Ahir",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=1",
  },
  {
    id: 2,
    songName: "Mara Ghatma shrinathji",
    album: "Bhajan",
    duration: "06:49",
    dateAdded: "Mar 30, 2025 at 10:29 AM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=2",
  },
  {
    id: 3,
    songName: "Ghani Khamma Ghani",
    album: "Janmashtami 2025",
    duration: "11:32",
    dateAdded: "Mar 31, 2024 at 12:56 PM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=3",
  },
  {
    id: 4,
    songName: "Vithal Vithal Vithala",
    album: "Maharashtra Collection",
    duration: "04:45",
    dateAdded: "May 15, 2024 at 04:57 PM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=4",
  },
  {
    id: 5,
    songName: "O Shri Nathji",
    album: "Devotional Classics",
    duration: "06:12",
    dateAdded: "Feb 05, 2024 at 09:42 AM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=5",
  },
  {
    id: 6,
    songName: "Krishna Govind Hare",
    album: "Traditional Bhajans",
    duration: "05:21",
    dateAdded: "Jan 15, 2024 at 02:30 PM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=6",
  },
  {
    id: 7,
    songName: "Radhe Krishna",
    album: "Vrindavan Melodies",
    duration: "07:33",
    dateAdded: "Dec 20, 2023 at 11:15 AM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=7",
  },
  {
    id: 8,
    songName: "Govind Bolo Hari",
    album: "Morning Prayers",
    duration: "03:18",
    dateAdded: "Nov 10, 2023 at 08:45 PM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=8",
  },
  {
    id: 9,
    songName: "Jai Jai Maharani Yaman",
    album: "Best of 2025",
    duration: "22:39",
    dateAdded: "Oct 25, 2023 at 06:20 AM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=9",
  },
  {
    id: 10,
    songName: "Hare Krishna Mantra",
    album: "Spiritual Collection",
    duration: "08:45",
    dateAdded: "Sep 12, 2023 at 05:30 AM",
    artist: "Traditional Artist",
    imageUrl: "/song.png",
    audioUrl: "/sample.mp3?v=10",
  },
];
