export default function Badge({ text }: { text: string }) {
  return (
    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
      {text}
    </span>
  );
}