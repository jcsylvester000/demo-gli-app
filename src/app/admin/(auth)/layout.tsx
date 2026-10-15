import { GliMark } from "@/components/brand/logo";
import { CmykBar } from "@/components/brand/print-marks";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm overflow-hidden rounded-lg border border-gli-line bg-white shadow-[0_24px_50px_-30px_rgb(0_48_107/0.55)]">
        <div className="on-dark flex items-center gap-3 bg-gli-navy px-6 py-4 text-white">
          <GliMark className="h-9 w-auto text-white" title="" />
          <span className="font-heading text-lg font-semibold">GLI Admin</span>
        </div>
        <CmykBar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
