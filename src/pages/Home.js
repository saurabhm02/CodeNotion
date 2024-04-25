import React from "react";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import HighlightText from "../components/core/HomePage/HighlightText";
import Button from "../components/core/HomePage/Button";
import BannerVid from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimeLineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSectionj";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";

const Home = () => {
  return (
    <div>
    <div className="relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent ">
         
      {/* Part 1 */}
      {/* <Link to={"/signup"}>
        <div className="mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-25 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none w-fit group">
          <div className="flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
            <p>Share your expertise, become an Instructor</p>
            <IoArrowForward className="text-xl"/>
          </div>
        </div> 
      </Link> */}

      <div className="lg:flex gap-2   justify-around items-center">
        <div>
          <div className="text-4xl font-semibold ">
            Learn to Code with  
            <HighlightText text={"codeNotion"} />
          </div>

          <div className="w-[90%] mt-4  text-lg font-bold text-richblack-300 ">
            codeNotion is an ed-tech platform that provides interactive coding courses, hands-on projects, and
            personalized learning experiences to help you become a skilled developer.
          </div>

          <div className="flex gap-7 mt-8 ">
            <Button active={true} linkTo={"/signup"}>
            Get Started
            </Button>

            <Button active={false} linkTo={"/signup"}>
              Learn more
            </Button>
          </div>
        </div>

        <div className="my-10 ">
          <video
            muted
            loop
            autoPlay
            className=" w-[75rem] relative"
          >
            <source src={BannerVid} type="video/mp4" />
          </video>
        </div>
      </div>

     {/* Code Part 1 */}
      <div>
        <CodeBlocks 
          position={"  lg:flex-row-reverse"}
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
            linkTo: "/signup",
            active: true,
          }}
          btn2={{
            btnText: "Learn More",
            linkTo: "/signup",
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
          position={"lg:flex-row"}
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
            linkTo: "/signup",
            active: true,
          }}
          btn2={{
            btnText: "Learn More",
            linkTo: "/signup",
            active: false,
          }}
          codeColor={"text-caribbeangreen-100"}
          codeblock={`import React from 'react';\n class MyComponent extends React.Component {\n render() {\n return (\n<div>\n<h1>Hello, world!</h1>\n<p>Enter the world of coding in seconds</p>\n</div>\n);\n}\n}\nexport default MyComponent;`}
          backgroundGradient={<div className="codeblock2 absolute"></div>}
        />
      </div>
          <ExploreMore/>
    </div>
      {/* Part 2 */} 


      <div className="bg-richblack-900 text-pure-greys-5 ">
        <div className="homepage_bg h-[320px] object-contain">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto"> 
            <div className="lg:h-[150px]"></div>
            <div className="flex gap-7 text-white">
                  <Button active={true} linkTo={"/signup"}>
                      <div className="flex gap-2 items-center">
                          Explore Full Catlog 
                          <IoArrowForward/>
                      </div>
                  </Button>
                  <Button active={false} linkTo={"/signup"}> 
                  <div className="flex gap-2 items-center">
                      Learn More 
                      </div>
                  </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>

            
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern CodeNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <Button  active={true} linkTo={"/signup"}>
                <div className="">Learn More</div>
              </Button>
            </div>
          </div>

          {/* <TimelineSection />
          <LearningLanguageSection/> */}
        </div>  
      </div>

       {/* Section 3 / part 3  */}

       <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
          <InstructorSection/>

          <h1 className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners
          </h1>
       </div>

        <Footer/>
    </div>
  )
}

export default Home;
