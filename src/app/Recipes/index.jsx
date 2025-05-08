import axios from "axios";
import React, { useEffect, useState } from "react";

const Recipes = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const [recipes, setRecipes] = useState([]);
  const [limit, setLimit] = useState(6);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/recipes/tags`)
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/recipes`)
      .then((res) => {
        setRecipes(res.data.recipes);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setDisplayedRecipes(recipes.slice(0, limit));
  }, [recipes, limit]);

  const handleSeeMore = () => {
    setLimit((prevLimit) => prevLimit + 4);
  };

  if (loading) {
    return <div className="text-center text-4xl text-blue-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-xl font-bold text-red-500 text-center">
        Error loading recipes
      </div>
    );
  }

  const handleChaneMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="p-2 dark:bg-gray-800">
      <button
        onClick={handleChaneMode}
        className="border border-gray-500  p-2 rounded-2xl bg-sky-600 text-white font-bold"
      >
        Dark
      </button>

      <h1 className="font-bold text-center mb-3 text-4xl text-blue-900 dark:text-blue-100">
        Recipes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8  p-2 ">
        {displayedRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="align-middle justify-center  flex-col border border-gray-300 rounded-2xl bg-gray-200 dark:bg-gray-600 dark:border-gray-500"
          >
            <img
              src={recipe.image}
              alt={recipe.name}
              className=" rounded-2xl"
            />
            <h2 className="text-blue-900 mb-3 mt-5 text-2xl text-center dark:text-blue-100">
              {recipe.name}
            </h2>
          </div>
        ))}
      </div>

      {displayedRecipes.length < recipes.length && (
        <button
          onClick={handleSeeMore}
          className="w-[120px] bg-sky-600 text-white font-bold rounded-2xl p-2 "
        >
          See More
        </button>
      )}
    </div>
  );
};

export default Recipes;
