import React from "react";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import HighlightText from "../components/core/HomePage/HighlightText";
import Button from "../components/core/HomePage/Button";
import BannerVid from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks";

const Home = () => {
  return (
    <div className="relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent ">
         
      <Link to={"/signup"}>
        <div className="mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-25 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none w-fit group">
          <div className="flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
            <p>Share your expertise, become an Instructor</p>
            <IoArrowForward className="text-xl"/>
          </div>
        </div> 
      </Link>

      <div className="text-4xl text-center font-semibold mt-7">
        Unlock your potential with 
        <HighlightText text={"Coding Skills"} />
      </div>

      <div className="w-[90%] mt-4 text-center text-lg font-bold text-richblack-300 ">
        With our online coding courses, you can learn at your own pace, from
        anywhere in the world, and get access to a wealth of resources,
        including hands-on projects, quizzes, and personalized feedback from
        instructors.
      </div>

      <div className="flex gap-7 mt-8 ">
        <Button active={true} linkTo={"/signup"}>
          Learn More
        </Button>

        <Button active={false} linkTo={"/signup"}>
          Book a Demo
        </Button>
      </div>

      <div className="mx-14 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-100">
        <video
          muted
          loop
          autoPlay
          className="shadow-[20px_20px_rgba(255,255,255)]"
        >
          <source src={BannerVid} type="video/mp4" />
        </video>
      </div>

     {/* Code Part 1 */}
      <div>
        <CodeBlocks 
          position={"lg:flex-row"}
          heading={
            <div className="text-4xl font-semibold">
              Develop your
              <HighlightText text={"coding potential"} /> with our online
              courses.
            </div>
          }
          subheading={
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
          }
          btn1={{
            btnText: "Try it Yourself",
            link: "/signup",
            active: true,
          }}
          btn2={{
            btnText: "Learn More",
            link: "/signup",
            active: false,
          }}

          codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>\n</html>`}
        
          codeColor={"text-yellow-25"}
          backgroundGradiant={<div className="codeblock1 absolute"></div>}
        />
      </div>

      {/* Code Part 2 */}

      <div>
        <CodeBlocks
          position={"lg:flex-row-reverse"}
          heading={
            <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
              Dive 
              <HighlightText text={"into coding within seconds."} />
            </div>
          }
          subheading={
            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
          }
          btn1={{
            btnText: "Continue Lesson",
            link: "/signup",
            active: true,
          }}
          btn2={{
            btnText: "Learn More",
            link: "/signup",
            active: false,
          }}
          codeColor={"text-caribbeangreen-100"}
          codeblock={`import React from 'react';\n class MyComponent extends React.Component {\n render() {\n return (\n<div>\n<h1>Hello, world!</h1>\n<p>Enter the world of coding in seconds</p>\n</div>\n);\n}\n}\nexport default MyComponent;`}
          backgroundGradient={<div className="codeblock2 absolute"></div>}
        />
      </div>
    </div>
  )
}

export default Home;