defmodule FunZoom.NewsScraping.AllNewsApi do
  alias FunZoom.NewsScraping.AllNewsApiContract

  @impl AllNewsApiContract
  def top_stories() do
    HTTPoison.get!(@news_url)
    |> Map.get(:body)
    |> FunZoom.AllsidesParser.get_top_stories()
  end
end
