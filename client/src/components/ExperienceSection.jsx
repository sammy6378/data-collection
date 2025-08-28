import { useFormContext, useFieldArray } from "react-hook-form";
import { experienceValidation } from "../utils/ValidationRules";

export default function ExperienceSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experienceList",
  });

  const experienceRanges = [
    "1–2 years",
    "3–4 years",
    "5–6 years",
    "7–8 years",
    "9–10 years",
    "11–12 years",
    "Above 13 years",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-teal-800 mb-6">
        Part C: Professional Experience
      </h2>

      {/* Dynamic Org List */}
      {fields.map((field, index) => (
        <div key={field.id} className="mb-6 border p-4 rounded-lg bg-gray-50">
          {/* Organization */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              Name of Organization *
            </label>
            <input
              {...register(
                `experienceList.${index}.organization`,
                experienceValidation.organization
              )}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="E.g. AKESK, XYZ School"
            />
            {errors.experienceList?.[index]?.organization && (
              <p className="text-red-600 text-sm mt-1">
                Organization name is required.
              </p>
            )}
          </div>

          {/* Years */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Duration Taken (e.g. 2020-2024) *
            </label>
            <input
              {...register(
                `experienceList.${index}.years`,
                experienceValidation.years
              )}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="E.g. 2020-2024"
            />
            {errors.experienceList?.[index]?.years && (
              <p className="text-red-600 text-sm mt-1">
                Please enter duration taken.
              </p>
            )}
          </div>

          {/* Remove Button */}
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 text-sm mt-2"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      {/* Add Another Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => append({ organization: "", years: "" })}
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          + Click to Add Organization
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Summary of your professional experience (Chronologically) *
        </label>
        <textarea
          {...register(
            "experienceSummary",
            experienceValidation.experienceSummary
          )}
          rows={6}
          placeholder="E.g. 2012–2015: Teacher, St. Mary's School; 2016–2021: Deputy Principal, ABC School"
          className="w-full border border-gray-300 rounded-lg p-3"
        />
        {errors.experienceSummary && (
          <p className="text-red-600 text-sm mt-1">This summary is required.</p>
        )}
      </div>
    </div>
  );
}
