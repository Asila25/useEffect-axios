import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [limit, setLimit] = useState(8);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/recipes/tags`)
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `https://dummyjson.com/recipes`;

    if (selectedTag) {
      url = `https://dummyjson.com/recipes/tag/${selectedTag}`;
    }

    axios
      .get(url)
      .then((res) => {
        setRecipes(res.data.recipes);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedTag]);

  useEffect(() => {
    setDisplayedRecipes(recipes.slice(0, limit));
  }, [recipes, limit]);

  const handleSeeMore = () => {
    setLimit((prevLimit) => prevLimit + 4);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setLimit(8);
  };

  const clearTagFilter = () => {
    setSelectedTag(null);
    setLimit(8);
  };

  const handleChangeMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const showRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="text-center text-4xl text-blue-500 mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-xl font-bold text-red-500 text-center mt-10">
        Error loading recipes
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-800 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-4xl text-blue-900 dark:text-blue-100">
            Recipes
          </h1>
          <button
            onClick={handleChangeMode}
            className="flex items-center gap-2 border border-gray-400 dark:border-gray-600 p-2 px-4 rounded-full bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 transition"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        <div className="mb-8">
          <h2 className="font-bold text-2xl text-blue-900 dark:text-blue-100 mb-4">
            Filter by Tags
          </h2>
          {/* Tag buttonlar uchun container */}
          <div className="relative w-full mb-4">
            <div className="flex gap-3 pb-2 overflow-x-auto w-full">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedTag && (
          <div className="flex items-center mb-4">
            <span className="text-gray-700 dark:text-gray-300 mr-2">
              Filtered by:
            </span>
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full flex items-center">
              {selectedTag}
              <button
                onClick={clearTagFilter}
                className="ml-2 text-blue-800 dark:text-blue-100 hover:text-blue-900 dark:hover:text-blue-200"
              >
                <FaTimes size={12} />
              </button>
            </div>
          </div>
        )}

        {loading && recipes.length > 0 ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => showRecipeDetails(recipe)}
                  className="border border-gray-300 dark:border-gray-500 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden shadow hover:shadow-lg transition cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="text-white text-sm flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-600/80 px-2 py-0.5 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {recipe.tags.length > 3 && (
                          <span className="bg-gray-600/80 px-2 py-0.5 rounded-full text-xs">
                            +{recipe.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-blue-900 dark:text-blue-100 text-xl font-semibold mb-2 line-clamp-2">
                      {recipe.name}
                    </h2>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {recipe.cuisine || "Mixed"}
                      </span>
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs px-2 py-1 rounded">
                        {recipe.difficulty || "Medium"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayedRecipes.length < recipes.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleSeeMore}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-full px-6 py-2 shadow transition"
                >
                  See More
                </button>
              </div>
            )}

            {recipes.length === 0 && (
              <div className="text-center py-10 text-gray-600 dark:text-gray-400">
                <p className="text-xl mb-2">No recipes found</p>
                {selectedTag && (
                  <p>
                    Try selecting a different tag or{" "}
                    <button
                      onClick={clearTagFilter}
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      clear filters
                    </button>
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="relative">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={closeRecipeDetails}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                {selectedRecipe.name}
              </h2>

              {/* <div className="flex flex-wrap gap-2 mb-4">
                {selectedRecipe.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div> */}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Prep Time
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {selectedRecipe.prepTimeMinutes} min
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Cook Time
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {selectedRecipe.cookTimeMinutes} min
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Servings
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {selectedRecipe.servings}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Difficulty
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {selectedRecipe.difficulty}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Ingredients
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Instructions
                </h3>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700 dark:text-gray-300">
                  {selectedRecipe.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Cuisine:</span>{" "}
                  {selectedRecipe.cuisine}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Calories:</span>{" "}
                  {selectedRecipe.caloriesPerServing} per serving
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
