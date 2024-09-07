export const TitleBar = () => {
  return (
    <div
      className="flex h-[32px] items-center justify-center bg-blue-700"
      style={{
        // @ts-expect-error Electron specific prop
        appRegion: 'drag',
      }}
    >
      <h1 className="mt-1 font-[Dongle] text-2xl leading-none">PGQuick</h1>
    </div>
  )
}
