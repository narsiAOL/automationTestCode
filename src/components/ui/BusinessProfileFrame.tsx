import { useImageWithFallback } from "../../hooks/useImageWithFallback";
import FallbackImage from "../../assets/svgs/org-fallback.svg";

interface BusinessProfileFrameProps {
  src?: string;
  alt?: string;
  className?: string;
  onError?: () => void;
}

export default function BusinessProfileFrame({
  src = "",
  alt = "Business Profile",
  className = "",
  onError,
}: BusinessProfileFrameProps) {
  const { imageUrl, isLoading, hasError } = useImageWithFallback(src, {
    fallbackUrl: FallbackImage,
    timeoutMs: 5000,
  });

  if (hasError && onError) {
    onError();
  }

return (
  <div
    className={`relative ${className}`}
    data-name="Business Profile Frame"
    style={{
      width: "100%",
      maxWidth: "264px",
      aspectRatio: "264 / 300",
      borderRadius: "12px",
      border: "2px solid var(--color-primary-300, #C4A882)",
      overflow: "hidden",
      backgroundColor: "var(--color-primary-100, #F5ECD9)",
    }}
  >
    <img
      src={imageUrl}
      alt={alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  </div>
);
}