defmodule FunZoom.NewsScraping.AllNewsApiContract do
  alias FunZoom.NewsScraping.Article

  @callback top_stories() :: list(Article.t())
end