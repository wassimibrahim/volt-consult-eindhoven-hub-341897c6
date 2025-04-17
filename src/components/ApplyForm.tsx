
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { name } = e.target;
      setFormData(prev => ({ ...prev, [name]: e.target.files?.[0] || null }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };
  
  // Function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Convert files to base64
      const documentData: string[] = [];
      
      if (formData.cv) {
        const cvBase64 = await fileToBase64(formData.cv);
        documentData.push(cvBase64);
      }
      
      if (formData.motivationLetter) {
        const motivationLetterBase64 = await fileToBase64(formData.motivationLetter);
        documentData.push(motivationLetterBase64);
      }
      
      // Get existing applications from localStorage or initialize empty array
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      
      // Add the new application with an ID and timestamp
      const newApplication = {
        id: existingApplications.length > 0 ? Math.max(...existingApplications.map((app: any) => app.id)) + 1 : 1,
        fullName: `${formData.firstName} ${formData.familyName}`,
        position: positionTitle,
        type: applicationType,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        documents: ['CV', 'Motivation Letter'],
        documentData: documentData, // Store base64 encoded files
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
      
      // Save updated applications to localStorage
      localStorage.setItem('applications', JSON.stringify([...existingApplications, newApplication]));
      
      // Log for debugging
      console.log('Application submitted:', { ...newApplication, documentData: 'Base64 data (omitted for log)' });
      
      // Show success message
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
        variant: "default",
      });
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
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
            onChange={handleInputChange as any}
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
            onChange={handleInputChange as any}
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
          <p className="text-sm text-gray-500 mt-1">Maximum file size: 5MB</p>
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
          <p className="text-sm text-gray-500 mt-1">Maximum file size: 5MB</p>
        </div>
      </div>
      
      <hr className="my-6" />
      
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
      
      <button
        type="submit"
        className="w-full bg-[#F00000] text-white py-3 rounded-md hover:bg-[#F00000]/90 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={submitting || !formData.agreeToTerms}
      >
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default ApplyForm;
