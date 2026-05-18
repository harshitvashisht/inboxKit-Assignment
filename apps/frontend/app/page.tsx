import Block from "@/component/block";
import Image from "next/image";

export default function Home() {
  return <div>
    <Block blocks={[]} currentUserId={""} onClaim={function (x: number, y: number): void {
      throw new Error("Function not implemented.");
    } } />
  </div>
}
