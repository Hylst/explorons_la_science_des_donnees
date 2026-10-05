
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface CourseInfo {
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  totalHours: string;
}

interface CourseFeature {
  title: string;
  items: string[];
}

interface CourseHeroTemplateProps {
  courseInfo: CourseInfo;
  features: CourseFeature[];
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
}

const CourseHeroTemplate: React.FC<CourseHeroTemplateProps> = ({
  courseInfo,
  features,
  icon: Icon,
  gradientFrom,
  gradientTo,
  iconColor
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-8 rounded-lg`}>
      <div className="flex items-center gap-4 mb-4">
        <Icon className={`h-12 w-12 ${iconColor}`} />
        <div>
          <h2 className="text-3xl font-bold">{courseInfo.title}</h2>
          <p className="text-gray-600 mt-2">{courseInfo.description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Badge variant="outline">{courseInfo.level}</Badge>
        <Badge variant="outline" title="Durée indicative, à votre rythme">{courseInfo.duration} (indicatif)</Badge>
        <Badge variant="outline">{courseInfo.modules} modules</Badge>
        <Badge variant="outline">{courseInfo.totalHours} de contenu</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/80 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <ul className="text-sm space-y-1">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseHeroTemplate;
