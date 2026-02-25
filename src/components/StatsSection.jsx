import { CountingFromNumberDemo } from "../components/CountingFromNumberDemo";

const StatsSection = () => {
  return (
    <section className="py-24 px-[8vw] text-white">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

        {/* Card 1 */}
        <div className="bg-[#0f172a] rounded-2xl p-10 
                        shadow-[0_0_40px_rgba(239,68,68,0.15)]
                        border border-white/10
                        hover:scale-105 transition duration-300">

          <CountingFromNumberDemo
            number={5000}
            fromNumber={0}
            padStart={false}
            decimalSeparator="."
            decimalPlaces={0}
            delay={0}
          />

          <p className="mt-4 text-gray-400 text-lg">
            Medicines Delivered
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0f172a] rounded-2xl p-10 
                        shadow-[0_0_40px_rgba(239,68,68,0.15)]
                        border border-white/10
                        hover:scale-105 transition duration-300">

          <CountingFromNumberDemo
            number={120}
            fromNumber={0}
            padStart={false}
            decimalSeparator="."
            decimalPlaces={0}
            delay={200}
          />

          <p className="mt-4 text-gray-400 text-lg">
            Verified Pharmacies
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0f172a] rounded-2xl p-10 
                        shadow-[0_0_40px_rgba(239,68,68,0.15)]
                        border border-white/10
                        hover:scale-105 transition duration-300">

          <CountingFromNumberDemo
            number={24}
            fromNumber={0}
            padStart={false}
            decimalSeparator="."
            decimalPlaces={0}
            delay={400}
          />

          <p className="mt-4 text-gray-400 text-lg">
            24/7 Support
          </p>
        </div>

      </div>

    </section>
  );
};

export default StatsSection;