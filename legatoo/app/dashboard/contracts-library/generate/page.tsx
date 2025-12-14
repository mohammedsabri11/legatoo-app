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
      <div className="space-y-6 bg-white min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("contracts.generate.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("contracts.generate.subtitle")}
          </p>
        </div>

        <AIContractGenerator onSave={handleSave} />
      </div>
    </DashboardLayout>
  );
}
