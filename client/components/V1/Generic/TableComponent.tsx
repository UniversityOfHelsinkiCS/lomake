
export default function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px"}}>{children}</div>
  )
}
