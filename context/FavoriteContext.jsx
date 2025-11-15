// 1. import create context from react
import React, { createContext, useContext, useState } from "react";
// 2. creating the variable(using it)
const favoriteContext = createContext();

// 3.creating a provider(a provider component is a comp which is provides  the context to all components in the application )

export const favoriteContextProvider = ({ children }) => {
  // 4 we need to pass in the children prop:bcs all the screen components are now considered as children
  const [favorite, setFavorite] = useState([]);
  const [selected, setSelected] = useState(null);
  //   function to add an emoji to favorites
  const addToFavorite = (emojie) => {
    // lets check if the emoji is already added
    const alreadyFavorited = favorite.some((fav) => fav.id === emojie.id);

    if (alreadyFavorited) {
      return { success: false, message: "Already in favorites!" };
    }

    // add the emoji to favorites array
    setFavorite([...favorite, emojie]);
    return { success: true, message: "Added to favorites" };
  };
  //function to toggle selection of an emojie
  const toggleSlection = (emojie) => {
    // if the same emoji is clicked again, unselect it
    if (selected?.id === emojie.id) {
      setSelected(null);
    } else {
      setSelected(emojie);
    }
  };
  //  function to check if an emojie is in favorites
  const isFavorited = (emojieId) => {
    return favorite.some((fav) => fav.id === emojieId);
  };

  // function to clear the current selection
  const clearSelection = () => {
    setSelected(null);
  };

  const value = {
    favorite,
    selected,
    addToFavorite,
    toggleSlection,
    isFavorited,
    clearSelection,
  };
  return (
    <favoriteContext.Provider value={value}>
      {children}
    </favoriteContext.Provider>
  );
  // creating a custom hook
};
export const useFavEmojie = () => {
  const context = useContext(favoriteContext);
  if (!context) {
    throw new Error(
      "useFavEmojie must be used within FavoriteConntectProvider"
    );
  }
  return context;
};
