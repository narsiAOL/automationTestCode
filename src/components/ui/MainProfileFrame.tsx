import MainProfileFramerBorder from "./MainProfileFramerBorder";
import { useImageWithFallback } from "../../hooks/useImageWithFallback";
import FallbackImage from "../../assets/svgs/fallback-image.svg";

interface MainProfileFrameProps {
  src?: string;
  alt?: string;
  className?: string;
  onError?: () => void;
}

export default function MainProfileFrame({
  src = "",
  alt = "Profile Image",
  className = "w-96",
  onError,
}: MainProfileFrameProps) {
  const { imageUrl, hasError } = useImageWithFallback(src, {
    fallbackUrl: FallbackImage,
    timeoutMs: 5000,
  });

  if (hasError && onError) {
    onError();
  }

  // Only show oval border when a real photo is loaded
  const showDecorativeBorder = src !== "" && !hasError;

  return (
    <div
      data-name="Main Profile Frame"
      className={`relative ${className}`}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover rounded-[4px] border-[4px] border-[#9c6e32] bg-[var(--color-primary-200)] p-[10px] box-border"
      />

      {/* Oval frame only on real photos, hidden on fallback */}
      {showDecorativeBorder && (
        <div className="absolute inset-0 pointer-events-none">
          <MainProfileFramerBorder />
        </div>
      )}
    </div>
  );
}
