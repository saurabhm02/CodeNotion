import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className="font-bold bg-gradient-to-b from-[#425767] via-[#6e878b] to-[#a4ebc2] text-transparent bg-clip-text">
        {" "}
        {text}
    </span>
  )
}

export default HighlightText