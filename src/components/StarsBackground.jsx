export default function StarsBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      
      {/* BASE GRADIENT */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(ellipse_at_bottom,_#1e293b_0%,_#020617_70%)]
        "
      />

      {/* STARS LAYER */}
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />
    </div>
  );
}
