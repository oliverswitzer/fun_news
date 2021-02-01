defmodule FunZoom.NewsScraping.AllNewsApiContract do
  alias FunZoom.Article

  @callback top_stories() :: list(Article.t())
end