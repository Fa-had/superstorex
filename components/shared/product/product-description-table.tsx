import React from 'react'

type TableProps = {
  description: string[]
}

const Table: React.FC<TableProps> = ({ description }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full table-auto border border-gray-300'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='text-left px-4 py-2 border-b'>Description</th>
          </tr>
        </thead>
        <tbody>
          {description.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className='px-4 py-2 border-b'>{item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
