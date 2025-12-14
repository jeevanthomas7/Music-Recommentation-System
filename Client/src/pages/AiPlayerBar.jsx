export default function PlayerBar({ song }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow px-6 py-3 flex items-center gap-4">
      <img src={song.coverUrl} className="w-12 h-12 rounded" />
      <div className="flex-1">
        <p className="font-medium">{song.title}</p>
        <p className="text-xs text-gray-500">{song.artist}</p>
      </div>
      <audio controls autoPlay src={song.audioUrl} />
    </div>
  );
}
