import { ResponsivePie } from '@nivo/pie'

type CategoryCount = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface Props {
 data: CategoryCount[];
}

const HardwareDistPie = ({ data }: Props) => {
  const theme = {
    "tooltip": {
        "container": {
            "background": "#ffffff",
            "color": "#333333",
            "fontSize": 12
        },
        "basic": {},
        "chip": {},
        "table": {},
        "tableCell": {},
        "tableCellValue": {}
    }
  }
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      theme={theme}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={data.map(item => item.color)}
      borderWidth={1}
      borderColor={{
          from: 'color',
          modifiers: [
              [
                  'darker',
                  0.2
              ]
          ]
      }}
      transitionMode='startAngle'
      enableArcLinkLabels={false}    
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
          from: 'color',
          modifiers: [
              [
                  'darker',
                  2
              ]
          ]
      }}
      defs={[
          {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true
          },
          {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
          }
      ]}
      // tooltip={((datum) => {
      //   return (
      //     <div className="bg-popover p-2 border-2 border-secondary space-x-2 drop-shadow-lg">
      //       <p className="flex gap-1 items-center text-xs">
      //         <div className='h-3 w-3 mr-1' style={{ backgroundColor: datum.datum.color }}></div>
      //         {datum.datum.id}:
      //         <span className='font-bold flex gap-1'>
      //           {datum.datum.value}
      //           <span className='text-muted-foreground font-normal'>{`(${(datum.datum.data.percentage).toFixed(2)}%)`}</span>
      //         </span>
      //       </p>
      //     </div>
      //   )
      // })}
    />
  )
} 

export default HardwareDistPie;