import React from "react";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";


const Home = () => {
  return (
    <div className="relative mx-auto flex, flex-col w-11/12 items-center ">
         
        <Link>
            <div>
                <div className="flex items-center">
                    <p>Share your expertise, become an Instructor</p>
                    <IoArrowForward className="text-xl"/>
                </div>
            </div>
        </Link>



    </div>
  )
}

export default Home;