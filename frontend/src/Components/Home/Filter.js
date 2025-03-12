import React, { useEffect, useState } from "react";
import FilterModal from "./FilterModal";
import { useDispatch } from "react-redux";
import { getAllProperties } from "../../Store/Property/property-action";
import { propertyAction } from "../../Store/Property/property-slice";

const Filter = () => {
  //State for controlling modal visability.
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for storing selected filters
  const [selectedFilters, setSelectedFilters] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(propertyAction.updateSearchParams(selectedFilters));
    dispatch(getAllProperties());
  }, [selectedFilters, dispatch]);

  //Funnction to handle opening the modal/popupWindow
  const handleOpenModal = () => {
    setIsModalOpen(true); // sets isModalOpen to true to open the modal
  };

  //Function to gandle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // sets isModalOpen to false to close the modal
  };

  //Function to handle changes in filters
  const handleFilterChange = (filterName, value) => {
    //Update the selected filters with the new values
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <>
      {/* Click event to open the modal */}
      <span class="material-symbols-outlined filter" onClick={handleOpenModal}>
        tune
      </span>
      {isModalOpen && (
        <FilterModal
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Filter;
