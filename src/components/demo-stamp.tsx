export function DemoStamp({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "demo-stamp demo-stamp-compact" : "demo-stamp"} role="note">
      <span>Demonstration data</span>
      {!compact && <p>Structure preview only. Values are synthetic—not current Canadian statistics.</p>}
    </div>
  );
}
