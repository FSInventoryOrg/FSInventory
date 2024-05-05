import { ResponsiveBar } from '@nivo/bar'
import { useContext } from 'react';
import { ThemeProviderContext } from '@/components/ThemeProvider'; // Path to your ThemeProvider context

type CategoryByServiceYears = {
  category: string;
  serviceYears: string;
  value: number;
  color: string;
}

interface Props {
  data: CategoryByServiceYears[];
}

const LaptopServiceYearsBar = ({ data }: Props) => {
  const { theme: appearanceMode } = useContext(ThemeProviderContext);
  const theme = {
    "text": {
        "fontSize": 11,
        "fill": "#333333",
        "outlineWidth": 0,
        "outlineColor": "transparent"
    },
    "axis": {
        "domain": {
            "line": {
                "stroke": "#777777",
                "strokeWidth": 1
            }
        },
        "legend": {
            "text": {
                "fontSize": 12,
                "fill": appearanceMode === 'dark' ? '#fff' : '#333',
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        },
        "ticks": {
            "line": {
                "stroke": "#777777",
                "strokeWidth": 1
            },
            "text": {
                "fontSize": 11,
                "fill": appearanceMode === 'dark' ? '#fff' : '#333',
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        }
    },
    "grid": {
        "line": {
            "stroke": appearanceMode === 'dark' ? '#244242' : '#ccc',
            "strokeWidth": 1
        }
    },
    "legends": {
        "text": {
            "fontSize": 11,
            "fill": appearanceMode === 'dark' ? '#fff' : '#333',
            "outlineWidth": 0,
            "outlineColor": "transparent"
        },
    },
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

  const indexBy = data.length > 0 && typeof data[0] === 'object'
  ? Object.keys(data[0])[1] 
  : '';

  return (
    <ResponsiveBar
      data={data}
      indexBy={indexBy}
      layout={'vertical'}
      theme={theme}
      margin={{ top: 5, right: 5, bottom: 40, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={({data}) => String(data[`color` as keyof CategoryByServiceYears])}
      borderColor={{
          from: 'color',
          modifiers: [
              [
                  'darker',
                  1.6
              ]
          ]
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Years of Service',
          legendPosition: 'middle',
          legendOffset: 32,
          truncateTickAt: 0
      }}
      axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '# of Laptops',
          legendPosition: 'middle',
          legendOffset: -40,
          truncateTickAt: 0
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
          from: 'color',
          modifiers: [
              [
                  'darker',
                  1.6
              ]
          ]
      }}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
      tooltip={((datum) => {
        return (
          <div className="bg-white px-2 py-1.5 space-x-2 drop-shadow">
            <p className="flex gap-1 items-center text-xs text-black">
              <span className='h-3 w-3 mr-1' style={{ backgroundColor: datum.color }}></span>
              {datum.data.serviceYears} years of service:
              <span className='font-bold flex gap-1'>
                {datum.value}
              </span>
            </p>
          </div>
        )
      })}
    />
  )
}

export default LaptopServiceYearsBar;