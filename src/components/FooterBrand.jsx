export default function FooterBrand() {
  return (
    <div className="relative w-full overflow-hidden select-none">

      {/* ─── DIVIDER LINE ───*/}
      <div className="w-full flex justify-center mb-10">
       <div className="h-px w-[85%] bg-gradient-to-r 
                        from-transparent via-white/20 to-transparent" />
       </div> 

      {/* BIG BACKGROUND TEXT x*/}
      <h1
        className="
          text-center
          font-extrabold
          tracking-widest
          text-[14vw]
          leading-none
          text-white
          opacity-[0.05]
          blur-[1px]
          pointer-events-none
        "
      >
      MEDICARE
      </h1>

    </div>
  );
}
