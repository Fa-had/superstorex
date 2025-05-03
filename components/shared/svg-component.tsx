import React from 'react'

interface LoadingDotsProps {
  title?: string // optional
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  title = 'Uploading',
}) => {
  return (
    <div className='flex justify-center items-center'>
      <svg
        width='200'
        height='40'
        viewBox='0 0 200 40'
        xmlns='http://www.w3.org/2000/svg'
      >
        <text
          x='0'
          y='25'
          fontSize='20'
          fontFamily='Arial, sans-serif'
          fill='#4B5563'
        >
          {`${title}`}
        </text>
        <circle cx='110' cy='20' r='3' fill='#4B5563'>
          <animate
            attributeName='opacity'
            values='0;1;0'
            dur='1.2s'
            begin='0s'
            repeatCount='indefinite'
          />
        </circle>
        <circle cx='120' cy='20' r='3' fill='#4B5563'>
          <animate
            attributeName='opacity'
            values='0;1;0'
            dur='1.2s'
            begin='0.2s'
            repeatCount='indefinite'
          />
        </circle>
        <circle cx='130' cy='20' r='3' fill='#4B5563'>
          <animate
            attributeName='opacity'
            values='0;1;0'
            dur='1.2s'
            begin='0.4s'
            repeatCount='indefinite'
          />
        </circle>
      </svg>
    </div>
  )
}

export const Loader: React.FC = () => {
  return (
    <div className='flex justify-center items-center'>
      <svg
        className='animate-spin h-6 w-6 text-blue-500'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8v8z'
        />
      </svg>
    </div>
  )
}
