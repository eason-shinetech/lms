"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import ReactConfetti from "react-confetti";

const ConfettiProvider = () => {
  const confetti = useConfettiStore();
  if (!confetti.isOpen) return null;
  return (
    <ReactConfetti
      className="z-[100] pointer-events-none"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  );
};

export default ConfettiProvider;
