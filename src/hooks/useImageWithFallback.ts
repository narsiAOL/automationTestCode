import { useState, useEffect } from "react";
import { validateImageUrl } from "../utils/imageHelper";

interface UseImageWithFallbackOptions {
  fallbackUrl?: string;
  timeoutMs?: number;
}

const imageCache = new Map<string, string>();

export const useImageWithFallback = (
  imageUrl: string | null | undefined,
  options: UseImageWithFallbackOptions = {},
) => {
  const {
    fallbackUrl = "/mainprofile.png", // Use existing default avatar
    timeoutMs = 5000,
  } = options;

  const [validatedImageUrl, setValidatedImageUrl] =
    useState<string>(fallbackUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!imageUrl || imageUrl.trim() === "") {
        if (isMounted) {
          setValidatedImageUrl(fallbackUrl);
          setHasError(false);
          setIsLoading(false);
        }
        return;
      }

      const cacheKey = imageUrl.trim();
      if (imageCache.has(cacheKey)) {
        const cachedUrl = imageCache.get(cacheKey) as string;
        if (isMounted) {
          setValidatedImageUrl(cachedUrl);
          setHasError(cachedUrl === fallbackUrl && imageUrl !== fallbackUrl);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const validUrl = await validateImageUrl(
          imageUrl,
          fallbackUrl,
          timeoutMs,
        );
        imageCache.set(cacheKey, validUrl);

        if (isMounted) {
          setValidatedImageUrl(validUrl);
          setHasError(validUrl === fallbackUrl && imageUrl !== fallbackUrl);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          imageCache.set(cacheKey, fallbackUrl);
          setValidatedImageUrl(fallbackUrl);
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [imageUrl, fallbackUrl, timeoutMs]);

  return {
    imageUrl: validatedImageUrl,
    isLoading,
    hasError,
  };
};
