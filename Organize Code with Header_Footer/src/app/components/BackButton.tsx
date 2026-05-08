import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ to, label = "Kembali" }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-black/5 hover:border-brand-green/30 transition-all shadow-sm hover:shadow"
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="text-brand-blue/70 group-hover:text-brand-green transition-colors"
        whileHover={{ rotate: -10 }}
      >
        <ArrowLeft size={18} strokeWidth={2} />
      </motion.div>
      <span className="text-sm font-agrandir text-brand-blue/70 group-hover:text-brand-green transition-colors">
        {label}
      </span>
    </motion.button>
  );
}
