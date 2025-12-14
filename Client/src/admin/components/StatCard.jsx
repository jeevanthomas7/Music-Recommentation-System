import { useNavigate } from "react-router-dom";

export default function StatCard({
  title,
  value,
  subtitle,
  to,
  gradient = "from-emerald-400 to-emerald-600"
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => to && navigate(to)}
      className={`w-full text-left rounded-2xl p-6
        bg-gradient-to-br ${gradient}
        text-white shadow-sm hover:shadow-md
        hover:scale-[1.02] transition`}
    >
      <div className="text-sm opacity-90">{title}</div>

      <div className="mt-2 text-3xl font-bold">
        {value}
      </div>

      {subtitle && (
        <div className="mt-1 text-xs opacity-90">
          {subtitle}
        </div>
      )}
    </button>
  );
}
