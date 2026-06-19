interface Props {
  title: string;
  description: string;
}

export default function AccountPageHeader({ title, description }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#2d1010] tracking-tight">{title}</h1>
      <p className="text-[#9b7b7a] text-sm mt-0.5">{description}</p>
    </div>
  );
}