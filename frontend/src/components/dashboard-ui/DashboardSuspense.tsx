import { Skeleton } from "../ui/skeleton"

const DashboardSuspense = () => {
  return (
    <div className='w-full flex flex-col xl:flex-row gap-6'>
      <div className='w-full flex flex-col gap-6'>   
        <div className='w-full flex flex-col xl:flex-row gap-6'>
          <div className='w-full flex flex-col gap-6'>
            <div className='flex flex-col lg:flex-row gap-6'>
              <div id="generic metrics" className='w-[100%] xl:w-full flex flex-col xl:flex-row gap-6'>
                <div className='hidden xl:flex gap-6 w-full'>
                  <Skeleton id='hardware assets overview' className='h-[250px] w-2/4 bg-muted p-6 rounded-lg drop-shadow flex flex-col gap-6'>
                  </Skeleton>
                  <Skeleton id='platforms overview' className='h-[250px] w-1/4 bg-muted p-6 rounded-lg drop-shadow flex flex-col gap-6'>
                  </Skeleton>
                  <Skeleton id='employees overview' className='h-[250px] w-1/4 bg-muted p-6 rounded-lg drop-shadow flex flex-col gap-6'>
                  </Skeleton>
                </div>
                <div className='grid xl:hidden grid-cols-1 sm:grid-cols-2 gap-6'>
                  <Skeleton id='hardware assets overview' className='h-[250px] col-span-1 sm:col-span-2 bg-muted p-6 rounded-lg drop-shadow flex flex-col gap-6'>
                  </Skeleton>
                  <div className='flex flex-col gap-6'>
                    <Skeleton id='platforms overview' className='h-[250px] bg-muted p-6 rounded-lg drop-shadow flex flex-col gap-6'>
                    </Skeleton>
                    <Skeleton id='employees overview' className='h-[250px] bg-muted p-6 rounded-lg drop-shadow flex flex-col gap-6'>
                    </Skeleton>
                  </div>
                  <Skeleton id="hardware asset distribution" className='h-[250px] sm:h-full w-[100%] bg-muted rounded-lg p-6 flex xl:hidden flex-col gap-2 drop-shadow'>
                  </Skeleton> 
                </div>
              </div>
            </div>
            <Skeleton id="status by category" className='h-[250px] w-full bg-muted rounded-lg p-6 flex flex-col gap-2 drop-shadow'>
            </Skeleton>
          </div>  
          <Skeleton id="hardware asset distribution" className='h-[250px] lg:h-full w-[35%] bg-muted rounded-lg p-6 hidden xl:flex flex-col gap-2 drop-shadow z-50'>
          </Skeleton>   
        </div>
        <div className='flex flex-col xl:flex-row gap-6'>
          <Skeleton id="laptop service years" className='h-[250px] w-full xl:w-1/3 bg-muted rounded-lg p-6 flex flex-col gap-2 drop-shadow'>
          </Skeleton>
          <Skeleton id="latest assets added" className='h-[250px] w-full xl:w-2/3 bg-muted rounded-lg p-6 flex flex-col gap-0 drop-shadow'>
          </Skeleton>
        </div>
      </div>
    </div>
  )
}


export default DashboardSuspense