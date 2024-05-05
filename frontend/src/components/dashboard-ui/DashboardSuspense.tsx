import { Skeleton } from "../ui/skeleton"

const DashboardSuspense = () => {
  return (
    <div className='w-full flex flex-col xl:flex-row gap-6'>
      <div className='w-full flex flex-col gap-6'>   
        <div className='w-full flex flex-col xl:flex-row gap-6'>
          <div className='w-full flex flex-col gap-6'>
            <div className='flex gap-6'>
              <div id="generic metrics" className='w-1/2 xl:w-full flex flex-col xl:flex-row gap-6'>
                <Skeleton className='h-[200px] w-1/3 bg-primary rounded-xl border-secondary-foreground border-2 drop-shadow'>

                </Skeleton>
                <div className='hidden xl:flex gap-6 w-full'>
                  <Skeleton className='h-[200px] w-1/4 bg-accent rounded-xl drop-shadow'>

                  </Skeleton>
                  <Skeleton className='h-[200px] w-1/4 bg-accent rounded-xl drop-shadow'>

                  </Skeleton>
                  <Skeleton className='h-[200px] w-1/4 bg-accent rounded-xl drop-shadow'>

                  </Skeleton>
                  <Skeleton className='h-[200px] w-1/4 bg-accent rounded-xl drop-shadow'>

                  </Skeleton>
                </div>
                <div className='grid xl:hidden grid-cols-2 gap-6'>
                  <div className='h-[200px] w-full bg-accent rounded-xl drop-shadow'>

                  </div>
                  <div className='h-[200px] w-full bg-accent rounded-xl drop-shadow'>

                  </div>
                  <div className='h-[200px] w-full bg-accent rounded-xl drop-shadow'>

                  </div>
                  <div className='h-[200px] w-full bg-accent rounded-xl drop-shadow'>

                  </div>
                </div>
              </div>
              <Skeleton id="hardware asset distribution" className='w-[50%] bg-accent rounded-xl p-6 flex xl:hidden flex-col gap-2 drop-shadow'>
              </Skeleton>   
            </div>

            <Skeleton id="status by category" className='w-full h-[400px] bg-accent rounded-xl p-6 flex flex-col gap-2 drop-shadow'>
            </Skeleton>
          </div>
          <Skeleton id="hardware asset distribution" className='w-[25%] h-full bg-accent rounded-xl p-6 hidden xl:flex flex-col gap-2 drop-shadow'>
          </Skeleton>   
        </div>
        <div className='flex flex-col xl:flex-row gap-6'>
          <Skeleton id="laptop service years" className='w-full xl:w-1/2 h-[400px] bg-accent rounded-xl p-6 flex flex-col gap-2 drop-shadow'>
          </Skeleton>
          <Skeleton id="latest assets added" className='w-full xl:w-1/2 h-[400px] bg-accent rounded-xl p-6 flex flex-col gap-0 drop-shadow'>
          </Skeleton>
        </div>
      </div>
      
    </div>
  )
}


export default DashboardSuspense