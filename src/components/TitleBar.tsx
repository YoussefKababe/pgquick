export const TitleBar = () => {
  return (
    <div
      className="h-[40px]"
      style={{
        // @ts-expect-error Electron specific prop
        appRegion: 'drag',
      }}
    ></div>
  )
}
