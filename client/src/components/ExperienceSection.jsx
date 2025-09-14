import { useFormContext, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { experienceValidation } from "../utils/ValidationRules";

export default function ExperienceSection() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experienceList",
  });

  // Watch experienceList for auto-summary
  const experienceList = watch("experienceList");

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

      {/* Note */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Write "N/A" if not applicable for any field.
        </p>
      </div>

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

          {/* Position Held */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              Position Held *
            </label>
            <input
              {...register(
                `experienceList.${index}.positionHeld`,
                experienceValidation.positionHeld
              )}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="E.g. Teacher, Deputy Principal"
            />
            {errors.experienceList?.[index]?.positionHeld && (
              <p className="text-red-600 text-sm mt-1">
                Position held is required.
              </p>
            )}
          </div>

          {/* Years */}
          <div className="mb-4">
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

          {/* Contributions */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Summary of Experience *
            </label>
            <textarea
              {...register(
                `experienceList.${index}.contributions`,
                experienceValidation.contributions
              )}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Describe your key contributions and achievements in this role..."
            />
            {errors.experienceList?.[index]?.contributions && (
              <p className="text-red-600 text-sm mt-1">
                Contributions are required.
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
          onClick={() =>
            append({
              organization: "",
              positionHeld: "",
              years: "",
              contributions: "",
            })
          }
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          + Click to Add Organization
        </button>
      </div>
    </div>
  );
}
