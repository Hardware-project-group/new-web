import { React } from "react"
import './home.css'

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Anywhere & Anytime
        <br className="max-md:hidden" /> 
        <span className="orange_gradient text-center">ESP-Powered System</span> 
      </h1> 
      <p className="desc text-center">
        StockSync ia a Microcontroller based easy warehouse management system.This system will help you to
        manage stock effeciently and enhance security of warehouse.
      </p>
      <button className="black_btn mt-10"><a href='/login'>Login</a> </button>
    </section>
  )
}

export default Home