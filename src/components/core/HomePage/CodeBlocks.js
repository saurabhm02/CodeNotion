import React from 'react';
import Button from './Button';
import { IoArrowForward } from "react-icons/io5";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
    position, heading,
    subheading, btn1, btn2,
    codeblock, backgroundGradiant, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10` }>
        {/* Part 1 */}
        <div className="w-[100%] lg:w-[50%] flex flex-col gap-8">
            {heading}

            <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
                {subheading}
            </div>

            <div className="flex gap-7 mt-7">
                <Button active={btn1.active} linkTo={btn1.linkTo} >
                    <div className="flex gap-2 items-center">
                        {btn1.btnText}
                        <IoArrowForward/>
                    </div>
                </Button>
                <Button active={btn2.active} linkTo={btn2.linkTo}>
                        {btn2.btnText}

                </Button>
            </div>
        </div>

        {/* Part 2 */}
        <div className="h-fit code-border   flex flex-row  text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px] ">
            {backgroundGradiant}

            <div className="text-center flex flex-col w-[10%] select-none text-richblack-100  bg-richblack-700  font-inter font-bold ">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
                <p>12</p>
            </div>

            <div
            className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} bg-richblack-700  pr-1`}>
                <TypeAnimation
                    sequence={[codeblock, 10000 , ""]}
                    cursor={true}
                    repeat={Infinity}
                    style={{
                    whiteSpace: "pre-line",
                    display: "block",
                    }}
                    omitDeletionAnimation={true}
                />
            </div>
        </div>
    </div>
  )
}

export default CodeBlocks;