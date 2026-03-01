
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface RoleData {
  title: string;
  area: string;
  description: string;
  responsibilities: string[];
}

const roleData: Record<string, RoleData> = {
  partners: {
    title: "Partners",
    area: "Strategic Oversight & Long-Term Vision",
    description: "Partners provide the strategic leadership that guides Volt Consulting Group's direction and growth. Acting as senior stewards of the organization, they define long-term priorities, ensure the quality and integrity of Volt's consulting work, and build relationships with key stakeholders across industry and academia.\n\nWhile not involved in day-to-day execution, Partners play a critical role in shaping the organization's trajectory. They advise the leadership team, support major partnership development, and ensure that Volt's activities remain aligned with its mission of delivering high-impact, technology-driven consulting.\n\nPartners also serve as ambassadors for Volt, strengthening the organization's reputation within the Brainport ecosystem and beyond.",
    responsibilities: [
      "Define Volt's long-term strategic direction and areas of focus",
      "Support development of strategic partnerships and client relationships",
      "Provide mentorship to the Principal and leadership team",
      "Oversee overall quality and impact of consulting engagements",
      "Represent Volt in high-level external engagements and initiatives",
      "Ensure organizational continuity and long-term sustainability"
    ]
  },
  principal: {
    title: "Principal",
    area: "Managing Director of Operations",
    description: "The Principal serves as the operational leader of Volt Consulting Group, responsible for translating strategy into execution and ensuring the organization runs effectively day to day.\n\nWorking closely with the Partners, the Principal coordinates all departments and oversees the organization's project portfolio, recruitment activities, and strategic initiatives. This role sits at the center of Volt's leadership structure and ensures alignment across consulting delivery, talent development, marketing, partnerships, and governance.\n\nThe Principal is expected to lead with clarity, decisiveness, and accountability while fostering a collaborative environment across teams.",
    responsibilities: [
      "Oversee Volt's day-to-day operations and organizational performance",
      "Coordinate the work of the leadership team and departmental directors",
      "Ensure consulting projects are properly staffed and executed",
      "Lead internal planning and leadership meetings",
      "Resolve operational challenges and align resources across teams",
      "Act as a key representative of Volt in operational discussions with partners and stakeholders"
    ]
  },
  marketing: {
    title: "Marketing & Events Director",
    area: "Brand, Visibility & Community Engagement",
    description: "The Marketing & Events Director is responsible for shaping Volt's public presence and strengthening its connection with both students and industry.\n\nThis role oversees brand positioning, communications, and events that highlight Volt's work and attract new members, partners, and clients. The Director ensures that Volt communicates clearly, professionally, and consistently across all channels.\n\nIn addition to managing marketing initiatives, this role leads the planning and execution of events that strengthen Volt's community and visibility within the university and the wider technology ecosystem.",
    responsibilities: [
      "Lead Volt's marketing strategy and brand positioning",
      "Manage social media, website content, and communications",
      "Promote consulting projects and organizational milestones",
      "Plan and execute recruitment events, workshops, and networking events",
      "Collaborate with other directors to align marketing with organizational goals",
      "Strengthen Volt's presence within the TU/e and Brainport ecosystem"
    ]
  },
  people: {
    title: "People Director",
    area: "Talent & Organizational Development",
    description: "The People Director is responsible for building and developing Volt's consulting team. This role oversees recruitment, onboarding, training, and member development to ensure Volt maintains a high-performing and collaborative culture.\n\nWorking closely with the Consulting Director and leadership team, the People Director ensures that Volt attracts talented students, provides meaningful development opportunities, and supports members throughout their experience within the organization.\n\nThe role plays a key part in maintaining Volt's culture, values, and long-term sustainability.",
    responsibilities: [
      "Lead recruitment and selection of new members",
      "Design and manage onboarding and training programs",
      "Support consultant development and performance feedback",
      "Foster a collaborative and inclusive organizational culture",
      "Coordinate internal initiatives that strengthen team engagement",
      "Support leadership succession and long-term talent development"
    ]
  },
  consulting: {
    title: "Consulting Director",
    area: "Head of Projects & Consulting Delivery",
    description: "The Consulting Director leads Volt's consulting practice and ensures that all client engagements meet a high standard of quality and impact.\n\nThis role oversees the full portfolio of consulting projects, supports Project Managers and consulting teams, and establishes the methodologies and frameworks used across Volt's work.\n\nThe Consulting Director acts as a senior advisor on projects, helping teams structure problems, refine analyses, and deliver clear, actionable recommendations to clients.",
    responsibilities: [
      "Oversee Volt's consulting project portfolio",
      "Guide Project Managers and consulting teams throughout engagements",
      "Ensure quality and consistency of client deliverables",
      "Develop and refine consulting methodologies and tools",
      "Support client relationships and key project milestones",
      "Contribute to the strategic development of Volt's consulting services"
    ]
  },
  financial: {
    title: "Financial & Partnerships Director",
    area: "Partnerships, Growth & Financial Management",
    description: "The Financial & Partnerships Director manages Volt's financial operations while leading the development of partnerships and new project opportunities.\n\nThis role ensures Volt operates sustainably while expanding its network of collaborators, sponsors, and client organizations. By combining financial oversight with external relationship building, the Director helps position Volt for long-term growth and impact.",
    responsibilities: [
      "Manage Volt's budget, financial planning, and reporting",
      "Identify and develop new partnership opportunities",
      "Support acquisition of consulting projects and collaborations",
      "Maintain relationships with clients, sponsors, and partners",
      "Ensure financial sustainability of Volt's activities",
      "Support strategic initiatives that expand Volt's reach and impact"
    ]
  },
  legal: {
    title: "Legal Director",
    area: "Governance, Compliance & Risk",
    description: "The Legal Director oversees Volt's legal framework and ensures the organization operates responsibly and in accordance with relevant regulations.",
    responsibilities: [
      "Draft and review contracts, NDAs, and partnership agreements",
      "Ensure compliance with foundation governance and regulations",
      "Advise teams on confidentiality, data protection, and intellectual property",
      "Support risk management across projects and events",
      "Maintain documentation and legal records for the organization"
    ]
  },
  projectmanager: {
    title: "Project Manager",
    area: "Engagement Lead",
    description: "Project Managers lead Volt's consulting engagements and guide teams from problem definition to final delivery.",
    responsibilities: [
      "Lead consulting teams throughout project execution",
      "Define project scope, objectives, and timelines",
      "Coordinate team activities and track progress",
      "Maintain communication with the client organization",
      "Ensure deliverables meet quality expectations",
      "Support team members and foster effective collaboration"
    ]
  },
  seniorconsultant: {
    title: "Senior Consultant",
    area: "Workstream Lead",
    description: "Senior Consultants drive analysis and guide project execution while supporting the Project Manager.",
    responsibilities: [
      "Lead analytical workstreams within consulting projects",
      "Support project planning and problem structuring",
      "Mentor Consultants and Visiting Associates",
      "Contribute to client presentations and deliverables",
      "Ensure analysis is rigorous and well communicated"
    ]
  },
  consultant: {
    title: "Consultant",
    area: "Consulting Team Member",
    description: "Consultants conduct research, perform analysis, and contribute to the development of recommendations that address client challenges.",
    responsibilities: [
      "Conduct research and analysis for consulting projects",
      "Contribute to the development of insights and recommendations",
      "Prepare presentations and project deliverables",
      "Collaborate with team members to solve complex problems",
      "Support client meetings and discussions when required"
    ]
  },
  visitingassociate: {
    title: "Visiting Associate (Intern)",
    area: "Entry-Level Consulting Role",
    description: "Visiting Associates support project work while developing consulting skills in a structured environment.",
    responsibilities: [
      "Assist with research and information gathering",
      "Support analysis and preparation of project materials",
      "Learn consulting methodologies and frameworks",
      "Contribute to team discussions and problem solving",
      "Develop core professional and analytical skills"
    ]
  }
};

