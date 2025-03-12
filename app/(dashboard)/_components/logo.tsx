import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.svg"
      priority={true}
      width={130}
      height={130}
      alt="Logo"
    />
  );
}
