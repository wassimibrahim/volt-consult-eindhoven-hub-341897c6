import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import ApplyForm from '../components/ApplyForm';

type PositionType = {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
  preferredMajors?: string[];
};

const voltPositions: PositionType[] = [
  {
    id: 'consultant',
    title: 'Technology Consultant',
    description: 'As a Technology Consultant at Volt, you will collaborate with clients to develop strategic technology solutions, conduct research, and implement innovative approaches to complex technical challenges.',
    requirements: ['Strong analytical skills', 'Technical background or interest', 'Excellent communication', 'Problem-solving aptitude']
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Data Analysts at Volt process and interpret complex data sets, create visualizations, extract insights, and develop data-driven recommendations for our clients.',
    requirements: ['Experience with data analysis tools', 'Statistical knowledge', 'Programming skills (Python/R preferable)', 'Attention to detail']
  },
  {
    id: 'developer',
    title: 'Software Developer',
    description: 'Software Developers design, build, and maintain efficient, reusable, and reliable code for our client projects, implementing cutting-edge solutions for real-world problems.',
    requirements: ['Proficiency in programming languages', 'Knowledge of software development principles', 'Problem-solving skills', 'Teamwork']
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    description: 'Project Managers oversee the planning, execution, and closure of client projects, ensuring deliverables meet requirements within time and budget constraints.',
    requirements: ['Organizational skills', 'Leadership abilities', 'Communication skills', 'Experience in project coordination']
  }
];

const projectPositions = [
  {
    company: 'Company X',
    description: 'A leading technology firm specializing in AI-driven solutions for the healthcare industry.',
    project: 'Development of an AI algorithm to predict patient readmission risks based on electronic health records.',
    positions: [
      {
        id: 'data-scientist',
        title: 'Data Scientist',
        description: 'Work with healthcare data to develop predictive models for patient readmission.',
        preferredMajors: ['Computer Science', 'Data Science', 'Applied Mathematics', 'Healthcare Informatics'],
        requirements: []
      },
      {
        id: 'ml-engineer',
        title: 'Machine Learning Engineer',
        description: 'Implement and optimize machine learning algorithms for the healthcare prediction system.',
        preferredMajors: ['Computer Science', 'AI', 'Software Engineering'],
        requirements: []
      },
      {
        id: 'ui-designer',
        title: 'UI/UX Designer',
        description: 'Design intuitive interfaces for healthcare professionals to interact with the prediction system.',
        preferredMajors: ['Interaction Design', 'Human-Computer Interaction', 'Psychology', 'Design'],
        requirements: []
      }
    ]
  }
];

