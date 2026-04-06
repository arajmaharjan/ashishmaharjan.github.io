export default function AnimatedBackground() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 animate-bg-scroll"
        style={{
          backgroundImage: 'url("/images/bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a1a2e",
        }}
      />
      <div className="fixed inset-0 z-[1] bg-[rgba(15,15,30,0.82)]" />
    </>
  );
}
