import Datas from "@/components/Datas";
import Image from "next/image";
import image from "../../public/logo.png";
import emo1 from "../../public/emoji1.jpg";
import emo2 from "../../public/emoji2.jpg";
import emo3 from "../../public/emoji3.jpg";

export default function Home() {
  const data = [
    {
      name: "Tenzin Delek",
      profile: emo1,
    },
    {
      name: "Suryangsu Chandra",
      profile: emo2,
    },
    {
      name: "Ankitha Suresh",
      profile: emo3,
    },
  ];
  return (
    <main className="flex  flex-col  p-24">
      <p className=" text-xs mb-2 flex gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
        Creating form for restaurant
      </p>
      <h3 className=" text-5xl">HeadStarter Hackathon</h3>
      <p className="flex items-center gap-2">
        LunchBox{" "}
        <Image
          src={image}
          placeholder="blur"
          alt="logo"
          width={30}
          height={30}
        />
      </p>
      <div className="flex space-x-4 mt-4">
        {data.map((data, index) => (
          <p className="flex text-xs items-center gap-2 " key={index}>
            <Image
              src={data.profile}
              className=" rounded-full"
              placeholder="blur"
              alt="logo"
              width={30}
              height={30}
            />
            {data.name}{" "}
          </p>
        ))}
      </div>

      {/* <Datas/>v */}
    </main>
  );
}
