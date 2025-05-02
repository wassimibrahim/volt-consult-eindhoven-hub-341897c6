
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { saveApplication } from '../services/supabaseService';
import { supabase, checkApplicationsBucket, createApplicationsBucketIfNotExists } from '@/integrations/supabase/client';
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
  const [bucketReady, setBucketReady] = useState(false);
  const [bucketChecked, setBucketChecked] = useState(false);
  const [retryingBucketCheck, setRetryingBucketCheck] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Check if the applications bucket exists when component mounts
  useEffect(() => {
    const initializeBucket = async () => {
      try {
        setRetryingBucketCheck(true);
        
        // First try to create the bucket if it doesn't exist
        const created = await createApplicationsBucketIfNotExists();
        if (created) {
          console.log('Bucket created or already exists and is accessible');
          setBucketReady(true);
          setBucketChecked(true);
          setRetryingBucketCheck(false);
          return;
        }
        
        // If creation failed or we don't have permissions, check if it's at least accessible
        const isReady = await checkApplicationsBucket();
        console.log('Bucket ready status:', isReady);
        setBucketReady(isReady);
        setBucketChecked(true);
        setRetryingBucketCheck(false);
        
        if (!isReady) {
          toast({
            title: "Storage Service Issue",
            description: "There was a problem connecting to our file storage. Please try again in a moment.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking bucket:', error);
        setBucketReady(false);
        setBucketChecked(true);
        setRetryingBucketCheck(false);
        setFileError('There was an issue connecting to the storage service. Please try again later.');
        
        toast({
          title: "Connection Error",
          description: "Failed to connect to storage service. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    initializeBucket();
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
  
  const uploadFileToSupabase = async (file: File, filePath: string): Promise<string> => {
    try {
      console.log(`Uploading file: ${file.name} to path: ${filePath}`);
      setUploadingFiles(true);
      
      // Double check that the bucket exists and is ready before uploading
      const bucketStatus = await checkApplicationsBucket();
      if (!bucketStatus) {
        throw new Error('Storage is not available at this time. Please try again later.');
      }
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('applications')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Error during upload:', error);
        throw new Error(`File upload failed: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Upload successful but no data returned');
      }
      
      console.log('Upload successful, getting public URL for:', filePath);
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('applications')
        .getPublicUrl(filePath);
      
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }
      
      console.log('Public URL obtained:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error in uploadFileToSupabase:', error);
      throw error;
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleRetryBucketCheck = async () => {
    setRetryingBucketCheck(true);
    setBucketChecked(false);
    setFileError(null);
    
    try {
      // First try to create the bucket if it doesn't exist
      const created = await createApplicationsBucketIfNotExists();
      if (created) {
        console.log('Bucket created or already exists and is accessible');
        setBucketReady(true);
        setBucketChecked(true);
        setRetryingBucketCheck(false);
        
        toast({
          title: "Connection Restored",
          description: "Storage service is now available. You can proceed with your application.",
          variant: "default",
        });
        
        return;
      }
      
      // If creation failed, check if it's at least accessible
      const isReady = await checkApplicationsBucket();
      console.log('Retry bucket check result:', isReady);
      setBucketReady(isReady);
      setBucketChecked(true);
      
      if (isReady) {
        toast({
          title: "Connection Restored",
          description: "Storage service is now available. You can proceed with your application.",
          variant: "default",
        });
      } else {
        toast({
          title: "Still Unavailable",
          description: "Storage service is still unavailable. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error retrying bucket check:', error);
      setBucketReady(false);
      setFileError('Connection to storage service failed. Please try again later.');
    } finally {
      setRetryingBucketCheck(false);
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

      // Check if bucket is ready before proceeding
      if (!bucketReady) {
        // Try to ensure bucket one more time
        const created = await createApplicationsBucketIfNotExists();
        if (!created) {
          const bucketStatus = await checkApplicationsBucket();
          if (!bucketStatus) {
            throw new Error('Storage service is currently unavailable. Please try again later.');
          }
        } else {
          setBucketReady(true);
        }
      }

      console.log('Starting application process...');
      setUploadProgress(20);
      
      // Upload files to Supabase Storage
      const timestamp = Date.now();
      const safeEmail = formData.email.replace(/[^a-zA-Z0-9]/g, '_');
      
      // Upload CV
      console.log('Uploading CV file...');
      const cvFilePath = `${safeEmail}/${timestamp}_CV_${formData.cv.name.replace(/[^a-zA-Z0-9._]/g, '_')}`;
      const cvUrl = await uploadFileToSupabase(formData.cv, cvFilePath);
      setUploadProgress(50);
      
      // Upload Motivation Letter
      console.log('Uploading Motivation Letter file...');
      const motivationLetterFilePath = `${safeEmail}/${timestamp}_MotivationLetter_${formData.motivationLetter.name.replace(/[^a-zA-Z0-9._]/g, '_')}`;
      const motivationLetterUrl = await uploadFileToSupabase(formData.motivationLetter, motivationLetterFilePath);
      setUploadProgress(70);
      
      console.log('Files uploaded successfully:');
      console.log('CV URL:', cvUrl);
      console.log('Motivation Letter URL:', motivationLetterUrl);
      
      // Create application object
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
      
      console.log('Saving application data:', newApplication);
      // Save application using service
      const savedApplication = await saveApplication(newApplication);
      console.log('Application saved successfully:', savedApplication);
      
      setUploadProgress(100);
      setSubmissionSuccess(true);
      
      // Show success message
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully! You will be redirected to the homepage.",
        variant: "default",
      });
      
      // Redirect to home page after short delay
      setTimeout(() => navigate('/'), 3000);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      // Display appropriate error message
      toast({
        title: "Error",
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

  // Show bucket status message if there's an issue
  if (bucketChecked && !bucketReady) {
    return (
      <div className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Storage Service Unavailable</p>
            <p className="text-red-600 text-sm mt-1">
              We're currently experiencing issues with our file storage system. Please try again later.
            </p>
            <button 
              onClick={handleRetryBucketCheck}
              disabled={retryingBucketCheck}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-2 disabled:opacity-70"
            >
              {retryingBucketCheck && <Loader2 className="w-4 h-4 animate-spin" />}
              {retryingBucketCheck ? 'Checking...' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading indicator while bucket check is in progress
  if (!bucketChecked) {
    return (
      <div className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="text-gray-600">Checking storage service availability...</p>
      </div>
    );
  }

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
        disabled={submitting || !formData.agreeToTerms || !bucketReady}
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default ApplyForm;
