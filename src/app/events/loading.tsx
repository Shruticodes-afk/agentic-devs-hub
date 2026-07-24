export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-[#0A0A0A]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
    </div>
  );
}
