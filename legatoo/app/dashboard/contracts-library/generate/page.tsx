"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard";
import { AIContractGenerator } from "@/components/contracts";
import { useTranslation } from "@/hooks/useTranslation";

export default function GenerateContractPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSave = () => {
    router.push("/dashboard/contracts-library");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("contracts.generate.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("contracts.generate.subtitle")}
        </p>
      </div>

      <AIContractGenerator onSave={handleSave} />
      </div>
    </DashboardLayout>
  );
}
