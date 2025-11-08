"use client";

import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import us from "@/public/landing/nafath.webp";
import us2 from "@/public/landing/najiz.jpg";

export function WhyChooseSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {t("landing.whyChoose.title")}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("landing.whyChoose.features.rightByYou.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("landing.whyChoose.features.rightByYou.description")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("landing.whyChoose.features.all50States.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("landing.whyChoose.features.all50States.description")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("landing.whyChoose.features.flatRate.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("landing.whyChoose.features.flatRate.description")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("landing.whyChoose.features.inCollaborationWith.title")}
                </h3>
                <div className="">
                  <div className="flex">
                    <Image
                      src={us}
                      alt="Nafath Logo"
                      className="h-20 w-20 p-2 rounded-2xl"
                    />
                    <Image
                      src={us2}
                      alt="Najiz Logo"
                      className="h-20 w-36 rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-full h-96 rounded-lg overflow-hidden">
              <Image
                src="/landing/us.jpg"
                alt="Why choose Legatoo - Professional legal services"
                fill
                className=" rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
