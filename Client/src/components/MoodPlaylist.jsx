export default function MoodPlaylist({ songs }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {songs.map(song => (
        <div
          key={song._id}
          className="flex gap-3 items-center bg-gray-900 p-3 rounded-lg"
        >
          <img
            src={song.coverUrl}
            className="w-14 h-14 rounded"
          />
          <div className="flex-1">
            <p className="font-semibold">{song.title}</p>
            <p className="text-sm opacity-70">{song.artist}</p>
            <audio controls src={song.audioUrl} className="w-full mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
