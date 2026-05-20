import { useEffect, useState } from "react";
import { PlusIcon, MinusIcon } from "../icons";
import { useTranslation } from "react-i18next";
import IconButton from "../IconButton";

interface ChartOptionsProps {
  ancestorsCount?: number;
  descendantsCount?: number;
  onAncestorsChange?: (value: number) => void;
  onDescendantsChange?: (value: number) => void;
  className?: string;
}

export default function ChartOptions({
  ancestorsCount = 0,
  descendantsCount = 1,
  onAncestorsChange,
  onDescendantsChange,
  className = "",
}: ChartOptionsProps) {
  const { t } = useTranslation();

  const [ancestors, setAncestors] = useState(ancestorsCount);
  const [descendants, setDescendants] = useState(descendantsCount);

  useEffect(() => {
    setAncestors(ancestorsCount);
  }, [ancestorsCount]);

  useEffect(() => {
    setDescendants(descendantsCount);
  }, [descendantsCount]);

  const handleAncestorsChange = (increment: boolean) => {
    const newValue = increment
      ? Math.min(ancestors + 1, 99)
      : Math.max(ancestors - 1, 0);
    setAncestors(newValue);
    onAncestorsChange?.(newValue);
  };

  const handleDescendantsChange = (increment: boolean) => {
    const newValue = increment
      ? Math.min(descendants + 1, 99)
      : Math.max(descendants - 1, 1);
    setDescendants(newValue);
    onDescendantsChange?.(newValue);
  };

  const CounterControl = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (increment: boolean) => void;
  }) => (
    <div className="flex flex-col gap-1 sm:gap-2 items-center">
      <p className="text-detail-item text-text-labels flex-shrink-0 text-xs sm:text-base">
        {label}
      </p>
      <div
        className="
          flex items-center justify-between
          w-[90px] sm:w-[133px]
          h-[34px] sm:h-[52px]
          px-1
          rounded-lg
          bg-[#EDE7DA]
        "
      >
        <IconButton
          onClick={() => onChange(false)}
          className="min-w-[24px] min-h-[24px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
        >
          <MinusIcon className="w-4 sm:w-6" color="#3D362A" />
        </IconButton>

        <div className="min-w-[24px] sm:min-w-[44px] px-1 sm:px-2 py-0.5 sm:py-1 flex items-center justify-center rounded-md bg-[#FBF7F3] border border-[#DAD1BC]">
          <p
            className="
              font-geist
              font-medium
              text-[13px] sm:text-[20px]
              leading-[18px] sm:leading-[24px]
              tracking-[0.01em]
              text-[#3D362A]
            "
          >
            {value}
          </p>
        </div>

        <IconButton
          onClick={() => onChange(true)}
          className="min-w-[24px] min-h-[24px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
        >
          <PlusIcon className="w-4 sm:w-6" color="#3D362A" />
        </IconButton>
      </div>
    </div>
  );

  return (
    <div
      className={`
        flex flex-row gap-3 sm:gap-6 md:gap-9
        items-center justify-center
        flex-wrap
        ${className}
      `}
    >
      <CounterControl
        label={t("chart.ancestors")}
        value={ancestors}
        onChange={handleAncestorsChange}
      />
      <CounterControl
        label={t("chart.descendants")}
        value={descendants}
        onChange={handleDescendantsChange}
      />
    </div>
  );
}
