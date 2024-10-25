import * as imsService from '@/ims-service';
import { useQuery } from '@tanstack/react-query';

interface VersionInfo {
    backend: {
        name: string;   
        version: string; 
    };
    frontend: {
        name: string;  
        version: string; 
    }
}

const VersionBadge = () => {
  const { data } = useQuery<VersionInfo>({
    queryKey: ['fetchAppVersions'],
    queryFn: () => imsService.fetchAppVersions(),
  });

  return (
    data && (
      <div className="rounded-lg bg-[#85A7AD] px-2 py-1 text-white text-xs font-semibold">
        FE: v{data.frontend.version}, BE: v{data.backend.version}
      </div>
    )
  );
  //   FE: v10.2.1, BE: v11.2.1
};

export default VersionBadge;
