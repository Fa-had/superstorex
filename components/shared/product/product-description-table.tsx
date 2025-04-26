// import React from 'react'

// type TableProps = {
//   description: string[]
// }

// const Table: React.FC<TableProps> = ({ description }) => {
//   return (
//     <div className='overflow-x-auto'>
//       <table className='min-w-full table-auto border border-gray-300'>
//         <thead className='bg-gray-100'>
//           <tr>
//             <th className='text-left px-4 py-2 border-b'>Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           {description.map((item, index) => (
//             <tr
//               key={index}
//               className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
//             >
//               <td className='px-4 py-2 border-b'>{item}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default Table
import React from 'react'

interface TableProps {
  description: string
}

interface TableRow {
  label: string
  value: string
}

const Table: React.FC<TableProps> = ({ description }) => {
  // Use regex to split on ". " followed by a capital letter
  const entries = description
    .split(/(?<=\.)\s+(?=[A-Z])/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  // Convert each entry into a label-value pair
  const rows: TableRow[] = entries.map((entry) => {
    const [label, ...rest] = entry.split(':')
    let value = rest.join(':').trim() // preserve colons in value
    // Remove trailing period if it exists (but not decimals)
    if (value.endsWith('.')) {
      value = value.slice(0, -1).trim()
    }
    return { label: label.trim(), value }
  })

  return (
    <div className='overflow-x-auto'>
      <table className='table-auto border-collapse border-2 '>
        <caption className='border border-gray-300 font-bold p-1 bg-gray-100'>
          {'Specification'}
        </caption>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className='border border-gray-300 font-bold p-2'>
                {row.label}
              </td>
              <td className='border border-gray-300 p-2'>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
