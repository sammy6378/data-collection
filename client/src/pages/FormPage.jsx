import { Link } from "react-router-dom";
import FormWrapper from "../components/FormWrapper";
import { ArrowLeft } from "lucide-react"; // optional icon

export default function FormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-800 py-16 px-4">
      <div className=" mx-auto bg-white rounded-2xl shadow-md p-8 md:p-12">

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-teal-700 hover:text-teal-900 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-teal-800 mb-2">
            Staff Data Collection Form
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Kindly fill the form in one sitting. All fields marked with{" "}
            <span className="text-red-500 font-bold">*</span> are required.
          </p>
        </div>

        {/* Form */}
        <FormWrapper />
      </div>
    </div>
  );
}
