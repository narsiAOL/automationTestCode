import { useTranslation } from "react-i18next";
import {
  ConfirmationModal,
  Divider,
  EditDrawer,
  FunctionalButton,
  MusicCard,
  SearchBar,
  SectionTitle,
  SongFrame,
} from "../components/ui";
import type { SortKey } from "../components/ui/FunctionalButton";
import { useAudio, type Track } from "../contexts/AudioContext";
import { dummyBhaktiGeetPlayerData } from "../data";
import { useBhaktiGeet } from "../hooks/useBhaktiGeet";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import Loader from "../components/ui/Loader";
import { filtersService } from "../services/filters";
import { useAuth } from "../contexts/AuthContext";
import AddBhaktiGeetButton from "../components/ui/AddBhaktiGeetButton";
import { useDrawer } from "../contexts";
import EditForm from "../components/dashboard/EditForm";
import musicService from "../services/music";
import { useToast } from "../hooks";

type SortOrder = "asc" | "desc";
type BhaktiGeetSortField = "name" | "created_date" | "";

export default function BhaktiGeet() {
  const { setTrack, setQueue } = useAudio();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.user_type === "1";
  const { openDrawer, closeDrawer, isDrawerOpen, resetForm } = useDrawer();
  const { showSuccess, showError } = useToast();
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<BhaktiGeetSortField>("");
  const sortBy: SortOrder = "asc";
  const [sortKeys, setSortKeys] = useState<SortKey[]>([]);
  const [filtersLoaded, setFiltersLoaded] = useState<boolean>(false);
  const [deleteSongId, setDeleteSongId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const debouncedSearch = useDebounce<string>(search, 500);

  // Fetch filters on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filterData = await filtersService.getFilters("bhakti_geet");
        const extractedSortKeys = filtersService
          .extractSortKeys(filterData)
          .filter((k) => k.label.toLowerCase() !== "album");
        setSortKeys(extractedSortKeys);

        // Set default sort to first available key
        if (extractedSortKeys.length > 0) {
          setSort(extractedSortKeys[0].value as BhaktiGeetSortField);
        }
        setFiltersLoaded(true);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
        setFiltersLoaded(true); // Still allow the page to function
      }
    };

    fetchFilters();
  }, []);
  // Hook integration
  const { musicLibrary, loadingState, error, fetchBhaktiGeet } = useBhaktiGeet({
    search: debouncedSearch,
    sort,
    sortBy,
    page: 1,
    limit: 20,
  });

  // Get song data from  API response
  const songsData = musicLibrary?.map((song) => ({
    id: song.id,
    title: song.name,
    artist: song.artist || t("bhaktiGeet.traditionalArtist"),
    cover: song.cover_image || "/profile.png",
    url: song.music_path || `/sample.mp3?v=${song.id}`,
  }));

  const handleSongPlay = (songId: string) => {
    console.log("Play song:", songId);

    // Find the clicked song
    const clickedSong = songsData.find((song) => song.id === songId);
    if (!clickedSong) return;

    // Convert to Track format
    const track: Track = {
      id: clickedSong.id,
      title: clickedSong.title,
      artist: clickedSong.artist,
      cover: clickedSong.cover,
      url: clickedSong.url,
    };

    // Convert all songs to Track format for the queue
    const trackQueue: Track[] = songsData.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      cover: song.cover,
      url: song.url,
    }));

    // Set the queue and play the selected track
    setQueue(trackQueue);
    setTrack(track);
  };

  const handleSortKeyChange = (sortKey: string) => {
    setSort(sortKey as BhaktiGeetSortField);
  };

  const openAddMusicForm = () => {
    // Navigate to add music page or open a modal
    // For now, just log the action
    console.log("Open Add Music Form");
    openDrawer(t("pages.bhaktiGeet.addSong"), [
      {
        name: "name",
        label: t("bhaktiGeet.tableColumns.songName"),
        type: "text",
        value: "",
      },
      {
        name: "album",
        label: t("bhaktiGeet.tableColumns.album"),
        type: "text",
        value: "",
      },
      {
        name: "song",
        label: "Upload Song",
        type: "file",
        value: "",
        accept: "audio/*",
      },
      {
        name: "cover_image",
        label: "Upload Cover Image",
        type: "file",
        value: "",
        accept: "image/*",
      },
    ]);
  };
  const handleAddMusic = async (formData: Record<string, any>) => {
    console.log("Form data submitted:", formData);
    const songField = formData.song;
    if (!songField || !songField.file) {
      console.error("Song file is required before saving.");
      return;
    }

    const songFileData = songField.file;
    const audioPayload = {
      asset_id: songFileData.asset_id ?? null,
      original_name: songFileData.original_name ?? songField.value,
      file_name: songFileData.file_name ?? songField.value,
      file_type:
        songFileData.file_type ??
        songFileData.type ??
        songFileData.mime_type ??
        "",
      url: songFileData.url ?? songFileData.full_url ?? songField.value,
      created_by: songFileData.created_by ?? null,
    };

    const apiPayload = {
      music: [
        {
          ...audioPayload,
          name: formData.name,
          album: formData.album,
          cover_image: formData.cover_image?.value || null,
        },
      ],
    };

    const response = await musicService.addMusic(apiPayload);
    if (response.success) {
      showSuccess("Bhakti Geet added successfully");
      closeDrawer();
      resetForm();
      fetchBhaktiGeet();
    } else {
      resetForm();
      showError("Failed to add Bhakti Geet");
      console.error("Failed to add music");
    }
  };
  const deleteMusicHandler = async (songId: string) => {
    console.log("Delete song:", songId);
    const response = await musicService.deleteMusic(songId);
    if (response.success) {
      showSuccess("Bhakti Geet deleted successfully");
      fetchBhaktiGeet();
    } else {
      showError("Failed to delete Bhakti Geet");
      console.error("Failed to delete music");
    }
  };

  const openDeleteConfirmation = (songId: string) => {
    setDeleteSongId(songId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteSongId(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteSongId) return;
    await deleteMusicHandler(deleteSongId);
    closeDeleteConfirmation();
  };

  const renderSongsData = () => {
    if (!filtersLoaded || loadingState === "initial") {
      return (
        <div className="min-h-96 mt-12">
          <Loader message={t("bhaktiGeet.loading")} />
        </div>
      );
    }
    if (error) {
      return (
        <p className="text-red-500">
          {t("bhaktiGeet.error")}
          {error}
        </p>
      );
    }
    if (!musicLibrary || musicLibrary.length === 0) {
      return (
        <div className="min-h-72 mt-12 flex items-center justify-center text-heading-5 text-text-main">
          <p>{t("bhaktiGeet.noSongs")}</p>
        </div>
      );
    }
    return (
      <div className="songs-grid mt-11">
        {songsData.map((song) => (
          <div key={song.id} className="w-full">
            <div className="hidden sm:block">
              <SongFrame
                src={song.cover}
                title={song.title}
                artist={song.artist}
                id={song.id}
                className="w-full"
                onPlayClick={() => handleSongPlay(song.id)}
                onDeleteClick={() => {
                  openDeleteConfirmation(song.id);
                }}
              />
            </div>
            <div className="block sm:hidden">
              <MusicCard
                songData={song}
                onPlayClick={() => handleSongPlay(song.id)}
                onDeleteClick={() => {
                  openDeleteConfirmation(song.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <SectionTitle title={t("bhaktiGeet.title")} />
      <div className="flex flex-row items-center justify-center gap-2 mt-9">
        <SearchBar
          variant="light"
          placeholder={t("bhaktiGeet.searchPlaceholder")}
          className="w-full md:w-96"
          loading={loadingState === "search"}
          value={search}
          onChange={(value) => setSearch(value)}
        />
        <span className="hidden md:inline-block">
          <Divider color="light" />
        </span>
        <FunctionalButton
          leftText={t("ui.buttonText.filter")}
          sortKeys={sortKeys}
          selectedSortKey={sort}
          onSortKeyChange={handleSortKeyChange}
        />
        {isAdmin && (
          <div className="flex justify-center items-center block ">
            {/* <span className="hidden md:inline-block">
            <Divider color="light" />
          </span> */}
            <AddBhaktiGeetButton
              className="w-[64px]!"
              onClick={openAddMusicForm}
            >
              Add
            </AddBhaktiGeetButton>
          </div>
        )}
      </div>

      {/* Songs Grid */}
      {renderSongsData()}
      <EditDrawer
        title={t("pages.bhaktiGeet.addSong")}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <EditForm
          onSave={(formData) => {
            handleAddMusic(formData);
            closeDrawer();
          }}
        />
      </EditDrawer>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={t(
          "bhaktiGeet.confirmDeleteMessage",
          "Are you sure you want to delete this song?",
        )}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
      />
    </>
  );
}
