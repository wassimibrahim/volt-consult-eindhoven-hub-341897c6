
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ApplyFormProps {
  positionTitle: string;
  applicationType: 'volt' | 'project' | null;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ positionTitle, applicationType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    degreeProgram: '',
    yearOfStudy: '',
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Here you would typically send the data to your backend
    // For now, we'll simulate a successful submission
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, just log the data
      console.log('Application submitted:', {
        ...formData,
        positionTitle,
        applicationType
      });
      
      // Show success message
      alert('Your application has been submitted successfully!');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const degreeOptions = [
    'Bachelor - Computer Science',
    'Bachelor - Data Science',
    'Bachelor - Electrical Engineering',
    'Bachelor - Industrial Design',
    'Bachelor - Business Information Systems',
    'Master - Computer Science',
    'Master - Artificial Intelligence',
    'Master - Data Science Engineering',
    'Master - Information Security',
    'Master - Human-Computer Interaction',
    'PhD - Computer Science',
    'PhD - Data Science',
    'PhD - Electrical Engineering',
    'Other'
  ];

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
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
          <Label htmlFor="degreeProgram">Degree Programme *</Label>
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
