defmodule FunZoom.NewsScraping.AllNewsApiContract do
  alias FunZoom.NewsCategory

  @callback top_categories() :: list(NewsCategory.t())
end