import React from "react";

const Footer = () => {
  return (
    // Footer will be a constant size and will be at the bottom of the page
    <footer className="py-8 bg-purple-100 shadow dark:bg-gray-900 m-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Job Hunt</h2>
            <p className="text-x font-bold mt-4">For Job Seekers</p>
            <p>
              Discover your dream job with ease. Whether you're a student
              looking for internships or a fresh graduate searching for your
              first job.<br></br>
              Our platform connects you with top employers worldwide.
            </p>
            <p className="text-x font-bold mt-4">For Recruiters</p>
            <p>
              Hire the right talent effortlessly.Post jobs, find qualified
              candidates, and build your dream team in no time.
            </p>
            <p className="text-x font-bold mt-4">Resources</p>
            <p>
              Stay updated with career tips, success stories, and the latest
              industry trends. Explore our blog, access exclusive resources,
              <br></br>and join our growing community of professionals.
            </p>
            <p className="text-x font-bold mt-4">About Us</p>
            <p>
              We're dedicated to bridging the gap between aspiring job seekers
              and forward-thinking employers.
              <br></br>Learn more about our mission, our team, and how we're
              making an impact in the job market.
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-x font-bold mt-6">Quick Links</p>
                <ul className="mt-2">Home</ul>
                <ul className="mt-2">Job Listings</ul>
                <ul className="mt-2">Register/Login</ul>
                <ul className="mt-2">Contact Us</ul>
                <ul className="mt-2">FAQs</ul>
                <ul className="mt-2">Privacy Policy</ul>
              </div>
              <div>
                <p className="text-x font-bold mt-4">Legal</p>
                <ul className="mt-2 ">Terms of Service</ul>
                <ul className="mt-2 ">Privacy Policy</ul>
                <ul className="mt-2 ">Cookie Settings</ul>
                <ul className="mt-2 ">Accessibility</ul>
              </div>
              <div>
                <p className="text-x font-bold mt-4">Contact Information</p>
                <ul className="mt-2">Address (Company/Office location)</ul>
                <ul className="mt-2">Email</ul>
                <ul className="mt-2">Phone number</ul>
                <ul className="mt-2">
                  Social media links (LinkedIn, Facebook, Twitter)
                </ul>
              </div>
            </div>
            <p className="text-sm mt-8">
              © 2024 Your Company. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://facebook.com"
              className="hover:text-gray-400"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-gray-400"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              className="hover:text-gray-400"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
