import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: { label: string; href: string };
}

export default function EmptyState({ icon: Icon, title, message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[#f9f1f0] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-[#9b7b7a]" />
      </div>
      <h3 className="text-[#2d1010] font-semibold text-base mb-1">{title}</h3>
      <p className="text-[#9b7b7a] text-sm max-w-xs">{message}</p>
      {action && (
        <a
          href={action.href}
          className="mt-5 inline-block px-5 py-2.5 bg-[#5B1A18] text-white text-sm font-semibold rounded-xl hover:bg-[#7a2320] transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}