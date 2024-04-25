
import { useEffect, useState } from "react"
import { AiOutlineLogin, AiOutlineShoppingCart, AiOutlineHome, AiOutlineContacts } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"
import logo from "../../assets/Logo/logo.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constant"
import ProfileDropdown from "../core/auth/ProfileDropDown"
import { GiHamburgerMenu } from 'react-icons/gi'
import { VscDashboard, VscSignOut, VscSignIn } from "react-icons/vsc"
import HamburgerMenu from "./Menu"
import { BiCategory, BiDetail } from 'react-icons/bi'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import { logout } from "../../services/operations/authAPI"
function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API)
      setSubLinks(res.data.data)
    } catch (error) {
      console.log("Could not fetch Categories.", error)
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchData();
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={` bg-richblack-900 flex h-14 items-center justify-around border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <div className="flex items-center gap-4">
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-[#FD7014]"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : (subLinks && subLinks.length) ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-[#FD7014]"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-[#603d1e]">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        </div>
        <div className='mr-4 md:hidden' >
          <GiHamburgerMenu
            onClick={() => setIsMenuModalOpen(prev => !prev)}
            className={` fill-richblack-100 `}
            fontSize={24}
          />

          <HamburgerMenu
            isMenuModalOpen={isMenuModalOpen}
            setIsMenuModalOpen={setIsMenuModalOpen}
          >
            <div className='flex flex-col gap-y-2 py-5 px-5' >
              {
                (loading || loading) &&
                (
                  <div className='text-white font-bold'>
                    Loading ...
                  </div>
                )
              }

              {
                token === null &&
                (
                  <Link to={'/login'} onClick={() => setIsMenuModalOpen(false)}   >
                    <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 ' >
                      <VscSignIn className='text-lg' />
                      Log In
                    </div>
                  </Link>
                )
              }

              {
                token === null &&
                (
                  <Link to={'/signup'} onClick={() => setIsMenuModalOpen(false)} >
                    <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 ' >
                      <AiOutlineLogin className='text-lg' />
                      Sign Up
                    </div>
                  </Link>
                )
              }

              {
                token !== null &&
                (
                  <Link to={'/dashboard/my-profile'} onClick={() => setIsMenuModalOpen(false)}  >
                    <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 ' >
                      <VscDashboard className='text-lg' />
                      Dashboard
                    </div>
                  </Link>
                )
              }

              {
                token !== null && user && user?.role === 'Student' &&
                (
                  <Link to={'/dashboard/cart'} onClick={() => setIsMenuModalOpen(false)}  >
                    <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 ' >
                      <AiOutlineShoppingCart className='text-lg' />
                      Cart
                    </div>
                  </Link>
                )
              }

              {
                token !== null &&
                (
                  <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 cursor-pointer'
                    onClick = {() => {dispatch(logout(navigate))}} >
                    <VscSignOut className='text-lg' />
                    LogOut
                  </div>
                )
              }

              {/* General Buttons */}
              <div className='h-[1px] my-2 bg-richblack-100 w-3/4 mx-auto' ></div>

              <Link to={'/'} onClick={() => setIsMenuModalOpen(false)}   >
                <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 ' >
                  <AiOutlineHome className='text-lg' />
                  Home
                </div>
              </Link>

              <Link to={'/about'} onClick={() => setIsMenuModalOpen(false)}   >
                <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 ' >
                  <BiDetail className='text-lg' />
                  About Us
                </div>
              </Link>

              <Link to={'/contact'} onClick={() => setIsMenuModalOpen(false)} >
                <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 ' >
                  <AiOutlineContacts className='text-lg' />
                  Contact Us
                </div>
              </Link>

              {/* Category */}
              <div className=''
                onClick={() => setCategoryOpen(prev => !prev)}
              >
                <details >
                  <summary className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 ' >
                    <BiCategory className='text-lg' />
                    Category
                    {
                      categoryOpen ? <SlArrowUp className='translate-y-[1px] ml-auto mr-1' /> : <SlArrowDown className='translate-y-[1px] ml-auto mr-1' />
                    }
                  </summary>

                  <div className='px-4 text-richblack-100' >
                    {
                      subLinks.length ?
                        (
                          <div className='flex flex-col capitalize' >
                            {
                              subLinks.map((catalog, index) => (
                                <Link to={`/categorycourses/${catalog.name.split(' ').join('-')}`} key={index} onClick={() => setIsMenuModalOpen(false)} >
                                  <p className=' rounded-lg py-2 pl-4' >{catalog.name}</p>
                                </Link>
                              ))
                            }
                          </div>
                        )
                        :
                        (<div className='rounded-lg py-2 pl-4 select-none cursor-not-allowed' >No Catalog Available</div>)
                    }
                  </div>
                </details>
              </div>
            </div>
          </HamburgerMenu>
        </div>
      </div>
    </div>
  )
}

export default Navbar