const OrgBox = ({
  label,
  roleKey,
  isActive,
  onClick,
}: {
  label: string;
  roleKey: string;
  isActive: boolean;
  onClick: (key: string) => void;
}) => (
  <button
    onClick={() => onClick(roleKey)}
    aria-label={`View details for ${label}`}
    className={cn(
      "px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap",
      "border border-secondary/80 shadow-sm",
      isActive
        ? "bg-primary text-primary-foreground shadow-lg scale-105"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5 hover:shadow-md"
    )}
  >
    {label}
  </button>
);

const VerticalLine = ({ height = 32 }: { height?: number }) => (
  <div className="flex justify-center">
    <div className="w-px bg-border" style={{ height }} />
  </div>
);

const RolePanel = ({
  role,
  onClose,
  isMobile,
}: {
  role: RoleData | null;
  onClose: () => void;
  isMobile: boolean;
}) => {
  if (!role) return null;

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl max-h-[75vh] overflow-y-auto animate-slide-in-right" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="sticky top-0 bg-background p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-foreground">{role.title}</h3>
              <p className="text-sm text-muted-foreground">{role.area}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full" aria-label="Close panel">
              <X size={20} />
            </button>
          </div>
          <div className="p-5 space-y-4">
            {role.description.split('\n\n').map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
            ))}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Key Responsibilities</h4>
              <ul className="space-y-1.5">
                {role.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-96 border-l bg-background p-6 overflow-y-auto animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{role.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{role.area}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full" aria-label="Close panel">
          <X size={18} />
        </button>
      </div>
      <div className="space-y-3 mb-6">
        {role.description.split('\n\n').map((p, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
        ))}
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-3">Key Responsibilities</h4>
      <ul className="space-y-2">
        {role.responsibilities.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
};

const OrgHierarchyExplorer = () => {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleClick = (key: string) => {
    setActiveRole(prev => prev === key ? null : key);
  };

  const handleClose = () => setActiveRole(null);

  const selectedRole = activeRole ? roleData[activeRole] : null;

  const directors = [
    { key: 'marketing', label: 'Marketing &\nEvents Director' },
    { key: 'people', label: 'People Director' },
    { key: 'consulting', label: 'Consulting\nDirector' },
    { key: 'financial', label: 'Financial &\nPartnerships Director' },
    { key: 'legal', label: 'Legal Director' },
  ];

  return (
    <section className="py-8">
      <div>
        <div className="text-center mb-10">
          <h3 className="heading-sm text-foreground mb-2">Organizational Hierarchy</h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Click on any role to learn more about the position and its responsibilities.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Chart area */}
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[700px] py-4 px-2">
              {/* Partners */}
              <div className="flex justify-center">
                <OrgBox label="Partners" roleKey="partners" isActive={activeRole === 'partners'} onClick={handleClick} />
              </div>
              <VerticalLine />

              {/* Principal */}
              <div className="flex justify-center">
                <OrgBox label="Principal" roleKey="principal" isActive={activeRole === 'principal'} onClick={handleClick} />
              </div>
              <VerticalLine />

              {/* Directors row */}
              <div className="relative">
                {/* Horizontal connecting line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border" style={{ width: '80%', left: '50%', transform: 'translateX(-50%)' }} />
                <div className="flex justify-center gap-3 pt-4 relative">
                  {/* Vertical lines from horizontal bar to each director */}
                  {directors.map((d, i) => (
                    <div key={d.key} className="flex flex-col items-center">
                      <div className="w-px h-4 bg-border -mt-4" />
                      <OrgBox
                        label={d.label.replace('\n', ' ')}
                        roleKey={d.key}
                        isActive={activeRole === d.key}
                        onClick={handleClick}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Line from Consulting Director down */}
              <VerticalLine />

              {/* Project Manager */}
              <div className="flex justify-center">
                <OrgBox label="Project Manager" roleKey="projectmanager" isActive={activeRole === 'projectmanager'} onClick={handleClick} />
              </div>
              <VerticalLine />

              {/* Senior Consultants */}
              <div className="relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border" style={{ width: '30%' }} />
                <div className="flex justify-center gap-24 pt-4">
                  {[0, 1].map(i => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-px h-4 bg-border -mt-4" />
                      <OrgBox label="Senior Consultant" roleKey="seniorconsultant" isActive={activeRole === 'seniorconsultant'} onClick={handleClick} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-24">
                {[0, 1].map(i => (
                  <div key={i} className="flex flex-col items-center">
                    <VerticalLine />
                    {/* Consultants under each Senior */}
                    <div className="relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border" style={{ width: '80%' }} />
                      <div className="flex gap-4 pt-4">
                        {[0, 1].map(j => (
                          <div key={j} className="flex flex-col items-center">
                            <div className="w-px h-4 bg-border -mt-4" />
                            <OrgBox label="Consultant" roleKey="consultant" isActive={activeRole === 'consultant'} onClick={handleClick} />
                            <VerticalLine height={24} />
                            <OrgBox label="Visiting Associate (Intern)" roleKey="visitingassociate" isActive={activeRole === 'visitingassociate'} onClick={handleClick} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop panel */}
          {!isMobile && selectedRole && (
            <RolePanel role={selectedRole} onClose={handleClose} isMobile={false} />
          )}
        </div>

        {/* Mobile panel */}
        {isMobile && selectedRole && (
          <RolePanel role={selectedRole} onClose={handleClose} isMobile={true} />
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default OrgHierarchyExplorer;
