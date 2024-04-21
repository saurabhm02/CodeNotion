
import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import "swiper/css/free-mode"
import 'swiper/css/pagination';

// import required modules
import { FreeMode, Pagination, Autoplay } from 'swiper';
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

const ReviewsSlider = () => {
    const [reviews, setReviews] = useState([]);

    const fetchedReviews = async () => {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          setReviews(data?.data)
        }
    };
    useEffect(() => {
        fetchedReviews();
      }, [])
  return (
    <div className='my-12' >
      {
        reviews && reviews.length ?
          (
            <div className='text-white px-5 w-[350px] md:w-[650px]  lg:w-[1260px] mx-auto' >
              <Swiper
                slidesPerView={1}
                spaceBetween={25}
                freeMode={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: true
                }}
                modules={[FreeMode, Pagination, Autoplay]}
                breakpoints={{
                  768: {
                    slidesPerView: 2
                  },
                  1024: {
                    slidesPerView: 4
                  }
                }}
                className="w-full "
              >
                {
                  reviews.map((review, ind) => (
                    <SwiperSlide className='!w-[300px]' key={ind} >
                      <ReviewCard review={review} />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>
          ) :
          (
            <div className='' >
              <p className='text-2xl font-semibold text-center text-richblack-300 select-none' >No Reviews Found</p>
            </div>
          )
      }
    </div>
  )
}

export default ReviewsSlider
