"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { templatesApi, TemplateVariable, TemplateVariablesResponse } from "@/lib/api/templates";
import { authUtils } from "@/lib/auth-utils";
import { ArrowLeft, FileText, Loader2, Download, CheckCircle2, Eye, X } from "lucide-react";
import toast from "react-hot-toast";

export default function UseTemplatePage() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const isRTL = locale === 'ar';
  const templateId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewContract, setPreviewContract] = useState<{
    contractId: string;
    pdfUrl: string;
  } | null>(null);
  const [template, setTemplate] = useState<TemplateVariablesResponse | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedContract, setGeneratedContract] = useState<{
    contractId: string;
    pdfUrl: string;
  } | null>(null);

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const data = await templatesApi.getTemplateVariables(templateId);
      setTemplate(data);
      
      // Initialize form data with defaults
      const initialData: Record<string, unknown> = {};
      data.variables.forEach((var_def) => {
        if (var_def.default) {
          initialData[var_def.name] = var_def.default;
        }
      });
      setFormData(initialData);
    } catch (error: unknown) {
      console.error("Error loading template:", error);
      const errorMessage = error instanceof Error ? error.message : t('templateUse.errors.loadFailed');
      toast.error(errorMessage);
      router.push("/dashboard/templates");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!template) return false;
    
    const newErrors: Record<string, string> = {};
    template.variables.forEach((var_def) => {
      if (var_def.required) {
        const value = formData[var_def.name];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[var_def.name] = `${var_def.label} ${t('templateUse.form.fieldRequired')}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = async () => {
    if (!template) return;

    try {
      setPreviewing(true);
      // Use preview endpoint that generates template with placeholder values
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
        (typeof window !== 'undefined' && window.location.hostname.includes('fastestfranchise.net')
          ? "https://api.fastestfranchise.net/api/v1"
          : "http://localhost:8000/api/v1");
      
      await authUtils.ensureValidToken();
      const token = authUtils.getAccessToken();
      
      const response = await fetch(`${baseUrl}/templates/${templateId}/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate preview');
      }

      // Get the PDF as blob and create object URL
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      
      setPreviewContract({
        contractId: 'preview',
        pdfUrl: pdfUrl,
      });
      
      toast.success(t('templateUse.preview.success') || 'Preview generated successfully');
    } catch (error: unknown) {
      console.error("Error generating preview:", error);
      const errorMessage = error instanceof Error ? error.message : t('templateUse.errors.generateFailed');
      toast.error(errorMessage);
    } finally {
      setPreviewing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('templateUse.errors.requiredFields'));
      return;
    }

    try {
      setGenerating(true);
      const result = await templatesApi.generateContract(templateId, formData);
      
      setGeneratedContract({
        contractId: result.contract_id,
        pdfUrl: result.pdf_url,
      });
      
      // Clear preview when generating final contract
      setPreviewContract(null);
      
      toast.success(t('templateUse.success.title'));
    } catch (error: unknown) {
      console.error("Error generating contract:", error);
      const errorMessage = error instanceof Error ? error.message : t('templateUse.errors.generateFailed');
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  // Translation mapping for common field labels and placeholders
  const translateFieldLabel = (label: string): string => {
    // Create a mapping from English labels to translation keys
    const labelMap: Record<string, string> = {
      'Employer Name': 'templateUse.fields.labels.employerName',
      'Employee Name': 'templateUse.fields.labels.employeeName',
      'Party A Name': 'templateUse.fields.labels.partyAName',
      'Party B Name': 'templateUse.fields.labels.partyBName',
      'Disclosing Party': 'templateUse.fields.labels.partyAName', // Map to Party A
      'Receiving Party': 'templateUse.fields.labels.partyBName', // Map to Party B
      'Service Provider': 'templateUse.fields.labels.serviceProvider',
      'Client Name': 'templateUse.fields.labels.clientName',
      'Seller Name': 'templateUse.fields.labels.sellerName',
      'Buyer Name': 'templateUse.fields.labels.buyerName',
      'Start Date': 'templateUse.fields.labels.startDate',
      'Effective Date': 'templateUse.fields.labels.effectiveDate',
      'Service Start Date': 'templateUse.fields.labels.serviceStartDate',
      'Service End Date': 'templateUse.fields.labels.serviceEndDate',
      'Purchase Date': 'templateUse.fields.labels.purchaseDate',
      'Delivery Date': 'templateUse.fields.labels.deliveryDate',
      'Salary Amount': 'templateUse.fields.labels.salary',
      'Contract Amount': 'templateUse.fields.labels.amount',
      'Purchase Amount': 'templateUse.fields.labels.purchaseAmount',
      'Service Amount (SAR)': 'templateUse.fields.labels.serviceAmount',
      'Job Position': 'templateUse.fields.labels.position',
      'Duration (Months)': 'templateUse.fields.labels.durationMonths',
      'Post-Term Duration (Months)': 'templateUse.fields.labels.postDurationMonths',
      'Purpose': 'templateUse.fields.labels.purpose',
      'Description of Confidential Information': 'templateUse.fields.labels.confidentialInfo',
      'Service Description': 'templateUse.fields.labels.serviceDescription',
      'Uptime Percentage (%)': 'templateUse.fields.labels.uptimePercentage',
      'Response Time (Minutes)': 'templateUse.fields.labels.responseTime',
      'Resolution Time (Hours)': 'templateUse.fields.labels.resolutionTime',
      'Item Description': 'templateUse.fields.labels.itemDescription',
      'Notice Period (Days)': 'templateUse.fields.labels.noticePeriod',
      'Payment Terms (Days)': 'templateUse.fields.labels.paymentTerms',
      'Delivery Location': 'templateUse.fields.labels.deliveryLocation',
      'Warranty Period (Days)': 'templateUse.fields.labels.warrantyPeriod',
    };

    const translationKey = labelMap[label];
    if (translationKey) {
      try {
        const translated = t(translationKey as never);
        return translated !== translationKey ? translated : label;
      } catch {
        return label;
      }
    }
    return label;
  };

  const translatePlaceholder = (placeholder: string | undefined): string | undefined => {
    if (!placeholder) return placeholder;

    const placeholderMap: Record<string, string> = {
      'Enter company name': 'templateUse.fields.placeholders.enterCompanyName',
      'Enter employee name': 'templateUse.fields.placeholders.enterEmployeeName',
      'Enter party A name': 'templateUse.fields.placeholders.enterPartyA',
      'Enter party B name': 'templateUse.fields.placeholders.enterPartyB',
      'Enter disclosing party name': 'templateUse.fields.placeholders.enterPartyA', // Map to Party A
      'Enter receiving party name': 'templateUse.fields.placeholders.enterPartyB', // Map to Party B
      'Enter service provider name': 'templateUse.fields.placeholders.enterServiceProvider',
      'Enter client name': 'templateUse.fields.placeholders.enterClientName',
      'Enter seller name': 'templateUse.fields.placeholders.enterSellerName',
      'Enter buyer name': 'templateUse.fields.placeholders.enterBuyerName',
      'Enter salary amount': 'templateUse.fields.placeholders.enterSalaryAmount',
      'Enter contract amount': 'templateUse.fields.placeholders.enterAmount',
      'Enter purchase amount': 'templateUse.fields.placeholders.enterPurchaseAmount',
      'Enter service amount in SAR': 'templateUse.fields.placeholders.enterServiceAmount',
      'Enter job title': 'templateUse.fields.placeholders.enterJobTitle',
      'Enter duration in months': 'templateUse.fields.placeholders.enterDurationMonths',
      'Enter post-agreement confidentiality duration': 'templateUse.fields.placeholders.enterPostDuration',
      'Enter the purpose of disclosure': 'templateUse.fields.placeholders.enterPurpose',
      'Describe the confidential information': 'templateUse.fields.placeholders.describeConfidentialInfo',
      'Describe the services to be provided': 'templateUse.fields.placeholders.describeServices',
      'Describe the service': 'templateUse.fields.placeholders.describeService',
      'e.g., 99.9': 'templateUse.fields.placeholders.enterUptime',
      'Describe the items being purchased': 'templateUse.fields.placeholders.describeItems',
      'Enter notice period in days': 'templateUse.fields.placeholders.enterNoticePeriod',
      'Enter payment terms in days': 'templateUse.fields.placeholders.enterPaymentTerms',
      'Enter delivery location': 'templateUse.fields.placeholders.enterDeliveryLocation',
      'Enter warranty period in days': 'templateUse.fields.placeholders.enterWarrantyPeriod',
      'Enter response time in minutes': 'templateUse.fields.placeholders.enterResponseTime',
      'Enter resolution time in hours': 'templateUse.fields.placeholders.enterResolutionTime',
    };

    const translationKey = placeholderMap[placeholder];
    if (translationKey) {
      try {
        const translated = t(translationKey as never);
        return translated !== translationKey ? translated : placeholder;
      } catch {
        return placeholder;
      }
    }
    return placeholder;
  };

  const renderField = (var_def: TemplateVariable) => {
    const rawValue = formData[var_def.name];
    const value = rawValue != null ? String(rawValue) : '';
    const error = errors[var_def.name];
    const fieldId = `field-${var_def.name}`;
    const translatedPlaceholder = translatePlaceholder(var_def.placeholder);

    const baseInputClasses = `block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
      error ? 'border-red-500' : 'border-gray-300'
    } ${isRTL ? 'text-right' : 'text-left'}`;

    switch (var_def.type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={value}
            onChange={(e) => handleInputChange(var_def.name, e.target.value)}
            placeholder={translatedPlaceholder}
            required={var_def.required}
            rows={4}
            className={baseInputClasses}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            id={fieldId}
            value={value}
            onChange={(e) => handleInputChange(var_def.name, e.target.value)}
            required={var_def.required}
            className={baseInputClasses}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            id={fieldId}
            value={value}
            onChange={(e) => handleInputChange(var_def.name, e.target.value)}
            placeholder={translatedPlaceholder}
            required={var_def.required}
            className={baseInputClasses}
            dir="ltr"
          />
        );
      
      default: // text
        return (
          <input
            type="text"
            id={fieldId}
            value={value}
            onChange={(e) => handleInputChange(var_def.name, e.target.value)}
            placeholder={translatedPlaceholder}
            required={var_def.required}
            className={baseInputClasses}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!template) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">{t('templateUse.errors.notFound')}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/templates")}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('templateUse.back')}
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('templateUse.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{template.title}</p>
          </div>
        </div>

        {generatedContract ? (
          /* Success State */
          <div className="bg-white shadow rounded-lg p-6 animate-fade-in">
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t('templateUse.success.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('templateUse.success.message')}
              </p>
              
              {/* PDF Preview */}
              <div className="mb-6 border rounded-lg overflow-hidden">
                <iframe
                  src={generatedContract.pdfUrl}
                  className="w-full h-[600px] border-0"
                  title="Contract Preview"
                />
              </div>
              
              {/* Download Button */}
              <div className="flex gap-4 justify-center">
                <a
                  href={generatedContract.pdfUrl}
                  download
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90"
                >
                  <Download className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('templateUse.success.downloadPdf')}
                </a>
                <button
                  onClick={() => {
                    setGeneratedContract(null);
                    setFormData({});
                  }}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('templateUse.success.createNew')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Form */
          <div className="space-y-6">
            {/* Preview Section */}
            {previewContract && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('templateUse.preview.title') || 'Template Preview'}
                  </h3>
                  <button
                    onClick={() => {
                      if (previewContract?.pdfUrl && previewContract.pdfUrl.startsWith('blob:')) {
                        URL.revokeObjectURL(previewContract.pdfUrl);
                      }
                      setPreviewContract(null);
                    }}
                    className="inline-flex items-center px-2 py-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={previewContract.pdfUrl}
                    className="w-full h-[500px] border-0"
                    title="Template Preview"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setPreviewContract(null);
                    // Clean up object URL to prevent memory leak
                    if (previewContract?.pdfUrl && previewContract.pdfUrl.startsWith('blob:')) {
                      URL.revokeObjectURL(previewContract.pdfUrl);
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('templateUse.preview.close') || 'Close Preview'}
                </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
              {template.description && (
                <div className="mb-6 p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-gray-700">{template.description}</p>
                </div>
              )}

              <div className="space-y-6">
              {template.variables.map((var_def) => {
                const translatedLabel = translateFieldLabel(var_def.label);
                return (
                <div key={var_def.name}>
                  <label
                    htmlFor={`field-${var_def.name}`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {translatedLabel}
                    {var_def.required && (
                      <span className={`text-red-500 ${isRTL ? 'mr-1' : 'ml-1'}`}>*</span>
                    )}
                  </label>
                  {renderField(var_def)}
                  {errors[var_def.name] && (
                    <p className="mt-1 text-sm text-red-600">{errors[var_def.name]}</p>
                  )}
                </div>
                );
              })}
            </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/templates")}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('templateUse.form.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={previewing}
                  className="inline-flex items-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {previewing ? (
                    <>
                      <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('templateUse.form.generatingPreview')}
                    </>
                  ) : (
                    <>
                      <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('templateUse.form.previewTemplate')}
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={generating || previewing}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('templateUse.form.generating')}
                    </>
                  ) : (
                    <>
                      <FileText className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('templateUse.form.generatePdf')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
}

