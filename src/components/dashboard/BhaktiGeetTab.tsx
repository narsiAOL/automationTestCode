import { Button, ConfirmationModal, EditDrawer, HorizontalDivider, MusicCard, Table } from "../ui";
import AddBhaktiGeetButton from "../ui/AddBhaktiGeetButton";
import type { ColumnDef, TableRowData } from "../ui";
import { dummyBhaktiGeetTableData } from "../../data";
import { useBhaktiGeet, type BhaktiGeetItem } from "../../hooks/useBhaktiGeet";
import { useAudio, type Track } from "../../contexts/AudioContext";
import Loader from "../ui/Loader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, useDrawer } from "../../contexts";
import EditForm from "./EditForm";
import musicService from "../../services/music";
import DeleteIcon from "../ui/DeleteIcon";
import { useToast } from "../../hooks";
import { isAdmin } from "../../utils/userUtils";

// Define the data structure for Bhakti Geet entries
interface BhaktiGeetData extends TableRowData {
  id: number;
  songName: string;
  album: string;
  duration: string;
  dateAdded: string;
}

export default function BhaktiGeetTab() {
  const { t } = useTranslation();
  const { setTrack, setQueue } = useAudio();
  const { user } = useAuth();
  const [deleteSongId, setDeleteSongId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isAdminUser = isAdmin(user);
  // Get data from dummy API response
  const bhaktiGeetResponse = dummyBhaktiGeetTableData;
  const bhaktiGeetData: BhaktiGeetData[] = bhaktiGeetResponse.songs;
  const { musicLibrary, loadingState, error, fetchBhaktiGeet } = useBhaktiGeet({
    page: 1,
    limit: 10,
  });
  const { openDrawer, isDrawerOpen, closeDrawer, getFormData, resetForm } =
    useDrawer();
  const { showSuccess, showError } = useToast();

  // Define table columns based on Figma design using TanStack Table format
  const columns: ColumnDef<BhaktiGeetItem>[] = [
    {
      id: "songName",
      header: t("bhaktiGeet.tableColumns.songName"),
      accessorKey: "name",
      size: 300,
      cell: ({ row }) => (
        <div className="flex items-center gap-4 min-w-0 w-full">
          <img
            src={row.original.cover_image || "/song.png"}
            alt={row.original.name}
            className="w-12 h-12 rounded-md object-cover shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/song.png";
            }}
          />
          <div className="flex flex-col gap-1 min-w-0">
            <div className="text-song-title truncate">{row.original.name}</div>
          </div>
        </div>
      ),
    },
    {
      id: "album",
      header: t("bhaktiGeet.tableColumns.album"),
      accessorKey: "album",
      size: 280,
      cell: ({ row }) => (
        <div className="text-song-album truncate">
          {row.original.album || t("bhaktiGeet.traditionalArtist")}
        </div>
      ),
    },
    {
      id: "dateAdded",
      header: t("bhaktiGeet.tableColumns.dateAdded"),
      accessorKey: "created_at",
      size: 280,
      cell: ({ row }) => (
        <div className="text-song-meta truncate">{row.original.created_at}</div>
      ),
    },
    // Only add delete column if admin
    ...(isAdminUser
      ? [
          {
            id: "delete",
            header: "",
            accessorKey: "delete",
            size: 60,
            cell: ({ row }: any) => (
              <div
                className="flex !justify-center !items-center text-gray-500 hover:text-red-700 "
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteConfirmation(row.original.id);
                }}
              >
                <DeleteIcon />
              </div>
            ),
          },
        ]
      : []),
  ];
  // Handle row click to play the selected song
  const handleRowClick = (record: BhaktiGeetItem) => {
    console.log("Bhakti Geet selected:", record);

    // Convert the selected song to Track format
    const track: Track = {
      id: record.id,
      title: record.name,
      artist: record.artist || t("bhaktiGeet.traditionalArtist"),
      cover: record.cover_image || "/song.png",
      url: record.music_path || `/sample.mp3?v=${record.id}`,
    };

    // Convert all songs in the library to Track format for the queue
    const trackQueue: Track[] =
      musicLibrary?.map((song) => ({
        id: song.id,
        title: song.name,
        artist: song.artist || t("bhaktiGeet.traditionalArtist"),
        cover: song.cover_image || "/song.png",
        url: song.music_path || `/sample.mp3?v=${song.id}`,
      })) || [];

    // Set the queue and play the selected track
    setQueue(trackQueue);
    setTrack(track);
  };
  const formData = getFormData();

  const openAddMusicForm = () => {
    // Navigate to add music page or open a modal
    // For now, just log the action
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
      closeDrawer();
      resetForm();
      fetchBhaktiGeet();
    } else {
      resetForm();
      console.error("Failed to add music");
    }
  };
  const deleteMusicHandler = async (songId: string) => {
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

  const renderSongsTable = () => {
    if (loadingState === "initial") {
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
      return <p>{t("bhaktiGeet.noSongs")}</p>;
    }
    return (
      <>
        {/* Desktop Table View */}
        <div className="hidden lg:block xl:mt-11 max-w-[90%] xl:max-w-7xl mx-auto">
          <Table
            data={musicLibrary}
            columns={columns}
            onRowClick={handleRowClick}
            showRowNumbers={true}
            className="w-full"
          />
        </div>

        {/* Mobile Card View */}
        {/* Mobile Card View */}
        <div className="lg:hidden mt-6 w-full px-4">
          <div className="relative w-full max-w-lg mx-auto">
            <div className="relative">
              {/* Header */}

              {/* Cards Container */}
              <div
                className="flex w-full flex-col gap-4"
                // style={{ backgroundColor: "#FBF7F3" }}
              >
                {musicLibrary.map((song) => (
                  <MusicCard
                    key={song.id}
                    songData={song}
                    onPlayClick={() => handleRowClick(song)}
                    onDeleteClick={
                      isAdminUser
                        ? () => openDeleteConfirmation(song.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="tab-content-wrapper xl:max-w-7xl mx-auto">
      <div className="flex justify-center lg:justify-between items-center w-full gap-6">
        <h1 className="text-heading-4 text-primary-600">
          {t("bhaktiGeet.AllBhaktiGeet")}
        </h1>
        {isAdminUser && (
          <AddBhaktiGeetButton
            className="w-44 md:w-52 h-12"
            onClick={openAddMusicForm}
          >
            {t("ui.buttonText.addBhaktiGeet")}
          </AddBhaktiGeetButton>
        )}
      </div>

      <HorizontalDivider className="hidden md:block" />
      {renderSongsTable()}
      <EditDrawer
        title={t("pages.bhaktiGeet.addSong")}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <EditForm onSave={handleAddMusic} />
      </EditDrawer>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={t("bhaktiGeet.confirmDeleteMessage", "Are you sure you want to delete this song?")}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
