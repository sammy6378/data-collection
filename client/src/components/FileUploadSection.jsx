import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { UploadCloud, CheckCircle, X } from "lucide-react";
import { fileValidation } from "../utils/ValidationRules";

export default function FileUploadSection() {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  
  const file = watch("cv");
  const cvFile = watch("cvFile"); // This will store the Cloudinary URL

  const {
    ref: inputRef,
    onChange: rhfOnChange,
    ...rest
  } = register("cv", fileValidation);

  // Also register the cvFile field that will store the Cloudinary URL
  register("cvFile", { required: "Please upload your CV" });

  // Configure Cloudinary
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'cv_uploads'; // Default preset name

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name', cloudName);

    try {
      setUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setUploadError('Failed to upload file. Please try again.');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const fileList = e.target.files;
    rhfOnChange(e); // trigger react-hook-form validation and state
    
    if (fileList && fileList[0]) {
      const selectedFile = fileList[0];
      setFileName(selectedFile.name);
      setUploadedUrl(null);
      setUploadError(null);

      try {
        // Upload to Cloudinary
        const url = await uploadToCloudinary(selectedFile);
        setUploadedUrl(url);
        
        // Set the Cloudinary URL in the form
        setValue('cvFile', url);
        
        console.log('File uploaded successfully:', url);
      } catch (error) {
        console.error('Upload failed:', error);
        // Clear the file input on error
        e.target.value = '';
        setFileName(null);
        setValue('cvFile', '');
      }
    }
  };

  const removeFile = () => {
    setFileName(null);
    setUploadedUrl(null);
    setValue('cv', '');
    setValue('cvFile', '');
    setUploadError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (file && file.length > 0) {
      setFileName(file[0].name);
    }
  }, [file]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-teal-800 mb-6">Part D: Upload Your CV</h2>

      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-800 mb-4">
          Upload your most recent CV <span className="text-red-500">*</span>
        </label>

        <label
          htmlFor="cv-upload"
          className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl px-6 py-12 text-center cursor-pointer transition ${
            uploading 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : uploadedUrl 
                ? 'border-green-400 bg-green-50' 
                : 'border-teal-400 hover:border-teal-500'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-700 font-semibold">Uploading...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we upload your file</p>
            </>
          ) : uploadedUrl ? (
            <>
              <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
              <p className="text-green-700 font-semibold">File uploaded successfully!</p>
              <p className="text-sm text-green-600 mt-1">Your CV has been uploaded to the cloud</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-teal-500 mb-3" />
              <p className="text-gray-700 font-semibold">Click to upload or drag & drop</p>
              <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
            </>
          )}

          <input
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            ref={inputRef}
            {...rest}
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>

        {fileName && (
          <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Selected File: <span className="font-medium">{fileName}</span>
              </p>
              {uploadedUrl && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {uploadError && (
          <p className="text-red-600 text-sm mt-2">{uploadError}</p>
        )}

        {errors.cv && (
          <p className="text-red-600 text-sm mt-2">{errors.cv.message || "Please upload your CV"}</p>
        )}

        {/* Debug info - remove in production */}
        {/* {import.meta.env.DEV && uploadedUrl && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-600">
            <strong>Cloudinary URL:</strong> {uploadedUrl}
          </div>
        )} */}
      </div>
    </div>
  );
}