const ApplyPage = () => {
  const [selectedType, setSelectedType] = useState<'volt' | 'project' | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<PositionType | null>(null);

  const handleTypeSelect = (type: 'volt' | 'project') => {
    setSelectedType(type);
    setSelectedPosition(null);
  };

  const handlePositionSelect = (position: PositionType) => {
    setSelectedPosition(position);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="heading-lg text-volt-dark mb-4">
              Join <span className="text-[#F00000]">Volt Consulting Group</span>
            </h1>
            <p className="text-xl text-volt-text/80 max-w-3xl mx-auto">
              Select the application type that best matches your interests and career goals
            </p>
          </div>

          {!selectedType ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div 
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleTypeSelect('volt')}
              >
                <h2 className="heading-md text-volt-dark mb-4">Volt Consulting Group Applications</h2>
                <p className="text-volt-text/80 mb-4">
                  Apply to join our core team and work on a variety of projects across different industries.
                </p>
                <div className="text-[#F00000] font-medium flex items-center gap-2">
                  Explore Positions <ChevronRight size={18} />
                </div>
              </div>

              <div 
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleTypeSelect('project')}
              >
                <h2 className="heading-md text-volt-dark mb-4">Project Specific Applications</h2>
                <p className="text-volt-text/80 mb-4">
                  Apply to work on specific projects with our partner companies and organizations.
                </p>
                <div className="text-[#F00000] font-medium flex items-center gap-2">
                  View Projects <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ) : selectedType === 'volt' && !selectedPosition ? (
            <div className="max-w-4xl mx-auto">
              <button 
                className="mb-8 text-[#F00000] font-medium flex items-center gap-2"
                onClick={() => setSelectedType(null)}
              >
                <ChevronLeft size={18} /> Back to Application Types
              </button>

              <h2 className="heading-md text-volt-dark mb-6">Volt Consulting Group Positions</h2>
              <p className="text-volt-text/80 mb-8">
                Explore our available positions and find the one that matches your skills and interests.
              </p>

              <div className="space-y-4">
                {voltPositions.map((position) => (
                  <Collapsible key={position.id} className="border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => handlePositionSelect(position)}>
                      <h3 className="font-semibold text-lg">{position.title}</h3>
                      <CollapsibleTrigger className="hover:bg-gray-100 p-2 rounded-full">
                        <ChevronDown size={20} />
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-volt-text/80 mb-4">{position.description}</p>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Requirements:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {position.requirements?.map((req, idx) => (
                            <li key={idx} className="text-volt-text/80">{req}</li>
                          ))}
                        </ul>
                      </div>
                      <button 
                        className="bg-[#F00000] text-white px-6 py-2 rounded-md hover:bg-[#F00000]/90"
                        onClick={() => handlePositionSelect(position)}
                      >
                        Apply for this Position
                      </button>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          ) : selectedType === 'project' && !selectedPosition ? (
            <div className="max-w-4xl mx-auto">
              <button 
                className="mb-8 text-[#F00000] font-medium flex items-center gap-2"
                onClick={() => setSelectedType(null)}
              >
                <ChevronLeft size={18} /> Back to Application Types
              </button>

              <h2 className="heading-md text-volt-dark mb-6">Project Specific Positions</h2>
              <p className="text-volt-text/80 mb-8">
                Explore specific projects from our partner companies and organizations.
              </p>

              {projectPositions.map((project, idx) => (
                <div key={idx} className="mb-10 border border-gray-200 rounded-xl p-6">
                  <h3 className="heading-sm mb-2">{project.company}</h3>
                  <p className="text-volt-text/80 mb-4">{project.description}</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2">Project:</h4>
                    <p className="text-volt-text/80">{project.project}</p>
                  </div>
                  <h4 className="font-semibold mb-4">Available Positions:</h4>
                  <div className="space-y-4">
                    {project.positions.map((position) => (
                      <Collapsible key={position.id} className="border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => handlePositionSelect(position)}>
                          <h3 className="font-semibold text-lg">{position.title}</h3>
                          <CollapsibleTrigger className="hover:bg-gray-100 p-2 rounded-full">
                            <ChevronDown size={20} />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="px-4 pb-4">
                          <p className="text-volt-text/80 mb-4">{position.description}</p>
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Preferred Majors:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {position.preferredMajors?.map((major, idx) => (
                                <li key={idx} className="text-volt-text/80">{major}</li>
                              ))}
                            </ul>
                          </div>
                          <button 
                            className="bg-[#F00000] text-white px-6 py-2 rounded-md hover:bg-[#F00000]/90"
                            onClick={() => handlePositionSelect(position)}
                          >
                            Apply for this Position
                          </button>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedPosition ? (
            <div className="max-w-3xl mx-auto">
              <button 
                className="mb-8 text-[#F00000] font-medium flex items-center gap-2"
                onClick={() => setSelectedPosition(null)}
              >
                <ChevronLeft size={18} /> Back to Positions
              </button>
              
              <h2 className="heading-md text-volt-dark mb-2">Apply for: {selectedPosition.title}</h2>
              <p className="text-volt-text/80 mb-8">{selectedPosition.description}</p>
              
              <ApplyForm positionTitle={selectedPosition.title} applicationType={selectedType} />
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplyPage;
