import { useFormContext } from "react-hook-form";

export default function FormInput({ label, name, type = "text", rules = {} }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name];
  const showRequired = !!rules.required;

  return (
    <div>
      <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
        {label} {showRequired && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        type={type}
        {...register(name, rules)}
        className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      {fieldError && (
        <p className="text-red-600 text-sm mt-1">{fieldError.message}</p>
      )}
    </div>
  );
}
