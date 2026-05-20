import { Card } from "../../ui";

interface AdsCardProps {
  className?: string;
}

export default function AdsCard({ className }: AdsCardProps) {
  return (
    <Card
      variant="dark"
      className={`w-full h-full flex items-center justify-center ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-center w-full h-full">
        <h2 className="text-heading-6 text-primary-300">ADS</h2>
      </div>
    </Card>
  );
}
