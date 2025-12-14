export default function MoodPlaylist({ songs, onPlay }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="font-semibold mb-3">Mood Playlist 🎧</h2>

      {songs.length === 0 && (
        <p className="text-sm text-gray-500">
          Enable camera to detect mood.
        </p>
      )}

      <div className="space-y-3">
        {songs.map(song => (
          <div
            key={song._id}
            onClick={() => onPlay(song)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <img src={song.coverUrl} className="w-12 h-12 rounded" />
            <div className="flex-1">
              <p className="font-medium">{song.title}</p>
              <p className="text-xs text-gray-500">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
