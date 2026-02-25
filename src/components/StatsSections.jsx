import CountingNumber from "./CountingNumber";

const StatsSection = () => {
  return (
    <section className="py-24 px-[8vw] text-white">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Card 1 */}
        <div className="bg-[#0f172a] p-10 rounded-2xl 
                        border border-white/10
                        shadow-[0_0_40px_rgba(16,185,129,0.15)]
                        hover:scale-105 transition duration-300 text-center">

          <CountingNumber number={15000} />
          <p className="mt-4 text-gray-400 text-lg">
            Trusted Patients
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0f172a] p-10 rounded-2xl 
                        border border-white/10
                        shadow-[0_0_40px_rgba(16,185,129,0.15)]
                        hover:scale-105 transition duration-300 text-center">

          <CountingNumber number={350} />
          <p className="mt-4 text-gray-400 text-lg">
            Verified Medical Shops
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0f172a] p-10 rounded-2xl 
                        border border-white/10
                        shadow-[0_0_40px_rgba(16,185,129,0.15)]
                        hover:scale-105 transition duration-300 text-center">

          <CountingNumber number={98} />
          <p className="mt-4 text-gray-400 text-lg">
            Successful Deliveries Rate
          </p>
        </div>

      </div>

    </section>
  );
};

export default StatsSection;