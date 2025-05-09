import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { saveApplication } from '../services/supabaseService';
import { uploadFileToS3, checkS3Configuration } from '../services/s3Service';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface ApplyFormProps {
  positionTitle: string;
  applicationType: 'volt' | 'project' | null;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ positionTitle, applicationType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    familyName: '',
    birthDate: '',
    degreeProgram: '',
    customDegreeProgram: '',
    yearOfStudy: '',
    email: '',
    phoneNumber: '',
    linkedinProfile: '',
    cv: null as File | null,
    motivationLetter: null as File | null,
    agreeToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [s3Ready, setS3Ready] = useState(false);
  const [s3Checked, setS3Checked] = useState(false);
  const [retryingS3Check, setRetryingS3Check] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Check if S3 is configured when component mounts
  useEffect(() => {
    const checkS3 = async () => {
      try {
        console.log('Checking S3 configuration...');
        setRetryingS3Check(true);
        
        const isConfigured = checkS3Configuration();
        setS3Ready(isConfigured);
        setS3Checked(true);
        setRetryingS3Check(false);
        
        if (!isConfigured) {
          toast({
            title: "S3 Storage Configuration Issue",
            description: "Amazon S3 is not properly configured. Please check your environment variables.",
            variant: "destructive",
          });
        } else {
          console.log('✅ Amazon S3 is configured and ready');
        }
      } catch (error) {
        console.error('Error checking S3 configuration:', error);
        setS3Ready(false);
        setS3Checked(true);
        setRetryingS3Check(false);
        setFileError('There was an issue connecting to Amazon S3. Please try again later or contact support.');
        
        toast({
          title: "S3 Connection Error",
          description: "Failed to connect to Amazon S3. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    checkS3();
  }, []);

  // Clear error message when component unmounts
  useEffect(() => {
    return () => {
      setFileError(null);
      setUploadProgress(0);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const { name } = e.target;
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setFileError(`${name === 'cv' ? 'CV' : 'Motivation Letter'} file size exceeds 10MB limit`);
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        setFileError(`${name === 'cv' ? 'CV' : 'Motivation Letter'} must be a PDF file`);
        e.target.value = ''; // Clear the input
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: file }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };
  
  const uploadFileToAmazonS3 = async (file: File, fileType: string): Promise<string> => {
    try {
      console.log(`Uploading ${fileType} file to Amazon S3: ${file.name}`);
      setUploadingFiles(true);
      
      // Use a custom folder path for better organization
      const safeEmail = formData.email.replace(/[^a-zA-Z0-9]/g, '_');
      const folderPath = `applications/${safeEmail}`;
      
      // Upload to S3 and get the URL
      const fileUrl = await uploadFileToS3(file, folderPath);
      console.log(`${fileType} uploaded successfully to S3:`, fileUrl);
      
      return fileUrl;
    } catch (error: any) {
      console.error(`Error uploading ${fileType} to S3:`, error);
      throw new Error(`${fileType} upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleRetryS3Check = async () => {
    setRetryingS3Check(true);
    setS3Checked(false);
    setFileError(null);
    
    try {
      console.log('Retrying S3 configuration check...');
      const isConfigured = checkS3Configuration();
      setS3Ready(isConfigured);
      setS3Checked(true);
      
      if (isConfigured) {
        toast({
          title: "Connection Restored",
          description: "Amazon S3 storage service is now available. You can proceed with your application.",
          variant: "default",
        });
      } else {
        toast({
          title: "Still Unavailable",
          description: "Amazon S3 is still not properly configured. Please check your environment variables.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error retrying S3 check:', error);
      setS3Ready(false);
      setFileError('Connection to Amazon S3 failed. Please try again later.');
    } finally {
      setRetryingS3Check(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(10);
    setFileError(null);
    setSubmissionSuccess(false);
    
    try {
      // Validate files are provided
      if (!formData.cv || !formData.motivationLetter) {
        throw new Error('Both CV and Motivation Letter files are required');
      }

      // Verify S3 is ready before proceeding
      if (!s3Ready) {
        throw new Error('Amazon S3 storage service is not available. Please try again later.');
      }

      console.log('Starting application submission process...');
      setUploadProgress(20);
      
      // Upload files to Amazon S3
      console.log('Uploading CV file...');
      let cvUrl;
      try {
        cvUrl = await uploadFileToAmazonS3(formData.cv, 'CV');
      } catch (error) {
        console.error('CV upload failed:', error);
        throw new Error(`CV upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      setUploadProgress(50);
      
      console.log('Uploading Motivation Letter file...');
      let motivationLetterUrl;
      try {
        motivationLetterUrl = await uploadFileToAmazonS3(formData.motivationLetter, 'Motivation Letter');
      } catch (error) {
        console.error('Motivation Letter upload failed:', error);
        throw new Error(`Motivation Letter upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      setUploadProgress(70);
      
      console.log('Files uploaded successfully to Amazon S3');
      
      // Create application object with explicit all required fields
      const fullName = `${formData.firstName} ${formData.familyName}`;
      
      const newApplication = {
        fullName: fullName,
        email: formData.email,
        position: positionTitle,
        type: applicationType,
        documents: ['CV', 'Motivation Letter'],
        documentData: [cvUrl, motivationLetterUrl],
        details: {
          firstName: formData.firstName,
          familyName: formData.familyName,
          birthDate: formData.birthDate,
          degreeProgram: formData.degreeProgram === 'Master' || formData.degreeProgram === 'Other' 
            ? `${formData.degreeProgram} - ${formData.customDegreeProgram}` 
            : formData.degreeProgram,
          yearOfStudy: formData.yearOfStudy,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          linkedinProfile: formData.linkedinProfile,
        }
      };
      
      setUploadProgress(80);
      
      console.log('Saving application data to database with the following object:', newApplication);
      
      try {
        // Save application using service
        const savedApplication = await saveApplication(newApplication);
        console.log('Application saved successfully with ID:', savedApplication.id);
        
        setUploadProgress(100);
        setSubmissionSuccess(true);
        
        // Show success message
        toast({
          title: "Application Submitted Successfully",
          description: "Thank you for your application! You will be redirected to the homepage.",
          variant: "default",
        });
        
        // Redirect to home page after short delay
        setTimeout(() => navigate('/'), 3000);
      } catch (error: any) {
        console.error('Error from saveApplication function:', error);
        throw error; // Rethrow to be caught by outer try-catch
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      // Display appropriate error message
      toast({
        title: "Error Submitting Application",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
      
      setFileError(error.message || "File upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const degreeOptions = [
    'Applied Mathematics',
    'Applied Physics',
    'Architecture, urbanism and building Sciences',
    'Automotive Technology',
    'Biomedische Technologie',
    'Chemical Engineering and Chemistry',
    'Computer Science and Engineering',
    'Data Science',
    'Electrical Engineering',
    'Industrial Design',
    'Industrial Engineering',
    'Mechanical Engineering',
    'Medische Wetenschappen en Technologie',
    'Psychology and Technology',
    'Sustainable Innovation',
    'Master',
    'Other'
  ];

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'];

  const showCustomDegreeField = formData.degreeProgram === 'Master' || formData.degreeProgram === 'Other';

  // Show success message if submission was successful
  if (submissionSuccess) {
    return (
      <div className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center">Application Submitted Successfully!</h2>
        <p className="text-center text-gray-600">
          Thank you for your application to {positionTitle}. We will review your application and get back to you soon.
        </p>
        <p className="text-center text-gray-500 text-sm">
          You will be redirected to the homepage in a few seconds...
        </p>
        <div className="animate-pulse mt-4">
          <Loader2 className="w-6 h-6 text-gray-400 mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  // Show S3 status message if there's an issue
  if (s3Checked && !s3Ready) {
    return (
      <div className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Amazon S3 Storage Service Unavailable</p>
            <p className="text-red-600 text-sm mt-1">
              We're currently experiencing issues with our Amazon S3 storage system. Please check your environment variables or try again later.
            </p>
            <button 
              onClick={handleRetryS3Check}
              disabled={retryingS3Check}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-2 disabled:opacity-70"
            >
              {retryingS3Check && <Loader2 className="w-4 h-4 animate-spin" />}
              {retryingS3Check ? 'Checking...' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading indicator while S3 check is in progress
  if (!s3Checked) {
    return (
      <div className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="text-gray-600">Checking Amazon S3 storage service availability...</p>
      </div>
    );
  }
  
  // Main form
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      {fileError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{fileError}</p>
        </div>
      )}
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#F00000] transition-all duration-300 ease-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1 text-center">
            {uploadingFiles ? 'Uploading files...' : 'Processing...'} {uploadProgress}%
          </p>
        </div>
      )}
      
      {/* Personal Information section */}
      <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="familyName">Family Name *</Label>
            <Input
              id="familyName"
              name="familyName"
              value={formData.familyName}
              onChange={handleInputChange}
              placeholder="Enter your family name"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="birthDate">Birth Date *</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="degreeProgram">Degree Program *</Label>
          <select
            id="degreeProgram"
            name="degreeProgram"
            value={formData.degreeProgram}
            onChange={handleInputChange}
            className="flex w-full rounded-md border border-input bg-background px-3 h-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          >
            <option value="" disabled>Select your degree program</option>
            {degreeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {showCustomDegreeField && (
          <div>
            <Label htmlFor="customDegreeProgram">
              If you selected 'Master' or 'Other', please specify (e.g., MSc + Study or Study name): *
            </Label>
            <Input
              id="customDegreeProgram"
              name="customDegreeProgram"
              value={formData.customDegreeProgram}
              onChange={handleInputChange}
              placeholder="Please specify your degree program"
              required
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="yearOfStudy">Year of Study *</Label>
          <select
            id="yearOfStudy"
            name="yearOfStudy"
            value={formData.yearOfStudy}
            onChange={handleInputChange}
            className="flex w-full rounded-md border border-input bg-background px-3 h-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          >
            <option value="" disabled>Select your year of study</option>
            {yearOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <Label htmlFor="linkedinProfile">LinkedIn Profile URL *</Label>
          <Input
            id="linkedinProfile"
            name="linkedinProfile"
            type="url"
            value={formData.linkedinProfile}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/yourprofile"
            required
          />
        </div>
      </div>
      
      <hr className="my-6" />
      
      {/* Documents section */}
      <h3 className="text-xl font-semibold mb-6">Documents</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="cv">Upload CV (PDF) *</Label>
          <Input
            id="cv"
            name="cv"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          <p className="text-sm text-gray-500 mt-1">Maximum file size: 10MB</p>
        </div>
        
        <div>
          <Label htmlFor="motivationLetter">Upload Motivation Letter (PDF) *</Label>
          <Input
            id="motivationLetter"
            name="motivationLetter"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          <p className="text-sm text-gray-500 mt-1">Maximum file size: 10MB</p>
        </div>
      </div>
      
      <hr className="my-6" />
      
      {/* Agreement section */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="agreeToTerms" 
          checked={formData.agreeToTerms}
          onCheckedChange={handleCheckboxChange}
          required
        />
        <label
          htmlFor="agreeToTerms"
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the processing of my personal data according to the GDPR regulations.
        </label>
      </div>
      
      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-[#F00000] text-white py-3 rounded-md hover:bg-[#F00000]/90 font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={submitting || !formData.agreeToTerms || !s3Ready}
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default ApplyForm;
