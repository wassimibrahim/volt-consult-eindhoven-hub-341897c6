import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import ApplyForm from '../components/ApplyForm';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import OrgHierarchyExplorer from '../components/OrgHierarchyExplorer';
import { getPositions, PositionType } from '../services/supabaseService';

// Fallback positions if none are found in MongoDB or localStorage
const fallbackVoltPositions: PositionType[] = [
  {
    id: '1',
    title: 'Technology Consultant',
    description: 'As a Technology Consultant at Volt, you will collaborate with clients to develop strategic technology solutions, conduct research, and implement innovative approaches to complex technical challenges.',
    requirements: ['Strong analytical skills', 'Technical background or interest', 'Excellent communication', 'Problem-solving aptitude'],
    type: 'volt',
    active: true
  },
  {
    id: '2',
    title: 'Data Analyst',
    description: 'Data Analysts at Volt process and interpret complex data sets, create visualizations, extract insights, and develop data-driven recommendations for our clients.',
    requirements: ['Experience with data analysis tools', 'Statistical knowledge', 'Programming skills (Python/R preferable)', 'Attention to detail'],
    type: 'volt',
    active: true
  }
];

const ApplyPage = () => {
  const [selectedType, setSelectedType] = useState<'volt' | 'project' | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<PositionType | null>(null);
  const [positions, setPositions] = useState<PositionType[]>([]);
  const [countdowns, setCountdowns] = useState<Record<string, { text: string, isNearDeadline: boolean } | null>>({});
  const [loading, setLoading] = useState(true);
  
  // Load positions from Supabase
  useEffect(() => {
    const loadPositions = async () => {
      setLoading(true);
      try {
        const fetchedPositions = await getPositions();
        setPositions(fetchedPositions || []);
        console.log('Loaded positions:', fetchedPositions);
      } catch (error) {
        console.error('Error loading positions:', error);
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadPositions();
  }, []);

  // Update countdowns every minute
  useEffect(() => {
    // Calculate initial countdowns
    updateCountdowns();
    
    // Set interval to update countdowns
    const intervalId = setInterval(() => {
      updateCountdowns();
    }, 60000); // Update every minute
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [positions]);

  const updateCountdowns = () => {
    const newCountdowns: Record<string, { text: string, isNearDeadline: boolean } | null> = {};
    
    positions.forEach(position => {
      if (position.deadline && position.publishedDate) {
        newCountdowns[position.id] = getCountdown(position.deadline);
      } else {
        newCountdowns[position.id] = null;
      }
    });
    
    setCountdowns(newCountdowns);
  };

  // Function to calculate and format the remaining time until deadline
  const getCountdown = (deadline?: string) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    if (deadlineDate <= now) {
      return { text: "Application period has ended", isNearDeadline: true };
    }
    
    const daysRemaining = differenceInDays(deadlineDate, now);
    const hoursRemaining = differenceInHours(deadlineDate, now) % 24;
    const minutesRemaining = differenceInMinutes(deadlineDate, now) % 60;
    
    const isNearDeadline = daysRemaining < 2; // Less than 2 days is near deadline
    
    if (daysRemaining > 0) {
      return {
        text: `${daysRemaining}d ${hoursRemaining}h remaining`,
        isNearDeadline
      };
    } else if (hoursRemaining > 0) {
      return {
        text: `${hoursRemaining}h ${minutesRemaining}m remaining`,
        isNearDeadline
      };
    } else {
      return {
        text: `${minutesRemaining}m remaining`,
        isNearDeadline
      };
    }
  };

  const handleTypeSelect = (type: 'volt' | 'project') => {
    setSelectedType(type);
    setSelectedPosition(null);
  };

  const handlePositionSelect = (position: PositionType) => {
    setSelectedPosition(position);
  };

  // Filter positions by type and active status
  const voltPositions = positions.filter(pos => pos.type === 'volt' && pos.active);
  
  // Group project positions by company
  const projectPositions = positions
    .filter(pos => pos.type === 'project' && pos.active)
    .reduce((acc, position) => {
      const companyName = position.companyName || 'Unknown Company';
      const existingCompany = acc.find(company => company.company === companyName);
      
      if (existingCompany) {
        existingCompany.positions.push(position);
      } else {
        acc.push({
          company: companyName,
          description: position.projectDescription || '',
          project: position.projectDescription || '',
          positions: [position]
        });
      }
      
      return acc;
    }, [] as Array<{
      company: string;
      description: string;
      project: string;
      positions: PositionType[];
    }>);

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

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F00000]"></div>
            </div>
          ) : !selectedType ? (
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

              <OrgHierarchyExplorer />

              <div className="space-y-4">
                {voltPositions.length > 0 ? (
                  voltPositions.map((position) => (
                    <Collapsible key={position.id} className="border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => handlePositionSelect(position)}>
                        <div>
                          <h3 className="font-semibold text-lg">{position.title}</h3>
                          {countdowns[position.id] && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock size={14} className={countdowns[position.id]?.isNearDeadline ? 'text-red-600' : 'text-gray-500'} />
                              <span className={`text-xs ${countdowns[position.id]?.isNearDeadline ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                {countdowns[position.id]?.text}
                              </span>
                            </div>
                          )}
                        </div>
                        <CollapsibleTrigger className="hover:bg-gray-100 p-2 rounded-full">
                          <ChevronDown size={20} />
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="px-4 pb-4">
                        <p className="text-volt-text/80 mb-4">{position.description}</p>
                        {position.requirements && position.requirements.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Requirements:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {position.requirements.map((req, idx) => (
                                <li key={idx} className="text-volt-text/80">{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <button 
                          className="bg-[#F00000] text-white px-6 py-2 rounded-md hover:bg-[#F00000]/90"
                          onClick={() => handlePositionSelect(position)}
                        >
                          Apply for this Position
                        </button>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No positions are currently available.</p>
                    <p className="text-sm text-gray-400 mt-1">Please check back later or contact us for more information.</p>
                  </div>
                )}
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

              {projectPositions.length > 0 ? (
                projectPositions.map((project, idx) => (
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
                            <div>
                              <h3 className="font-semibold text-lg">{position.title}</h3>
                              {countdowns[position.id] && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock size={14} className={countdowns[position.id]?.isNearDeadline ? 'text-red-600' : 'text-gray-500'} />
                                  <span className={`text-xs ${countdowns[position.id]?.isNearDeadline ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                    {countdowns[position.id]?.text}
                                  </span>
                                </div>
                              )}
                            </div>
                            <CollapsibleTrigger className="hover:bg-gray-100 p-2 rounded-full">
                              <ChevronDown size={20} />
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="px-4 pb-4">
                            <p className="text-volt-text/80 mb-4">{position.description}</p>
                            {position.preferredMajors && position.preferredMajors.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Preferred Majors:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {position.preferredMajors.map((major, idx) => (
                                    <li key={idx} className="text-volt-text/80">{major}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
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
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No project positions are currently available.</p>
                  <p className="text-sm text-gray-400 mt-1">Please check back later or contact us for more information.</p>
                </div>
              )}
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
              <p className="text-volt-text/80 mb-2">{selectedPosition.description}</p>
              
              {countdowns[selectedPosition.id] && (
                <div className={`mb-6 p-3 rounded-md ${countdowns[selectedPosition.id]?.isNearDeadline ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className={countdowns[selectedPosition.id]?.isNearDeadline ? 'text-red-600' : 'text-gray-600'} />
                    <span className={`font-medium ${countdowns[selectedPosition.id]?.isNearDeadline ? 'text-red-600' : 'text-gray-800'}`}>
                      Application deadline: {countdowns[selectedPosition.id]?.text}
                    </span>
                  </div>
                </div>
              )}
              
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
