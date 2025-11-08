import { Contract } from "@/lib/api/contracts";
import { useTranslation } from "@/hooks/useTranslation";

interface StatusBadgeProps {
  status: Contract["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  
  const styles = {
    draft: "bg-gray-100 text-gray-800 border-gray-300",
    active: "bg-green-100 text-green-800 border-green-300",
    archived: "bg-orange-100 text-orange-800 border-orange-300",
  };

  const labels = {
    draft: t("contracts.status.draft"),
    active: t("contracts.status.active"),
    archived: t("contracts.status.archived"),
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
