import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice"; // Adjust the import path as needed
import { use } from "react";

const FilterCard = () => {
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  useEffect(() => {
    dispatch(setSearchedQuery(location));
  }, [location]);

  useEffect(() => {
    dispatch(setSearchedQuery(industry));
  }, [industry]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter location"
        />
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700">
          Industry
        </label>
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter industry"
        />
      </div>
    </div>
  );
};

export default FilterCard;
